import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, X, Eye, Upload, Image, Link, Bold, Italic, List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

const ArticleEditor = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    seo_keywords: [],
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [newSEOKeyword, setNewSEOKeyword] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const contentRef = useRef(null);

  // Fetch categories and tags
  const { data: categoriesData } = useQuery({
    queryKey: ['article-categories'],
    queryFn: () => api.getArticleCategories()
  });

  const { data: tagsData } = useQuery({
    queryKey: ['article-tags'],
    queryFn: () => api.getArticleTags()
  });

  // Initialize form data
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        category: article.category || '',
        tags: article.tags || [],
        status: article.status || 'draft',
        featured_image: article.featured_image || '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        focus_keyword: article.focus_keyword || '',
        seo_keywords: article.seo_keywords || [],
        canonical_url: article.canonical_url || '',
        og_title: article.og_title || '',
        og_description: article.og_description || '',
        og_image: article.og_image || '',
        twitter_title: article.twitter_title || '',
        twitter_description: article.twitter_description || '',
        twitter_image: article.twitter_image || ''
      });
    }
  }, [article]);

  // Save article mutation
  const saveArticleMutation = useMutation({
    mutationFn: (data) => {
      if (article) {
        return api.updateArticle(article.id, data);
      } else {
        return api.createArticle(data);
      }
    },
    onSuccess: () => {
      toast.success(article ? 'Article updated successfully' : 'Article created successfully');
      onSave();
    },
    onError: (error) => {
      toast.error('Failed to save article');
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddSEOKeyword = () => {
    if (newSEOKeyword.trim() && !formData.seo_keywords.includes(newSEOKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seo_keywords: [...prev.seo_keywords, newSEOKeyword.trim()]
      }));
      setNewSEOKeyword('');
    }
  };

  const handleRemoveSEOKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      seo_keywords: prev.seo_keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  // Rich text editor functions
  const insertFormatting = (tag, placeholder = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const text = selectedText || placeholder;

    let formattedText = '';
    switch (tag) {
      case 'bold':
        formattedText = `**${text}**`;
        break;
      case 'italic':
        formattedText = `*${text}*`;
        break;
      case 'h1':
        formattedText = `# ${text}`;
        break;
      case 'h2':
        formattedText = `## ${text}`;
        break;
      case 'h3':
        formattedText = `### ${text}`;
        break;
      case 'ul':
        formattedText = `- ${text}`;
        break;
      case 'ol':
        formattedText = `1. ${text}`;
        break;
      case 'quote':
        formattedText = `> ${text}`;
        break;
      case 'code':
        formattedText = `\`${text}\``;
        break;
      case 'link':
        formattedText = `[${text || 'Link text'}](URL)`;
        break;
      case 'image':
        formattedText = `![${text || 'Alt text'}](Image URL)`;
        break;
      default:
        formattedText = text;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);

    handleInputChange('content', newContent);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  const handleSave = (status = formData.status) => {
    const dataToSave = {
      ...formData,
      status
    };
    saveArticleMutation.mutate(dataToSave);
  };

  const categories = categoriesData?.categories || [];
  const availableTags = tagsData?.tags || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {article ? 'Edit Article' : 'Create New Article'}
          </h2>
          <p className="text-sm text-gray-600">
            Use the rich text editor and SEO tools to create engaging content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
              <CardDescription>
                Create your article content using the rich text editor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter article title..."
                  className="text-lg font-medium"
                />
              </div>

              {/* Rich Text Editor Toolbar */}
              <div className="border rounded-lg">
                <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('bold', 'Bold text')}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('italic', 'Italic text')}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('h1', 'Heading 1')}
                  >
                    <Heading1 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('h2', 'Heading 2')}
                  >
                    <Heading2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('h3', 'Heading 3')}
                  >
                    <Heading3 className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('ul', 'List item')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('ol', 'Numbered item')}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('quote', 'Quote text')}
                  >
                    <Quote className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('code', 'Code')}
                  >
                    <Code className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('link')}
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('image')}
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content Editor */}
                {isPreviewMode ? (
                  <div className="p-4 min-h-[400px] prose max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: formData.content.replace(/\n/g, '<br>') 
                    }} />
                  </div>
                ) : (
                  <Textarea
                    ref={contentRef}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Start writing your article content..."
                    className="min-h-[400px] border-0 resize-none focus:ring-0"
                  />
                )}
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the article..."
                  rows={3}
                />
              </div>

              {/* Featured Image */}
              <div>
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => handleInputChange('featured_image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Optimization</CardTitle>
              <CardDescription>
                Optimize your article for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Title */}
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="SEO-optimized title (50-60 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="SEO-optimized description (120-160 characters)"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>

              {/* Focus Keyword */}
              <div>
                <Label htmlFor="focus_keyword">Focus Keyword</Label>
                <Input
                  id="focus_keyword"
                  value={formData.focus_keyword}
                  onChange={(e) => handleInputChange('focus_keyword', e.target.value)}
                  placeholder="Primary keyword to optimize for"
                />
              </div>

              {/* SEO Keywords */}
              <div>
                <Label>SEO Keywords</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSEOKeyword}
                    onChange={(e) => setNewSEOKeyword(e.target.value)}
                    placeholder="Add SEO keyword..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSEOKeyword()}
                  />
                  <Button onClick={handleAddSEOKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seo_keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {keyword}
                      <X 
                        className="w-3 h-3 ml-1" 
                        onClick={() => handleRemoveSEOKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Canonical URL */}
              <div>
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  value={formData.canonical_url}
                  onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                  placeholder="https://www.marrakech.reviews/articles/..."
                />
              </div>

              {/* Open Graph */}
              <Separator />
              <h4 className="font-medium">Open Graph (Social Media)</h4>
              
              <div>
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={formData.og_title}
                  onChange={(e) => handleInputChange('og_title', e.target.value)}
                  placeholder="Title for social media sharing"
                />
              </div>

              <div>
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  value={formData.og_description}
                  onChange={(e) => handleInputChange('og_description', e.target.value)}
                  placeholder="Description for social media sharing"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  value={formData.og_image}
                  onChange={(e) => handleInputChange('og_image', e.target.value)}
                  placeholder="Image URL for social media sharing"
                />
              </div>

              {/* Twitter */}
              <Separator />
              <h4 className="font-medium">Twitter Card</h4>
              
              <div>
                <Label htmlFor="twitter_title">Twitter Title</Label>
                <Input
                  id="twitter_title"
                  value={formData.twitter_title}
                  onChange={(e) => handleInputChange('twitter_title', e.target.value)}
                  placeholder="Title for Twitter sharing"
                />
              </div>

              <div>
                <Label htmlFor="twitter_description">Twitter Description</Label>
                <Textarea
                  id="twitter_description"
                  value={formData.twitter_description}
                  onChange={(e) => handleInputChange('twitter_description', e.target.value)}
                  placeholder="Description for Twitter sharing"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="twitter_image">Twitter Image URL</Label>
                <Input
                  id="twitter_image"
                  value={formData.twitter_image}
                  onChange={(e) => handleInputChange('twitter_image', e.target.value)}
                  placeholder="Image URL for Twitter sharing"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Settings</CardTitle>
              <CardDescription>
                Configure article category, tags, and publication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer">
                      {tag}
                      <X 
                        className="w-3 h-3 ml-1" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                {availableTags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Suggested tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {availableTags
                        .filter(tag => !formData.tags.includes(tag))
                        .slice(0, 10)
                        .map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="cursor-pointer text-xs"
                            onClick={() => handleInputChange('tags', [...formData.tags, tag])}
                          >
                            + {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saveArticleMutation.isLoading}
          >
            Save as Draft
          </Button>
          {formData.status !== 'published' && (
            <Button
              onClick={() => handleSave('published')}
              disabled={saveArticleMutation.isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Publish
            </Button>
          )}
          {formData.status === 'published' && (
            <Button
              onClick={() => handleSave('published')}
              disabled={saveArticleMutation.isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Update
            </Button>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          {saveArticleMutation.isLoading && 'Saving...'}
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;

