import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BarChart3, Target, TrendingUp, AlertCircle, CheckCircle, XCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

const SEOOptimizer = ({ article, onSave, onCancel }) => {
  const [seoAnalysis, setSeoAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch current SEO data
  const { data: seoData, isLoading } = useQuery({
    queryKey: ['article-seo', article.id],
    queryFn: () => api.getArticleSEO(article.id),
    enabled: !!article.id
  });

  // Analyze SEO mutation
  const analyzeSEOMutation = useMutation({
    mutationFn: () => api.analyzeArticleSEO(article.id),
    onSuccess: (data) => {
      setSeoAnalysis(data.analysis);
      setIsAnalyzing(false);
      toast.success('SEO analysis completed');
    },
    onError: (error) => {
      setIsAnalyzing(false);
      toast.error('Failed to analyze SEO');
    }
  });

  // Update SEO mutation
  const updateSEOMutation = useMutation({
    mutationFn: (seoData) => api.updateArticleSEO(article.id, { seo: seoData }),
    onSuccess: () => {
      toast.success('SEO data updated successfully');
      onSave();
    },
    onError: (error) => {
      toast.error('Failed to update SEO data');
    }
  });

  const handleAnalyzeSEO = () => {
    setIsAnalyzing(true);
    analyzeSEOMutation.mutate();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const currentSEO = seoData?.seo || {};
  const analysis = seoAnalysis || {
    seo_score: currentSEO.seo_score || 0,
    readability_score: currentSEO.readability_score || 0,
    word_count: currentSEO.word_count || 0,
    keyword_density: currentSEO.keyword_density || 0,
    internal_links: currentSEO.internal_links || 0,
    external_links: currentSEO.external_links || 0,
    suggestions: [],
    keyword_analysis: {},
    content_structure: {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">SEO Optimization</h2>
          <p className="text-sm text-gray-600">
            Analyze and optimize your article for better search engine rankings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleAnalyzeSEO}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze SEO'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        </div>
      </div>

      {/* SEO Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">SEO Score</span>
              <Target className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${getScoreColor(analysis.seo_score)}`}>
                {analysis.seo_score}%
              </div>
              <Progress 
                value={analysis.seo_score} 
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {analysis.seo_score >= 80 ? 'Excellent' : 
               analysis.seo_score >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Readability</span>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${getScoreColor(analysis.readability_score)}`}>
                {analysis.readability_score}%
              </div>
              <Progress 
                value={analysis.readability_score} 
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {analysis.content_structure?.reading_level || 'Medium'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Word Count</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-900">
                {analysis.word_count}
              </div>
              <div className="text-xs text-gray-500">
                words
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {analysis.word_count >= 300 ? 'Good length' : 'Too short'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Analysis Overview</CardTitle>
              <CardDescription>
                Detailed breakdown of your article's SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Keyword Density */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Keyword Density</p>
                  <p className="text-sm text-gray-600">
                    Focus keyword appears {analysis.keyword_density}% of the time
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    analysis.keyword_density >= 1 && analysis.keyword_density <= 3 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }>
                    {analysis.keyword_density}%
                  </Badge>
                  {analysis.keyword_density >= 1 && analysis.keyword_density <= 3 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
              </div>

              {/* Internal Links */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Internal Links</p>
                  <p className="text-sm text-gray-600">
                    Links to other pages on your website
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    analysis.internal_links >= 2 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }>
                    {analysis.internal_links}
                  </Badge>
                  {analysis.internal_links >= 2 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
              </div>

              {/* External Links */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">External Links</p>
                  <p className="text-sm text-gray-600">
                    Links to external authoritative sources
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    analysis.external_links >= 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }>
                    {analysis.external_links}
                  </Badge>
                  {analysis.external_links >= 1 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
              </div>

              {/* Meta Description */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Meta Description</p>
                  <p className="text-sm text-gray-600">
                    {currentSEO.meta_description ? 
                      `${currentSEO.meta_description.length} characters` : 
                      'Not set'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {currentSEO.meta_description && 
                   currentSEO.meta_description.length >= 120 && 
                   currentSEO.meta_description.length <= 160 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
              <CardDescription>
                Analysis of your focus keyword and related terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentSEO.focus_keyword ? (
                <div>
                  <h4 className="font-medium mb-3">Focus Keyword: "{currentSEO.focus_keyword}"</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Found in title</span>
                      {analysis.keyword_analysis?.focus_keyword_in_title ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Found in meta description</span>
                      {analysis.keyword_analysis?.focus_keyword_in_meta ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Found in content</span>
                      {analysis.keyword_analysis?.focus_keyword_found ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No focus keyword set. Add a focus keyword to improve SEO analysis.
                  </AlertDescription>
                </Alert>
              )}

              {currentSEO.seo_keywords && currentSEO.seo_keywords.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">SEO Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSEO.seo_keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis.keyword_analysis?.related_keywords && (
                <div>
                  <h4 className="font-medium mb-3">Related Keywords Found</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keyword_analysis.related_keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Structure Tab */}
        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Structure</CardTitle>
              <CardDescription>
                Analysis of your article's structure and readability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>H1 Heading</span>
                    {analysis.content_structure?.has_h1 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>H2 Subheadings</span>
                    {analysis.content_structure?.has_h2 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>H3 Subheadings</span>
                    {analysis.content_structure?.has_h3 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Paragraphs</span>
                      <span className="font-medium">
                        {analysis.content_structure?.paragraph_count || 0}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Avg Sentence Length</span>
                      <span className="font-medium">
                        {analysis.content_structure?.sentence_avg_length || 0} words
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Reading Level</span>
                      <Badge className={
                        analysis.content_structure?.reading_level === 'Easy' 
                          ? 'bg-green-100 text-green-800'
                          : analysis.content_structure?.reading_level === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }>
                        {analysis.content_structure?.reading_level || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Improvement Suggestions</CardTitle>
              <CardDescription>
                Actionable recommendations to improve your article's SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.suggestions && analysis.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Great job!</h3>
                  <p className="text-gray-600">
                    No major SEO issues found. Your article is well-optimized.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => window.open(`https://www.marrakech.reviews/articles/${article.slug}`, '_blank')}
        >
          View Live Article
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
          <Button 
            onClick={() => updateSEOMutation.mutate(currentSEO)}
            disabled={updateSEOMutation.isLoading}
          >
            Save SEO Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SEOOptimizer;

