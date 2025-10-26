import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Search, Eye, Trash2, Mail, Phone, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import aPi from '../API'

const API = 'https://tokenized.pythonanywhere.com/api/contact-forms/';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingContact, setViewingContact] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch contact data from API
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await aPi.get(API);
        setContacts(res.data);
      } catch (error) {
        console.error('Error loading contacts:', error);
        toast({
          title: 'Xato',
          description: 'Aloqa maʼlumotlarini yuklash muvaffaqiyatsiz tugadi',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

  // 🔹 Search filter
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 View single contact
  const handleView = (contact) => {
    setViewingContact(contact);
    setIsViewDialogOpen(true);
  };

  // 🔹 Delete contact (API + UI)
  const handleDelete = async (contactId) => {
    if (window.confirm('Ushbu murojaatni o‘chirishni xohlaysizmi?')) {
      try {
        await aPi.delete(`${API}${contactId}/`);
        setContacts(contacts.filter((c) => c.id !== contactId));
        toast({
          title: 'Muvaffaqiyatli',
          description: 'Murojaat muvaffaqiyatli o‘chirildi',
        });
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast({
          title: 'Xato',
          description: 'Murojaatni o‘chirishda xatolik yuz berdi',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Aloqa shakllari
          </h1>
          <p className="text-gray-400">Mijozlarning murojaatlarini va aloqa shakllarini boshqaring</p>
        </div>

        {/* Qidiruv paneli */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Aloqa maʼlumotlarini qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-800 text-gray-100 placeholder:text-gray-500"
          />
        </div>


        {/* Yuklanish holati */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Aloqa maʼlumotlari yuklanmoqda...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Hech qanday murojaat topilmadi</div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact, index) => (
              <Card
                key={contact.id}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Kontent qismi */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                          {contact.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-100 group-hover:text-green-400 transition-colors truncate">
                            {contact.name}
                          </h3>

                          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mt-1">
                            {contact.email && (
                              <span className="flex items-center gap-1 min-w-0 w-full sm:w-auto">
                                <Mail size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                <span className="responsive-truncate-email min-w-0 flex-1">
                                  {contact.email}
                                </span>
                              </span>
                            )}
                            {contact.phone && (
                              <span className="flex items-center gap-1 min-w-0">
                                <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="truncate">{contact.phone}</span>
                              </span>
                            )}
                            {contact.company && (
                              <span className="flex items-center gap-1 min-w-0">
                                <Building size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="truncate">{contact.company}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-300 line-clamp-2 text-sm">{contact.message}</p>
                      </div>

                      {contact.created_at && (
                        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                          <Calendar size={12} className="mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">
                            Yuborilgan sana:{' '}
                            {new Date(contact.created_at).toLocaleString('uz-UZ', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )}
                    </div>


                    {/* Tugmalar */}
                    <div className="flex gap-2 justify-end sm:justify-start pt-2 sm:pt-0 w-full sm:w-auto flex-shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleView(contact)}
                        className="bg-green-600/90 hover:bg-green-700 text-white min-w-[36px] h-8"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(contact.id)}
                        className="bg-red-600/90 hover:bg-red-700 min-w-[36px] h-8"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Ko‘rish oynasi */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl">
            {viewingContact && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Murojaat tafsilotlari</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl">
                      {viewingContact.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100">{viewingContact.name}</h3>
                      <p className="text-gray-400">Mijoz murojaati</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {viewingContact.email && (
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                          <Mail size={14} />
                          Elektron pochta
                        </p>
                        <p className="text-gray-100">{viewingContact.email}</p>
                      </div>
                    )}
                    {viewingContact.phone && (
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                          <Phone size={14} />
                          Telefon
                        </p>
                        <p className="text-gray-100">{viewingContact.phone}</p>
                      </div>
                    )}
                  </div>

                  {viewingContact.company && (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Building size={14} />
                        Kompaniya
                      </p>
                      <p className="text-gray-100">{viewingContact.company}</p>
                    </div>
                  )}

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Xabar</p>
                    <p className="text-gray-100">{viewingContact.message}</p>
                  </div>


                  {viewingContact.created_at && (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Calendar size={14} />
                        Yuborilgan sana
                      </p>
                      <p className="text-gray-100">
                        {new Date(viewingContact.created_at).toLocaleString('uz-UZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
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
