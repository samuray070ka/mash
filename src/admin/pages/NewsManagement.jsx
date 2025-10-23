import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { mockNews } from '../mockData';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [viewingNews, setViewingNews] = useState(null);
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    content_uz: '',
    content_ru: '',
    category_uz: '',
    category_ru: '',
    image_url: '',
  });

  useEffect(() => {
    setNews(mockNews);
  }, []);

  const filteredNews = news.filter(
    (item) =>
      item.title_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category_uz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (newsItem = null) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title_uz: newsItem.title_uz,
        title_ru: newsItem.title_ru,
        content_uz: newsItem.content_uz,
        content_ru: newsItem.content_ru,
        category_uz: newsItem.category_uz,
        category_ru: newsItem.category_ru,
        image_url: newsItem.image_url,
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
        image_url: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNews(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNews = {
      id: editingNews?.id || `news-${Date.now()}`,
      ...formData,
      date: editingNews?.date || new Date().toISOString(),
    };

    if (editingNews) {
      setNews(news.map((n) => (n.id === editingNews.id ? newNews : n)));
      toast({
        title: "Success",
        description: "News updated successfully",
      });
    } else {
      setNews([newNews, ...news]);
      toast({
        title: "Success",
        description: "News created successfully",
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (newsId) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      setNews(news.filter((n) => n.id !== newsId));
      toast({
        title: "Success",
        description: "News deleted successfully",
      });
    }
  };

  const handleView = (newsItem) => {
    setViewingNews(newsItem);
    setIsViewDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              News Management
            </h1>
            <p className="text-gray-400">Manage your factory news and updates</p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20"
          >
            <Plus className="mr-2" size={20} />
            Add News
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-800 text-gray-100 placeholder:text-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNews.map((newsItem, index) => (
            <Card
              key={newsItem.id}
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.02] backdrop-blur-sm group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={newsItem.image_url}
                    alt={newsItem.title_uz}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleView(newsItem)}
                      className="bg-gray-900/90 hover:bg-gray-800 text-white"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenDialog(newsItem)}
                      className="bg-purple-600/90 hover:bg-purple-700 text-white"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(newsItem.id)}
                      className="bg-red-600/90 hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-purple-600/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                      {newsItem.category_uz}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {newsItem.title_uz}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{newsItem.content_uz}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-2" />
                    {new Date(newsItem.date).toLocaleDateString('en-US', {
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

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No news found</p>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {editingNews ? 'Edit News' : 'Add New News'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_uz">Title (Uzbek)</Label>
                  <Input
                    id="title_uz"
                    value={formData.title_uz}
                    onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ru">Title (Russian)</Label>
                  <Input
                    id="title_ru"
                    value={formData.title_ru}
                    onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_uz">Category (Uzbek)</Label>
                  <Input
                    id="category_uz"
                    value={formData.category_uz}
                    onChange={(e) => setFormData({ ...formData, category_uz: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category_ru">Category (Russian)</Label>
                  <Input
                    id="category_ru"
                    value={formData.category_ru}
                    onChange={(e) => setFormData({ ...formData, category_ru: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_uz">Content (Uzbek)</Label>
                <Textarea
                  id="content_uz"
                  value={formData.content_uz}
                  onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_ru">Content (Russian)</Label>
                <Textarea
                  id="content_ru"
                  value={formData.content_ru}
                  onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-32"
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
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

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
            {viewingNews && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{viewingNews.title_uz}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={viewingNews.image_url}
                    alt={viewingNews.title_uz}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                      {viewingNews.category_uz}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(viewingNews.date).toLocaleDateString()}
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