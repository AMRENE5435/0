import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, Eye, Clock, Globe, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DatePickerWithRange } from '../components/ui/date-range-picker';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../lib/api';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [chartType, setChartType] = useState('visitors');

  // Fetch analytics overview
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => api.getAnalyticsOverview()
  });

  // Fetch chart data
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['analytics-chart', chartType, dateRange],
    queryFn: () => api.getAnalyticsChartData(chartType, dateRange)
  });

  // Fetch analytics events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['analytics-events'],
    queryFn: () => api.getAnalyticsEvents({ limit: 100 })
  });

  const overview = overviewData || {
    total_visitors: 0,
    monthly_visitors: 0,
    weekly_visitors: 0,
    daily_visitors: 0,
    page_views: 0,
    bounce_rate: 0,
    avg_session_duration: 0,
    top_pages: [],
    traffic_sources: []
  };

  const chart = chartData || { labels: [], data: [] };

  // Sample data for demonstration
  const visitorTrendData = [
    { date: '2024-01-01', visitors: 45, pageViews: 120 },
    { date: '2024-01-02', visitors: 52, pageViews: 140 },
    { date: '2024-01-03', visitors: 38, pageViews: 95 },
    { date: '2024-01-04', visitors: 65, pageViews: 180 },
    { date: '2024-01-05', visitors: 72, pageViews: 200 },
    { date: '2024-01-06', visitors: 58, pageViews: 155 },
    { date: '2024-01-07', visitors: 43, pageViews: 110 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 20, color: '#F59E0B' }
  ];

  const topPagesData = overview.top_pages.map(page => ({
    page: page.page,
    views: page.views,
    percentage: ((page.views / overview.page_views) * 100).toFixed(1)
  }));

  const trafficSourcesData = overview.traffic_sources.map(source => ({
    name: source.source,
    value: source.visitors,
    color: source.source === 'Direct' ? '#3B82F6' :
           source.source === 'Google' ? '#10B981' :
           source.source === 'Social Media' ? '#F59E0B' : '#EF4444'
  }));

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your website performance and user behavior</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{overview.total_visitors.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{overview.page_views.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+8% from last month</p>
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
                <p className="text-sm font-medium text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(overview.avg_session_duration)}</p>
                <p className="text-xs text-red-600 mt-1">-3% from last month</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900">{overview.bounce_rate}%</p>
                <p className="text-xs text-green-600 mt-1">-5% from last month</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visitor Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Visitor Trends</CardTitle>
                <CardDescription>
                  Daily visitors and page views over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={visitorTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stackId="1" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.6}
                      name="Visitors"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pageViews" 
                      stackId="2" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      name="Page Views"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>
                  Visitor distribution by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={trafficSourcesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {trafficSourcesData.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: source.color }}
                        ></div>
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{source.value}</p>
                        <p className="text-xs text-gray-500">
                          {((source.value / overview.total_visitors) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  Visitor locations by country
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: 'Morocco', visitors: 450, flag: '🇲🇦' },
                    { country: 'France', visitors: 280, flag: '🇫🇷' },
                    { country: 'United States', visitors: 220, flag: '🇺🇸' },
                    { country: 'Spain', visitors: 180, flag: '🇪🇸' },
                    { country: 'United Kingdom', visitors: 120, flag: '🇬🇧' }
                  ].map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{country.visitors}</p>
                        <p className="text-xs text-gray-500">
                          {((country.visitors / overview.total_visitors) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Referral Sites */}
            <Card>
              <CardHeader>
                <CardTitle>Top Referral Sites</CardTitle>
                <CardDescription>
                  External sites driving traffic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { site: 'google.com', visitors: 380, percentage: 30.4 },
                    { site: 'facebook.com', visitors: 150, percentage: 12.0 },
                    { site: 'instagram.com', visitors: 100, percentage: 8.0 },
                    { site: 'tripadvisor.com', visitors: 80, percentage: 6.4 },
                    { site: 'booking.com', visitors: 60, percentage: 4.8 }
                  ].map((site, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{site.site}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{site.visitors}</p>
                        <p className="text-xs text-gray-500">{site.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Most visited pages on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPagesData.length > 0 ? topPagesData.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{page.page}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{page.views}</p>
                      <p className="text-xs text-gray-500">{page.percentage}%</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No page data available</h3>
                    <p className="text-gray-600">Page view data will appear here once tracking is active</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">23</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Page Views (1h)</p>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Visitors</p>
                    <p className="text-2xl font-bold text-purple-600">18</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Activity</CardTitle>
              <CardDescription>
                Live visitor activity on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { page: '/', time: '2 seconds ago', location: 'Marrakech, Morocco' },
                  { page: '/restaurants', time: '15 seconds ago', location: 'Paris, France' },
                  { page: '/hotels', time: '32 seconds ago', location: 'New York, USA' },
                  { page: '/activities', time: '1 minute ago', location: 'Madrid, Spain' },
                  { page: '/', time: '2 minutes ago', location: 'London, UK' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{activity.page}</span>
                      <span className="text-sm text-gray-500">{activity.location}</span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

