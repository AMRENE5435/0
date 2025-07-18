import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Edit, Trash2, Eye, BarChart3, Globe, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import ArticleEditor from '../components/Articles/ArticleEditor';
import SEOOptimizer from '../components/Articles/SEOOptimizer';

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSEODialogOpen, setIsSEODialogOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch articles
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles', currentPage, searchTerm, statusFilter, categoryFilter],
    queryFn: () => api.getArticles({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter === 'all' ? undefined : statusFilter,
      category: categoryFilter === 'all' ? undefined : categoryFilter
    })
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['article-categories'],
    queryFn: () => api.getArticleCategories()
  });

  // Delete article mutation
  const deleteArticleMutation = useMutation({
    mutationFn: (articleId) => api.deleteArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      toast.success('Article deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete article');
    }
  });

  const handleDeleteArticle = (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticleMutation.mutate(articleId);
    }
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setIsEditorOpen(true);
  };

  const handleSEOOptimize = (article) => {
    setSelectedArticle(article);
    setIsSEODialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const articles = articlesData?.articles || [];
  const totalArticles = articlesData?.total || 0;
  const categories = categoriesData?.categories || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your website articles with advanced SEO tools</p>
        </div>
        <Button 
          onClick={() => setIsEditorOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {articles.filter(a => a.status === 'published').length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">
                  {articles.filter(a => a.status === 'draft').length}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Edit className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg SEO Score</p>
                <p className="text-2xl font-bold text-orange-600">78</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>
            Manage your website articles with advanced editing and SEO optimization tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first article</p>
              <Button onClick={() => setIsEditorOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Article
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{article.title}</h3>
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                        {article.category && (
                          <Badge variant="outline">
                            {article.category}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {new Date(article.created_at).toLocaleDateString()}</span>
                        {article.published_at && (
                          <span>Published: {new Date(article.published_at).toLocaleDateString()}</span>
                        )}
                        {article.reading_time && (
                          <span>{article.reading_time} min read</span>
                        )}
                        {article.seo_score && (
                          <div className="flex items-center gap-1">
                            <span>SEO Score:</span>
                            <span className={`font-medium ${
                              article.seo_score >= 80 ? 'text-green-600' :
                              article.seo_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {article.seo_score}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSEOOptimize(article)}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditArticle(article)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Article Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedArticle ? 'Edit Article' : 'Create New Article'}
            </DialogTitle>
            <DialogDescription>
              Use the advanced editor with SEO optimization tools to create engaging content
            </DialogDescription>
          </DialogHeader>
          <ArticleEditor
            article={selectedArticle}
            onSave={() => {
              setIsEditorOpen(false);
              setSelectedArticle(null);
              queryClient.invalidateQueries(['articles']);
            }}
            onCancel={() => {
              setIsEditorOpen(false);
              setSelectedArticle(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* SEO Optimizer Dialog */}
      <Dialog open={isSEODialogOpen} onOpenChange={setIsSEODialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SEO Optimization</DialogTitle>
            <DialogDescription>
              Optimize your article for search engines and improve rankings
            </DialogDescription>
          </DialogHeader>
          {selectedArticle && (
            <SEOOptimizer
              article={selectedArticle}
              onSave={() => {
                setIsSEODialogOpen(false);
                setSelectedArticle(null);
                queryClient.invalidateQueries(['articles']);
              }}
              onCancel={() => {
                setIsSEODialogOpen(false);
                setSelectedArticle(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Articles;

