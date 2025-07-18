import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Users, 
  TrendingUp, 
  UserX,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  Send,
  Plus,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { newsletterAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', label: 'Active' },
    unsubscribed: { color: 'bg-red-100 text-red-800', label: 'Unsubscribed' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <Badge className={`${config.color} border-0`}>
      {config.label}
    </Badge>
  );
};

const SubscriberDetailModal = ({ subscriber, isOpen, onClose, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await newsletterAPI.updateSubscriberStatus(subscriber.id, newStatus);
      onStatusUpdate(subscriber.id, newStatus);
      toast.success('Subscriber status updated successfully');
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      toast.error('Failed to update subscriber status');
    } finally {
      setUpdating(false);
    }
  };

  if (!subscriber) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Subscriber Details</DialogTitle>
          <DialogDescription>
            View and manage newsletter subscriber
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subscriber Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-lg font-semibold">{subscriber.email}</p>
            </div>
            
            {subscriber.name && (
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{subscriber.name}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <StatusBadge status={subscriber.status} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Subscribed Date</label>
              <p className="text-lg">{new Date(subscriber.subscribed_at).toLocaleString()}</p>
            </div>

            {subscriber.unsubscribed_at && (
              <div>
                <label className="text-sm font-medium text-gray-500">Unsubscribed Date</label>
                <p className="text-lg">{new Date(subscriber.unsubscribed_at).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            {subscriber.status === 'unsubscribed' ? (
              <Button
                onClick={() => handleStatusUpdate('active')}
                disabled={updating}
                variant="default"
              >
                <Users className="h-4 w-4 mr-2" />
                Reactivate
              </Button>
            ) : (
              <Button
                onClick={() => handleStatusUpdate('unsubscribed')}
                disabled={updating}
                variant="outline"
              >
                <UserX className="h-4 w-4 mr-2" />
                Unsubscribe
              </Button>
            )}
            <Button
              onClick={() => window.open(`mailto:${subscriber.email}`)}
              variant="outline"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  // Mock growth data for chart
  const growthData = [
    { name: 'Jan', subscribers: 45 },
    { name: 'Feb', subscribers: 52 },
    { name: 'Mar', subscribers: 48 },
    { name: 'Apr', subscribers: 61 },
    { name: 'May', subscribers: 55 },
    { name: 'Jun', subscribers: 67 },
    { name: 'Jul', subscribers: 73 },
  ];

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [filters]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await newsletterAPI.getSubscribers(filters);
      setSubscribers(response.data.subscribers || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await newsletterAPI.getNewsletterStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching newsletter stats:', error);
    }
  };

  const handleViewSubscriber = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = (subscriberId, newStatus) => {
    setSubscribers(subscribers.map(subscriber => 
      subscriber.id === subscriberId 
        ? { ...subscriber, status: newStatus }
        : subscriber
    ));
    fetchStats(); // Refresh stats
  };

  const handleDeleteSubscriber = async (subscriberId) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      await newsletterAPI.deleteSubscriber(subscriberId);
      setSubscribers(subscribers.filter(subscriber => subscriber.id !== subscriberId));
      toast.success('Subscriber deleted successfully');
      fetchStats();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    }
  };

  const handleExportSubscribers = async () => {
    try {
      const response = await newsletterAPI.exportSubscribers();
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Subscribers exported successfully');
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      toast.error('Failed to export subscribers');
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status: status === filters.status ? '' : status, page: 1 });
  };

  if (loading && subscribers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Newsletter Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage newsletter subscribers and email campaigns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Subscribers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.total_subscribers || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Subscribers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.active_subscribers || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Growth Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.growth_rate || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Unsubscribed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.unsubscribed || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Growth</CardTitle>
          <CardDescription>Monthly subscriber growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ fill: '#f97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Newsletter Subscribers</CardTitle>
              <CardDescription>
                View and manage all newsletter subscribers
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportSubscribers}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Campaign
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subscribers..."
                value={filters.search}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filters.status === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={filters.status === 'unsubscribed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('unsubscribed')}
              >
                Unsubscribed
              </Button>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No subscribers found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>{subscriber.name || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={subscriber.status} />
                      </TableCell>
                      <TableCell>
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewSubscriber(subscriber)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => window.open(`mailto:${subscriber.email}`)}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Subscriber Detail Modal */}
      <SubscriberDetailModal
        subscriber={selectedSubscriber}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default Newsletter;

