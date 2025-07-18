import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Eye, 
  Trash2, 
  Filter,
  Search,
  Download,
  MoreHorizontal,
  CheckCircle,
  Clock,
  MessageSquare
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
import { contactsAPI } from '../lib/api';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    unread: { color: 'bg-blue-100 text-blue-800', label: 'Unread' },
    read: { color: 'bg-green-100 text-green-800', label: 'Read' },
    replied: { color: 'bg-purple-100 text-purple-800', label: 'Replied' },
  };

  const config = statusConfig[status] || statusConfig.unread;

  return (
    <Badge className={`${config.color} border-0`}>
      {config.label}
    </Badge>
  );
};

const ContactDetailModal = ({ contact, isOpen, onClose, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await contactsAPI.updateContactStatus(contact.id, newStatus);
      onStatusUpdate(contact.id, newStatus);
      toast.success('Contact status updated successfully');
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Failed to update contact status');
    } finally {
      setUpdating(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogDescription>
            View and manage contact form submission
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold">{contact.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">{contact.email}</p>
            </div>
            {contact.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-lg">{contact.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Subject</label>
              <p className="text-lg">{contact.subject}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-500">Message</label>
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Submitted: {new Date(contact.created_at).toLocaleString()}</span>
            </div>
            <StatusBadge status={contact.status} />
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              onClick={() => handleStatusUpdate('read')}
              disabled={updating || contact.status === 'read'}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
            <Button
              onClick={() => handleStatusUpdate('replied')}
              disabled={updating || contact.status === 'replied'}
              variant="outline"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Mark as Replied
            </Button>
            <Button
              onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)}
              variant="default"
            >
              <Mail className="h-4 w-4 mr-2" />
              Reply via Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactsAPI.getContacts(filters);
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await contactsAPI.getContactStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching contact stats:', error);
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = (contactId, newStatus) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, status: newStatus }
        : contact
    ));
    fetchStats(); // Refresh stats
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactsAPI.deleteContact(contactId);
      setContacts(contacts.filter(contact => contact.id !== contactId));
      toast.success('Contact deleted successfully');
      fetchStats();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status: status === filters.status ? '' : status, page: 1 });
  };

  if (loading && contacts.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage contact form submissions and customer inquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Contacts
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
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
                  Unread
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.unread || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Read
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.read || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Replied
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.replied || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>
                View and manage all contact form submissions
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
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
                placeholder="Search contacts..."
                value={filters.search}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filters.status === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('unread')}
              >
                Unread
              </Button>
              <Button
                variant={filters.status === 'read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('read')}
              >
                Read
              </Button>
              <Button
                variant={filters.status === 'replied' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('replied')}
              >
                Replied
              </Button>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No contacts found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{contact.subject}</TableCell>
                      <TableCell>
                        <StatusBadge status={contact.status} />
                      </TableCell>
                      <TableCell>
                        {new Date(contact.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteContact(contact.id)}
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

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default Contacts;

