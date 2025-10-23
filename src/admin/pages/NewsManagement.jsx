import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import aPi from '../API';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const API_URL = "https://tokenized.pythonanywhere.com/api/news/";

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [viewingNews, setViewingNews] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    content_uz: '',
    content_ru: '',
    category_uz: '',
    category_ru: '',
    image: null, // 🟢 Fayl sifatida saqlanadi
  });

  // 🟢 Fetch all news
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await aPi.get(API_URL);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "Failed to fetch news from the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter(
    (item) =>
      item.title_uz?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title_ru?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category_uz?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🟢 Open Create/Edit dialog
  const handleOpenDialog = (newsItem = null) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title_uz: newsItem.title_uz || '',
        title_ru: newsItem.title_ru || '',
        content_uz: newsItem.content_uz || '',
        content_ru: newsItem.content_ru || '',
        category_uz: newsItem.category_uz || '',
        category_ru: newsItem.category_ru || '',
        image: null, // 🟢 tahrirda eski rasm ko‘rsatiladi, yangi yuklanganda o‘rniga qo‘yiladi
      });
    } else {
      setEditingNews(null);
      setFormData({
        title_uz: '',
        title_ru: '',
        content_uz: '',
        content_ru: '',
        category_uz: '',
        category_ru: '',
        image: null,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNews(null);
  };

  // 🟢 Create or Update news
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      if (editingNews) {
        await aPi.put(`${API_URL}${editingNews.id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: "Success", description: "News updated successfully" });
      } else {
        await aPi.post(API_URL, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: "Success", description: "News created successfully" });
      }

      fetchNews();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving news:", error);
      toast({ title: "Error", description: "Failed to save news." });
    }
  };

  // 🟢 Delete news
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        await aPi.delete(`${API_URL}${id}/`);
        setNews(news.filter((n) => n.id !== id));
        toast({ title: "Success", description: "News deleted successfully" });
      } catch (error) {
        console.error("Error deleting news:", error);
        toast({ title: "Error", description: "Failed to delete news." });
      }
    }
  };

  const handleView = (item) => {
    setViewingNews(item);
    setIsViewDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-8 md:mt-0 mb-2">
            Yangiliklar boshqaruvi
            </h1>
            <p className="text-gray-400">Zavod yangiliklari va yangilanishlarini boshqaring</p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20 absolute top-5 right-5 md:static"
          >
            <Plus className="mr-2" size={20} />
            Yangilik qo'shish
          </Button>
        </div>

        {/* 🔍 Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Yangilikni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-800 text-gray-100 placeholder:text-gray-500"
          />
        </div>

        {/* 📰 News List */}
        {loading ? (
          <p className="text-gray-500 text-center py-10">Yangiliklar Yuklanmoqda...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNews.map((item, index) => (
              <Card
                key={item.id}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.02] backdrop-blur-sm group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.image || item.image_url}
                      alt={item.title_uz}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button size="sm" variant="secondary" onClick={() => handleView(item)} className="bg-gray-900/90 hover:bg-gray-800 text-white">
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleOpenDialog(item)} className="bg-purple-600/90 hover:bg-purple-700 text-white">
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="bg-red-600/90 hover:bg-red-700">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-purple-600/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                        {item.category_uz}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">

                    <h3 className="text-xl font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {item.title_uz}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.content_uz}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={14} className="mr-2" />
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 🟢 Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {editingNews ? 'Edit News' : 'Add New News'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["title_uz", "title_ru"].map((key) => (
                  <div className="space-y-2" key={key}>
                    <Label>{key.replace("_", " ").toUpperCase()}</Label>
                    <Input
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["category_uz", "category_ru"].map((key) => (
                  <div className="space-y-2" key={key}>
                    <Label>{key.replace("_", " ").toUpperCase()}</Label>
                    <Input
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* 🟢 Image Upload */}
              <div className="space-y-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                  required={!editingNews}
                />
                {/* 🟢 Preview selected image */}
                {(formData.image || editingNews?.image) && (
                  <img
                    src={
                      formData.image
                        ? URL.createObjectURL(formData.image)
                        : editingNews?.image || editingNews?.image_url
                    }
                    alt="Preview"
                    className="w-48 h-32 object-cover rounded-lg mt-2 border border-gray-700"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Content (UZ)</Label>
                <Textarea
                  value={formData.content_uz}
                  onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-32"
                  required
                />
              </div>


              <div className="space-y-2">
                <Label>Content (RU)</Label>
                <Textarea
                  value={formData.content_ru}
                  onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-32"
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {editingNews ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 🟢 View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
            {viewingNews && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{viewingNews.title_uz}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={viewingNews.image || viewingNews.image_url}
                    alt={viewingNews.title_uz}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                      {viewingNews.category_uz}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(viewingNews.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Title (RU)</p>
                    <p className="text-gray-100 font-semibold">{viewingNews.title_ru}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Content (UZ)</p>
                    <p className="text-gray-100">{viewingNews.content_uz}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Content (RU)</p>
                    <p className="text-gray-100">{viewingNews.content_ru}</p>
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

export default NewsManagement;