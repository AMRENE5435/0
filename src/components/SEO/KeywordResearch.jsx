import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Target, BarChart3, Download, RefreshCw, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const KeywordResearch = ({ onKeywordSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [keywordMetrics, setKeywordMetrics] = useState({});
  const [longTailKeywords, setLongTailKeywords] = useState([]);
  const [competitorKeywords, setCompetitorKeywords] = useState([]);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'MA', name: 'Morocco' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' }
  ];

  const performKeywordResearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock keyword data
      const mockKeywords = generateMockKeywords(searchTerm);
      setKeywords(mockKeywords);

      // Generate long-tail keywords
      const longTail = generateLongTailKeywords(searchTerm);
      setLongTailKeywords(longTail);

      // Generate competitor keywords
      const competitor = generateCompetitorKeywords(searchTerm);
      setCompetitorKeywords(competitor);

      // Generate keyword metrics
      const metrics = generateKeywordMetrics(mockKeywords);
      setKeywordMetrics(metrics);

    } catch (error) {
      console.error('Keyword research failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockKeywords = (baseTerm) => {
    const variations = [
      baseTerm,
      `${baseTerm} guide`,
      `best ${baseTerm}`,
      `${baseTerm} tips`,
      `how to ${baseTerm}`,
      `${baseTerm} review`,
      `${baseTerm} 2024`,
      `${baseTerm} for beginners`,
      `${baseTerm} tutorial`,
      `${baseTerm} examples`,
      `${baseTerm} benefits`,
      `${baseTerm} cost`,
      `${baseTerm} vs`,
      `${baseTerm} comparison`,
      `${baseTerm} tools`
    ];

    return variations.map((keyword, index) => ({
      keyword,
      searchVolume: Math.floor(Math.random() * 10000) + 100,
      difficulty: Math.floor(Math.random() * 100),
      cpc: (Math.random() * 5 + 0.1).toFixed(2),
      competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      trend: Math.random() > 0.5 ? 'up' : 'down',
      intent: ['Informational', 'Commercial', 'Transactional', 'Navigational'][Math.floor(Math.random() * 4)]
    }));
  };

  const generateLongTailKeywords = (baseTerm) => {
    const longTailVariations = [
      `how to use ${baseTerm} for beginners`,
      `best ${baseTerm} tools for small business`,
      `${baseTerm} vs alternatives comparison 2024`,
      `step by step ${baseTerm} tutorial`,
      `${baseTerm} benefits and drawbacks`,
      `free ${baseTerm} resources and tools`,
      `${baseTerm} case studies and examples`,
      `common ${baseTerm} mistakes to avoid`,
      `${baseTerm} pricing and cost analysis`,
      `${baseTerm} implementation best practices`
    ];

    return longTailVariations.map((keyword, index) => ({
      keyword,
      searchVolume: Math.floor(Math.random() * 1000) + 50,
      difficulty: Math.floor(Math.random() * 50) + 10,
      cpc: (Math.random() * 3 + 0.1).toFixed(2),
      competition: 'Low',
      intent: 'Informational'
    }));
  };

  const generateCompetitorKeywords = (baseTerm) => {
    const competitors = [
      'competitor1.com',
      'competitor2.com',
      'competitor3.com'
    ];

    return competitors.map(competitor => ({
      domain: competitor,
      keywords: [
        `${baseTerm} solutions`,
        `professional ${baseTerm}`,
        `${baseTerm} services`,
        `enterprise ${baseTerm}`,
        `${baseTerm} consulting`
      ].map(keyword => ({
        keyword,
        position: Math.floor(Math.random() * 10) + 1,
        searchVolume: Math.floor(Math.random() * 5000) + 200,
        difficulty: Math.floor(Math.random() * 80) + 20
      }))
    }));
  };

  const generateKeywordMetrics = (keywords) => {
    return {
      totalKeywords: keywords.length,
      avgSearchVolume: Math.floor(keywords.reduce((sum, k) => sum + k.searchVolume, 0) / keywords.length),
      avgDifficulty: Math.floor(keywords.reduce((sum, k) => sum + k.difficulty, 0) / keywords.length),
      lowCompetition: keywords.filter(k => k.competition === 'Low').length,
      mediumCompetition: keywords.filter(k => k.competition === 'Medium').length,
      highCompetition: keywords.filter(k => k.competition === 'High').length
    };
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyBadge = (difficulty) => {
    if (difficulty < 30) return 'Easy';
    if (difficulty < 70) return 'Medium';
    return 'Hard';
  };

  const getIntentColor = (intent) => {
    switch (intent) {
      case 'Informational': return 'bg-blue-100 text-blue-800';
      case 'Commercial': return 'bg-green-100 text-green-800';
      case 'Transactional': return 'bg-purple-100 text-purple-800';
      case 'Navigational': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportKeywords = () => {
    const csvContent = [
      ['Keyword', 'Search Volume', 'Difficulty', 'CPC', 'Competition', 'Intent'],
      ...keywords.map(k => [k.keyword, k.searchVolume, k.difficulty, k.cpc, k.competition, k.intent])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords-${searchTerm}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Keyword Research
          </CardTitle>
          <CardDescription>
            Discover high-value keywords for your content strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <Label htmlFor="search-term">Seed Keyword</Label>
              <Input
                id="search-term"
                placeholder="Enter your main keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performKeywordResearch()}
              />
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={performKeywordResearch} 
              disabled={isLoading || !searchTerm.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Research Keywords
                </>
              )}
            </Button>
            
            {keywords.length > 0 && (
              <Button variant="outline" onClick={exportKeywords}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Keyword Metrics Overview */}
      {Object.keys(keywordMetrics).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Research Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {keywordMetrics.totalKeywords}
                </div>
                <div className="text-sm text-gray-600">Total Keywords</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {keywordMetrics.avgSearchVolume.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Avg Volume</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {keywordMetrics.avgDifficulty}
                </div>
                <div className="text-sm text-gray-600">Avg Difficulty</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {keywordMetrics.lowCompetition}
                </div>
                <div className="text-sm text-gray-600">Low Competition</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {keywordMetrics.mediumCompetition}
                </div>
                <div className="text-sm text-gray-600">Medium Competition</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {keywordMetrics.highCompetition}
                </div>
                <div className="text-sm text-gray-600">High Competition</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyword Results */}
      {keywords.length > 0 && (
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">Main Keywords</TabsTrigger>
            <TabsTrigger value="longtail">Long-tail Keywords</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Keywords</TabsTrigger>
          </TabsList>

          {/* Main Keywords Tab */}
          <TabsContent value="main">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Opportunities</CardTitle>
                <CardDescription>
                  Primary keyword variations and their metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>CPC</TableHead>
                      <TableHead>Competition</TableHead>
                      <TableHead>Intent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.map((keyword, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {keyword.keyword}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {keyword.searchVolume.toLocaleString()}
                            {keyword.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3 text-green-600" />
                            ) : (
                              <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={getDifficultyColor(keyword.difficulty)}>
                              {keyword.difficulty}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getDifficultyBadge(keyword.difficulty)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>${keyword.cpc}</TableCell>
                        <TableCell>
                          <Badge variant={keyword.competition === 'Low' ? 'default' : keyword.competition === 'Medium' ? 'secondary' : 'destructive'}>
                            {keyword.competition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getIntentColor(keyword.intent)}>
                            {keyword.intent}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onKeywordSelect && onKeywordSelect(keyword.keyword)}
                          >
                            <Target className="w-3 h-3 mr-1" />
                            Use
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Long-tail Keywords Tab */}
          <TabsContent value="longtail">
            <Card>
              <CardHeader>
                <CardTitle>Long-tail Keyword Opportunities</CardTitle>
                <CardDescription>
                  Lower competition, more specific keyword phrases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Long-tail Keyword</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>CPC</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {longTailKeywords.map((keyword, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {keyword.keyword}
                        </TableCell>
                        <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={getDifficultyColor(keyword.difficulty)}>
                            {keyword.difficulty}
                          </span>
                        </TableCell>
                        <TableCell>${keyword.cpc}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onKeywordSelect && onKeywordSelect(keyword.keyword)}
                          >
                            <Target className="w-3 h-3 mr-1" />
                            Use
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitor Keywords Tab */}
          <TabsContent value="competitors">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Keyword Analysis</CardTitle>
                <CardDescription>
                  Keywords your competitors are ranking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {competitorKeywords.map((competitor, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {competitor.domain}
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Volume</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {competitor.keywords.map((keyword, keywordIndex) => (
                            <TableRow key={keywordIndex}>
                              <TableCell className="font-medium">
                                {keyword.keyword}
                              </TableCell>
                              <TableCell>
                                <Badge variant={keyword.position <= 3 ? 'default' : keyword.position <= 10 ? 'secondary' : 'outline'}>
                                  #{keyword.position}
                                </Badge>
                              </TableCell>
                              <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                              <TableCell>
                                <span className={getDifficultyColor(keyword.difficulty)}>
                                  {keyword.difficulty}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => onKeywordSelect && onKeywordSelect(keyword.keyword)}
                                >
                                  <Target className="w-3 h-3 mr-1" />
                                  Target
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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

export default KeywordResearch;

