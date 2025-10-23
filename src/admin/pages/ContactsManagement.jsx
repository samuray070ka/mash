import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { mockContacts } from '../mockData';
import { Search, Eye, Trash2, Mail, Phone, Building, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingContact, setViewingContact] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    setContacts(mockContacts);
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (contact) => {
    setViewingContact(contact);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      setContacts(contacts.filter((c) => c.id !== contactId));
      toast({
        title: "Success",
        description: "Contact submission deleted successfully",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Contact Forms
          </h1>
          <p className="text-gray-400">Manage customer inquiries and contact submissions</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-800 text-gray-100 placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-4">
          {filteredContacts.map((contact, index) => (
            <Card
              key={contact.id}
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-green-400 transition-colors">
                          {contact.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {contact.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {contact.phone}
                          </span>
                          {contact.company && (
                            <span className="flex items-center gap-1">
                              <Building size={14} />
                              {contact.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-300 line-clamp-2">{contact.message}</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={14} className="mr-2" />
                      Submitted on {new Date(contact.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleView(contact)}
                      className="bg-green-600/90 hover:bg-green-700 text-white"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(contact.id)}
                      className="bg-red-600/90 hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No contact submissions found</p>
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl">
            {viewingContact && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Contact Submission Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl">
                      {viewingContact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100">{viewingContact.name}</h3>
                      <p className="text-gray-400">Customer Inquiry</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Mail size={14} />
                        Email
                      </p>
                      <p className="text-gray-100">{viewingContact.email}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Phone size={14} />
                        Phone
                      </p>
                      <p className="text-gray-100">{viewingContact.phone}</p>
                    </div>
                  </div>

                  {viewingContact.company && (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Building size={14} />
                        Company
                      </p>
                      <p className="text-gray-100">{viewingContact.company}</p>
                    </div>
                  )}

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Message</p>
                    <p className="text-gray-100">{viewingContact.message}</p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                      <Calendar size={14} />
                      Submission Date
                    </p>
                    <p className="text-gray-100">
                      {new Date(viewingContact.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ContactsManagement;