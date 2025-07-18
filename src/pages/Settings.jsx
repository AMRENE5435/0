import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings as SettingsIcon, Globe, Shield, Bell, Palette, Code, Database, Mail, Key } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings()
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (settings) => api.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update settings');
    }
  });

  const settings = settingsData || {
    general: {
      site_name: 'Marrakech Reviews',
      site_description: 'Discover the best of Marrakech',
      site_url: 'https://www.marrakech.reviews',
      admin_email: 'admin@marrakech.reviews',
      timezone: 'Africa/Casablanca',
      language: 'en'
    },
    seo: {
      meta_title: 'Marrakech Reviews - Discover the Best of Marrakech',
      meta_description: 'Find the best restaurants, hotels, and activities in Marrakech with authentic reviews and recommendations.',
      meta_keywords: 'marrakech, morocco, restaurants, hotels, travel, reviews',
      google_analytics_id: '',
      google_search_console: '',
      facebook_pixel_id: '',
      canonical_url: 'https://www.marrakech.reviews',
      robots_txt: 'User-agent: *\nAllow: /',
      sitemap_enabled: true
    },
    social: {
      facebook_url: '',
      instagram_url: '',
      twitter_url: '',
      youtube_url: '',
      linkedin_url: ''
    },
    email: {
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      smtp_encryption: 'tls',
      from_email: 'noreply@marrakech.reviews',
      from_name: 'Marrakech Reviews'
    },
    api: {
      google_maps_api_key: '',
      tripadvisor_api_key: '',
      openai_api_key: '',
      rate_limit_enabled: true,
      rate_limit_requests: 100,
      rate_limit_window: 60
    },
    security: {
      two_factor_enabled: false,
      session_timeout: 3600,
      password_min_length: 8,
      login_attempts_limit: 5,
      ip_whitelist_enabled: false,
      ip_whitelist: []
    },
    notifications: {
      email_notifications: true,
      new_review_notifications: true,
      new_contact_notifications: true,
      newsletter_signup_notifications: true,
      system_notifications: true
    }
  };

  const handleSettingUpdate = (category, field, value) => {
    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    };
    updateSettingsMutation.mutate(updatedSettings);
  };

  const handleBulkUpdate = (category, updates) => {
    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        ...updates
      }
    };
    updateSettingsMutation.mutate(updatedSettings);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your website settings and preferences</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic website configuration and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.general.site_name}
                    onChange={(e) => handleSettingUpdate('general', 'site_name', e.target.value)}
                    placeholder="Your website name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="site_url">Site URL</Label>
                  <Input
                    id="site_url"
                    value={settings.general.site_url}
                    onChange={(e) => handleSettingUpdate('general', 'site_url', e.target.value)}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.general.site_description}
                  onChange={(e) => handleSettingUpdate('general', 'site_description', e.target.value)}
                  placeholder="Brief description of your website"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin_email">Admin Email</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    value={settings.general.admin_email}
                    onChange={(e) => handleSettingUpdate('general', 'admin_email', e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={settings.general.timezone} 
                    onValueChange={(value) => handleSettingUpdate('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Casablanca">Africa/Casablanca</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="language">Default Language</Label>
                <Select 
                  value={settings.general.language} 
                  onValueChange={(value) => handleSettingUpdate('general', 'language', value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                SEO Configuration
              </CardTitle>
              <CardDescription>
                Search engine optimization settings and tracking codes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={settings.seo.meta_title}
                  onChange={(e) => handleSettingUpdate('seo', 'meta_title', e.target.value)}
                  placeholder="SEO-optimized title for your website"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.seo.meta_title.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={settings.seo.meta_description}
                  onChange={(e) => handleSettingUpdate('seo', 'meta_description', e.target.value)}
                  placeholder="SEO-optimized description for your website"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.seo.meta_description.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={settings.seo.meta_keywords}
                  onChange={(e) => handleSettingUpdate('seo', 'meta_keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                  <Input
                    id="google_analytics_id"
                    value={settings.seo.google_analytics_id}
                    onChange={(e) => handleSettingUpdate('seo', 'google_analytics_id', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                
                <div>
                  <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                  <Input
                    id="facebook_pixel_id"
                    value={settings.seo.facebook_pixel_id}
                    onChange={(e) => handleSettingUpdate('seo', 'facebook_pixel_id', e.target.value)}
                    placeholder="123456789012345"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="google_search_console">Google Search Console Verification</Label>
                <Input
                  id="google_search_console"
                  value={settings.seo.google_search_console}
                  onChange={(e) => handleSettingUpdate('seo', 'google_search_console', e.target.value)}
                  placeholder="google-site-verification=..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>XML Sitemap</Label>
                  <p className="text-sm text-gray-600">Automatically generate XML sitemap</p>
                </div>
                <Switch
                  checked={settings.seo.sitemap_enabled}
                  onCheckedChange={(checked) => handleSettingUpdate('seo', 'sitemap_enabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="robots_txt">Robots.txt</Label>
                <Textarea
                  id="robots_txt"
                  value={settings.seo.robots_txt}
                  onChange={(e) => handleSettingUpdate('seo', 'robots_txt', e.target.value)}
                  placeholder="User-agent: *\nAllow: /"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Configure your social media presence and links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={settings.social.facebook_url}
                  onChange={(e) => handleSettingUpdate('social', 'facebook_url', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={settings.social.instagram_url}
                  onChange={(e) => handleSettingUpdate('social', 'instagram_url', e.target.value)}
                  placeholder="https://instagram.com/youraccount"
                />
              </div>

              <div>
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  value={settings.social.twitter_url}
                  onChange={(e) => handleSettingUpdate('social', 'twitter_url', e.target.value)}
                  placeholder="https://twitter.com/youraccount"
                />
              </div>

              <div>
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  value={settings.social.youtube_url}
                  onChange={(e) => handleSettingUpdate('social', 'youtube_url', e.target.value)}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={settings.social.linkedin_url}
                  onChange={(e) => handleSettingUpdate('social', 'linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_host">SMTP Host</Label>
                  <Input
                    id="smtp_host"
                    value={settings.email.smtp_host}
                    onChange={(e) => handleSettingUpdate('email', 'smtp_host', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={settings.email.smtp_port}
                    onChange={(e) => handleSettingUpdate('email', 'smtp_port', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_username">SMTP Username</Label>
                  <Input
                    id="smtp_username"
                    value={settings.email.smtp_username}
                    onChange={(e) => handleSettingUpdate('email', 'smtp_username', e.target.value)}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtp_password">SMTP Password</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    value={settings.email.smtp_password}
                    onChange={(e) => handleSettingUpdate('email', 'smtp_password', e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtp_encryption">Encryption</Label>
                <Select 
                  value={settings.email.smtp_encryption} 
                  onValueChange={(value) => handleSettingUpdate('email', 'smtp_encryption', value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from_email">From Email</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={settings.email.from_email}
                    onChange={(e) => handleSettingUpdate('email', 'from_email', e.target.value)}
                    placeholder="noreply@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="from_name">From Name</Label>
                  <Input
                    id="from_name"
                    value={settings.email.from_name}
                    onChange={(e) => handleSettingUpdate('email', 'from_name', e.target.value)}
                    placeholder="Your Website Name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure API keys and rate limiting settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="google_maps_api_key">Google Maps API Key</Label>
                <Input
                  id="google_maps_api_key"
                  type="password"
                  value={settings.api.google_maps_api_key}
                  onChange={(e) => handleSettingUpdate('api', 'google_maps_api_key', e.target.value)}
                  placeholder="AIza..."
                />
              </div>

              <div>
                <Label htmlFor="tripadvisor_api_key">TripAdvisor API Key</Label>
                <Input
                  id="tripadvisor_api_key"
                  type="password"
                  value={settings.api.tripadvisor_api_key}
                  onChange={(e) => handleSettingUpdate('api', 'tripadvisor_api_key', e.target.value)}
                  placeholder="Your TripAdvisor API key"
                />
              </div>

              <div>
                <Label htmlFor="openai_api_key">OpenAI API Key</Label>
                <Input
                  id="openai_api_key"
                  type="password"
                  value={settings.api.openai_api_key}
                  onChange={(e) => handleSettingUpdate('api', 'openai_api_key', e.target.value)}
                  placeholder="sk-..."
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-gray-600">Enable API rate limiting</p>
                </div>
                <Switch
                  checked={settings.api.rate_limit_enabled}
                  onCheckedChange={(checked) => handleSettingUpdate('api', 'rate_limit_enabled', checked)}
                />
              </div>

              {settings.api.rate_limit_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rate_limit_requests">Requests per Window</Label>
                    <Input
                      id="rate_limit_requests"
                      type="number"
                      value={settings.api.rate_limit_requests}
                      onChange={(e) => handleSettingUpdate('api', 'rate_limit_requests', parseInt(e.target.value))}
                      placeholder="100"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rate_limit_window">Window (seconds)</Label>
                    <Input
                      id="rate_limit_window"
                      type="number"
                      value={settings.api.rate_limit_window}
                      onChange={(e) => handleSettingUpdate('api', 'rate_limit_window', parseInt(e.target.value))}
                      placeholder="60"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.security.two_factor_enabled}
                  onCheckedChange={(checked) => handleSettingUpdate('security', 'two_factor_enabled', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session_timeout">Session Timeout (seconds)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={settings.security.session_timeout}
                    onChange={(e) => handleSettingUpdate('security', 'session_timeout', parseInt(e.target.value))}
                    placeholder="3600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password_min_length">Minimum Password Length</Label>
                  <Input
                    id="password_min_length"
                    type="number"
                    value={settings.security.password_min_length}
                    onChange={(e) => handleSettingUpdate('security', 'password_min_length', parseInt(e.target.value))}
                    placeholder="8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login_attempts_limit">Login Attempts Limit</Label>
                <Input
                  id="login_attempts_limit"
                  type="number"
                  value={settings.security.login_attempts_limit}
                  onChange={(e) => handleSettingUpdate('security', 'login_attempts_limit', parseInt(e.target.value))}
                  placeholder="5"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>IP Whitelist</Label>
                  <p className="text-sm text-gray-600">Restrict admin access to specific IPs</p>
                </div>
                <Switch
                  checked={settings.security.ip_whitelist_enabled}
                  onCheckedChange={(checked) => handleSettingUpdate('security', 'ip_whitelist_enabled', checked)}
                />
              </div>

              {settings.security.ip_whitelist_enabled && (
                <div>
                  <Label htmlFor="ip_whitelist">Allowed IP Addresses</Label>
                  <Textarea
                    id="ip_whitelist"
                    value={settings.security.ip_whitelist.join('\n')}
                    onChange={(e) => handleSettingUpdate('security', 'ip_whitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
                    placeholder="192.168.1.1&#10;10.0.0.1"
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure email notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Enable email notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.email_notifications}
                  onCheckedChange={(checked) => handleSettingUpdate('notifications', 'email_notifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>New Review Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified when new reviews are submitted</p>
                </div>
                <Switch
                  checked={settings.notifications.new_review_notifications}
                  onCheckedChange={(checked) => handleSettingUpdate('notifications', 'new_review_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>New Contact Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified when new contact messages are received</p>
                </div>
                <Switch
                  checked={settings.notifications.new_contact_notifications}
                  onCheckedChange={(checked) => handleSettingUpdate('notifications', 'new_contact_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Newsletter Signup Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified when users subscribe to newsletter</p>
                </div>
                <Switch
                  checked={settings.notifications.newsletter_signup_notifications}
                  onCheckedChange={(checked) => handleSettingUpdate('notifications', 'newsletter_signup_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>System Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified about system updates and issues</p>
                </div>
                <Switch
                  checked={settings.notifications.system_notifications}
                  onCheckedChange={(checked) => handleSettingUpdate('notifications', 'system_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => updateSettingsMutation.mutate(settings)}
          disabled={updateSettingsMutation.isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {updateSettingsMutation.isLoading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;

