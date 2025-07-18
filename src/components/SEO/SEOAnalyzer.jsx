import React, { useState, useEffect } from 'react';
import { Search, Target, TrendingUp, AlertCircle, CheckCircle, XCircle, BarChart3, Eye, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';

const SEOAnalyzer = ({ content, title, metaDescription, targetKeyword, onOptimizationUpdate }) => {
  const [seoScore, setSeoScore] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keywordDensity, setKeywordDensity] = useState({});
  const [readabilityScore, setReadabilityScore] = useState(0);

  // SEO Analysis Functions
  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysisResult = performSEOAnalysis(content, title, metaDescription, targetKeyword);
      setAnalysis(analysisResult);
      setSeoScore(analysisResult.overallScore);
      setKeywordDensity(analysisResult.keywordDensity);
      setReadabilityScore(analysisResult.readabilityScore);
      
      if (onOptimizationUpdate) {
        onOptimizationUpdate(analysisResult);
      }
    } catch (error) {
      console.error('SEO analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performSEOAnalysis = (content, title, metaDescription, targetKeyword) => {
    const analysis = {
      overallScore: 0,
      factors: [],
      recommendations: [],
      keywordDensity: {},
      readabilityScore: 0,
      competitorAnalysis: {},
      technicalSEO: {}
    };

    let totalScore = 0;
    let factorCount = 0;

    // Title Analysis
    const titleAnalysis = analyzeTitleTag(title, targetKeyword);
    analysis.factors.push(titleAnalysis);
    totalScore += titleAnalysis.score;
    factorCount++;

    // Meta Description Analysis
    const metaAnalysis = analyzeMetaDescription(metaDescription, targetKeyword);
    analysis.factors.push(metaAnalysis);
    totalScore += metaAnalysis.score;
    factorCount++;

    // Content Analysis
    const contentAnalysis = analyzeContentQuality(content, targetKeyword);
    analysis.factors.push(...contentAnalysis.factors);
    totalScore += contentAnalysis.totalScore;
    factorCount += contentAnalysis.factors.length;

    // Keyword Density Analysis
    analysis.keywordDensity = analyzeKeywordDensity(content, targetKeyword);

    // Readability Analysis
    analysis.readabilityScore = analyzeReadability(content);

    // Calculate overall score
    analysis.overallScore = Math.round(totalScore / factorCount);

    // Generate recommendations
    analysis.recommendations = generateRecommendations(analysis);

    // Simulate competitor analysis
    analysis.competitorAnalysis = generateCompetitorAnalysis(targetKeyword);

    // Technical SEO checks
    analysis.technicalSEO = performTechnicalSEOChecks();

    return analysis;
  };

  const analyzeTitleTag = (title, keyword) => {
    let score = 0;
    const issues = [];
    const recommendations = [];

    if (!title) {
      issues.push('Missing title tag');
      recommendations.push('Add a descriptive title tag');
      return { name: 'Title Tag', score: 0, status: 'error', issues, recommendations };
    }

    // Length check
    if (title.length < 30) {
      issues.push('Title too short');
      recommendations.push('Expand title to 50-60 characters');
      score += 20;
    } else if (title.length > 60) {
      issues.push('Title too long');
      recommendations.push('Shorten title to under 60 characters');
      score += 60;
    } else {
      score += 100;
    }

    // Keyword presence
    if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) {
      score += 100;
    } else {
      issues.push('Target keyword not in title');
      recommendations.push(`Include "${keyword}" in the title`);
    }

    // Keyword position
    if (keyword && title.toLowerCase().indexOf(keyword.toLowerCase()) === 0) {
      score += 50;
    } else if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) {
      recommendations.push('Move target keyword closer to the beginning');
      score += 25;
    }

    const finalScore = Math.round(score / 2.5);
    const status = finalScore >= 80 ? 'success' : finalScore >= 60 ? 'warning' : 'error';

    return {
      name: 'Title Tag',
      score: finalScore,
      status,
      issues,
      recommendations,
      details: {
        length: title.length,
        hasKeyword: keyword ? title.toLowerCase().includes(keyword.toLowerCase()) : false,
        keywordPosition: keyword ? title.toLowerCase().indexOf(keyword.toLowerCase()) : -1
      }
    };
  };

  const analyzeMetaDescription = (metaDescription, keyword) => {
    let score = 0;
    const issues = [];
    const recommendations = [];

    if (!metaDescription) {
      issues.push('Missing meta description');
      recommendations.push('Add a compelling meta description');
      return { name: 'Meta Description', score: 0, status: 'error', issues, recommendations };
    }

    // Length check
    if (metaDescription.length < 120) {
      issues.push('Meta description too short');
      recommendations.push('Expand meta description to 150-160 characters');
      score += 60;
    } else if (metaDescription.length > 160) {
      issues.push('Meta description too long');
      recommendations.push('Shorten meta description to under 160 characters');
      score += 70;
    } else {
      score += 100;
    }

    // Keyword presence
    if (keyword && metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      score += 100;
    } else {
      issues.push('Target keyword not in meta description');
      recommendations.push(`Include "${keyword}" in the meta description`);
    }

    const finalScore = Math.round(score / 2);
    const status = finalScore >= 80 ? 'success' : finalScore >= 60 ? 'warning' : 'error';

    return {
      name: 'Meta Description',
      score: finalScore,
      status,
      issues,
      recommendations,
      details: {
        length: metaDescription.length,
        hasKeyword: keyword ? metaDescription.toLowerCase().includes(keyword.toLowerCase()) : false
      }
    };
  };

  const analyzeContentQuality = (content, keyword) => {
    const factors = [];
    let totalScore = 0;

    // Content length
    const wordCount = content ? content.split(/\s+/).length : 0;
    let lengthScore = 0;
    const lengthIssues = [];
    const lengthRecommendations = [];

    if (wordCount < 300) {
      lengthIssues.push('Content too short');
      lengthRecommendations.push('Expand content to at least 300 words');
      lengthScore = 30;
    } else if (wordCount < 600) {
      lengthRecommendations.push('Consider expanding content for better coverage');
      lengthScore = 70;
    } else {
      lengthScore = 100;
    }

    factors.push({
      name: 'Content Length',
      score: lengthScore,
      status: lengthScore >= 80 ? 'success' : lengthScore >= 60 ? 'warning' : 'error',
      issues: lengthIssues,
      recommendations: lengthRecommendations,
      details: { wordCount }
    });
    totalScore += lengthScore;

    // Keyword usage
    const keywordAnalysis = analyzeKeywordUsage(content, keyword);
    factors.push(keywordAnalysis);
    totalScore += keywordAnalysis.score;

    // Heading structure
    const headingAnalysis = analyzeHeadingStructure(content);
    factors.push(headingAnalysis);
    totalScore += headingAnalysis.score;

    // Internal links (simulated)
    const linkAnalysis = analyzeLinkStructure(content);
    factors.push(linkAnalysis);
    totalScore += linkAnalysis.score;

    return { factors, totalScore };
  };

  const analyzeKeywordUsage = (content, keyword) => {
    if (!keyword || !content) {
      return {
        name: 'Keyword Usage',
        score: 0,
        status: 'error',
        issues: ['No target keyword specified'],
        recommendations: ['Set a target keyword for analysis'],
        details: { density: 0, count: 0 }
      };
    }

    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
    const density = (keywordCount / words.length) * 100;

    let score = 0;
    const issues = [];
    const recommendations = [];

    if (density === 0) {
      issues.push('Target keyword not found in content');
      recommendations.push(`Include "${keyword}" naturally in the content`);
      score = 0;
    } else if (density < 0.5) {
      issues.push('Keyword density too low');
      recommendations.push(`Increase usage of "${keyword}" (aim for 0.5-2%)`);
      score = 40;
    } else if (density > 3) {
      issues.push('Keyword density too high (keyword stuffing)');
      recommendations.push(`Reduce usage of "${keyword}" to avoid keyword stuffing`);
      score = 50;
    } else {
      score = 100;
    }

    const status = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error';

    return {
      name: 'Keyword Usage',
      score,
      status,
      issues,
      recommendations,
      details: { density: density.toFixed(2), count: keywordCount }
    };
  };

  const analyzeHeadingStructure = (content) => {
    // Simulate heading analysis
    const headingCount = (content.match(/#{1,6}\s/g) || []).length;
    
    let score = 0;
    const issues = [];
    const recommendations = [];

    if (headingCount === 0) {
      issues.push('No headings found');
      recommendations.push('Add H2 and H3 headings to structure your content');
      score = 20;
    } else if (headingCount < 3) {
      recommendations.push('Consider adding more headings for better structure');
      score = 70;
    } else {
      score = 100;
    }

    const status = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error';

    return {
      name: 'Heading Structure',
      score,
      status,
      issues,
      recommendations,
      details: { headingCount }
    };
  };

  const analyzeLinkStructure = (content) => {
    // Simulate link analysis
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    
    let score = 0;
    const issues = [];
    const recommendations = [];

    if (linkCount === 0) {
      issues.push('No internal or external links found');
      recommendations.push('Add relevant internal and external links');
      score = 30;
    } else if (linkCount < 3) {
      recommendations.push('Consider adding more relevant links');
      score = 70;
    } else {
      score = 100;
    }

    const status = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error';

    return {
      name: 'Link Structure',
      score,
      status,
      issues,
      recommendations,
      details: { linkCount }
    };
  };

  const analyzeKeywordDensity = (content, keyword) => {
    if (!content || !keyword) return {};

    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    // Analyze main keyword
    const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
    const density = (keywordCount / totalWords) * 100;

    // Generate related keywords (simulated)
    const relatedKeywords = generateRelatedKeywords(keyword);
    const keywordData = { [keyword]: { count: keywordCount, density: density.toFixed(2) } };

    relatedKeywords.forEach(relatedKeyword => {
      const count = words.filter(word => word.includes(relatedKeyword.toLowerCase())).length;
      const relatedDensity = (count / totalWords) * 100;
      keywordData[relatedKeyword] = { count, density: relatedDensity.toFixed(2) };
    });

    return keywordData;
  };

  const analyzeReadability = (content) => {
    if (!content) return 0;

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Simple readability score (Flesch-like)
    let score = 100;
    
    if (avgWordsPerSentence > 20) {
      score -= 20;
    } else if (avgWordsPerSentence > 15) {
      score -= 10;
    }

    // Check for complex words (more than 3 syllables - simplified)
    const complexWords = words.filter(word => word.length > 8).length;
    const complexWordRatio = (complexWords / words.length) * 100;
    
    if (complexWordRatio > 15) {
      score -= 20;
    } else if (complexWordRatio > 10) {
      score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  };

  const generateRelatedKeywords = (keyword) => {
    // Simulate related keyword generation
    const relatedKeywords = [
      `${keyword} guide`,
      `best ${keyword}`,
      `${keyword} tips`,
      `how to ${keyword}`,
      `${keyword} review`
    ];
    return relatedKeywords.slice(0, 3);
  };

  const generateRecommendations = (analysis) => {
    const recommendations = [];
    
    analysis.factors.forEach(factor => {
      if (factor.score < 80) {
        recommendations.push(...factor.recommendations);
      }
    });

    // Add general recommendations
    if (analysis.overallScore < 70) {
      recommendations.push('Focus on improving content quality and keyword optimization');
      recommendations.push('Consider competitor analysis to identify content gaps');
    }

    if (analysis.readabilityScore < 70) {
      recommendations.push('Improve readability by using shorter sentences and simpler words');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  };

  const generateCompetitorAnalysis = (keyword) => {
    // Simulate competitor analysis
    return {
      topCompetitors: [
        { url: 'competitor1.com', score: 85, title: 'Best Guide to ' + keyword },
        { url: 'competitor2.com', score: 82, title: keyword + ' Complete Tutorial' },
        { url: 'competitor3.com', score: 78, title: 'Ultimate ' + keyword + ' Resource' }
      ],
      averageScore: 82,
      averageWordCount: 1200,
      commonKeywords: ['guide', 'best', 'complete', 'ultimate']
    };
  };

  const performTechnicalSEOChecks = () => {
    // Simulate technical SEO checks
    return {
      pageSpeed: { score: 85, status: 'good' },
      mobileOptimization: { score: 90, status: 'excellent' },
      schemaMarkup: { score: 60, status: 'needs_improvement' },
      imageOptimization: { score: 75, status: 'good' }
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  useEffect(() => {
    if (content && title && targetKeyword) {
      analyzeContent();
    }
  }, [content, title, metaDescription, targetKeyword]);

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            SEO Analysis Overview
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your content's SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(seoScore)}`}>
                {seoScore}
              </div>
              <div className="text-sm text-gray-600">Overall SEO Score</div>
              <Progress value={seoScore} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(readabilityScore)}`}>
                {readabilityScore}
              </div>
              <div className="text-sm text-gray-600">Readability Score</div>
              <Progress value={readabilityScore} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {content ? content.split(/\s+/).length : 0}
              </div>
              <div className="text-sm text-gray-600">Word Count</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Object.keys(keywordDensity).length}
              </div>
              <div className="text-sm text-gray-600">Keywords Analyzed</div>
            </div>
          </div>

          <div className="mt-4">
            <Button 
              onClick={analyzeContent} 
              disabled={isAnalyzing || !content || !targetKeyword}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Re-analyze Content'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Tabs defaultValue="factors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="factors">SEO Factors</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          {/* SEO Factors Tab */}
          <TabsContent value="factors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Factor Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of individual SEO factors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.factors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(factor.status)}
                        <span className="font-medium">{factor.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(factor.score)}`}>
                          {factor.score}/100
                        </span>
                        <Progress value={factor.score} className="w-20" />
                      </div>
                    </div>
                    
                    {factor.issues.length > 0 && (
                      <div className="mb-2">
                        <div className="text-sm font-medium text-red-600 mb-1">Issues:</div>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {factor.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {factor.recommendations.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-blue-600 mb-1">Recommendations:</div>
                        <ul className="text-sm text-blue-600 list-disc list-inside">
                          {factor.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Density Analysis</CardTitle>
                <CardDescription>
                  Analysis of keyword usage and density in your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(keywordDensity).map(([keyword, data]) => (
                    <div key={keyword} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{keyword}</div>
                        <div className="text-sm text-gray-600">
                          Used {data.count} times
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{data.density}%</div>
                        <div className="text-sm text-gray-600">density</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
                <CardDescription>
                  Actionable steps to improve your content's SEO performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <Alert key={index}>
                      <TrendingUp className="w-4 h-4" />
                      <AlertDescription>{recommendation}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>
                  How your content compares to top-ranking competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysis.competitorAnalysis.averageScore}
                      </div>
                      <div className="text-sm text-gray-600">Avg Competitor Score</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {analysis.competitorAnalysis.averageWordCount}
                      </div>
                      <div className="text-sm text-gray-600">Avg Word Count</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-2xl font-bold text-purple-600">
                        {analysis.competitorAnalysis.topCompetitors.length}
                      </div>
                      <div className="text-sm text-gray-600">Top Competitors</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {analysis.competitorAnalysis.topCompetitors.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{competitor.url}</div>
                          <div className="text-sm text-gray-600">{competitor.title}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getScoreColor(competitor.score)}`}>
                            {competitor.score}/100
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical SEO Tab */}
          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical SEO Checks</CardTitle>
                <CardDescription>
                  Technical aspects that affect your content's SEO performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysis.technicalSEO).map(([check, data]) => (
                    <div key={check} className="p-4 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium capitalize">
                          {check.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <Badge variant={data.status === 'excellent' ? 'default' : data.status === 'good' ? 'secondary' : 'destructive'}>
                          {data.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={data.score} className="flex-1" />
                        <span className={`font-bold ${getScoreColor(data.score)}`}>
                          {data.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SEOAnalyzer;

