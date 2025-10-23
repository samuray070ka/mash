import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '../API';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const API_URL = 'https://tokenized.pythonanywhere.com/api/products/';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_uz: '',
    name_ru: '',
    description: '',
    category_uz: '',
    category_ru: '',
    price: '',
    image: null,
    specifications_uz: '{}',
    specifications_ru: '{}',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load products from server',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name_uz?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name_ru?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category_uz?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category_ru?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLabel = (key) => {
    const base = key.replace(/_(uz|ru)$/, '');
    const langMatch = key.match(/_(uz|ru)$/);
    const lang = langMatch ? ` (${langMatch[1].toUpperCase()})` : '';
    return base.replace(/_/g, ' ').toUpperCase() + lang;
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name_uz: product.name_uz || '',
        name_ru: product.name_ru || '',
        description: product.description || '',
        category_uz: product.category_uz || '',
        category_ru: product.category_ru || '',
        price: product.price || '',
        image: null,
        specifications_uz: JSON.stringify(product.specifications_uz || {}, null, 2),
        specifications_ru: JSON.stringify(product.specifications_ru || {}, null, 2),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name_uz: '',
        name_ru: '',
        description: '',
        category_uz: '',
        category_ru: '',
        price: '',
        image: null,
        specifications_uz: '{}',
        specifications_ru: '{}',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      JSON.parse(formData.specifications_uz);
      JSON.parse(formData.specifications_ru);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid JSON in specifications',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      if (editingProduct) {
        await api.put(`${API_URL}${editingProduct.id}/`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        await api.post(API_URL, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: 'Success', description: 'Product created successfully' });
      }

      handleCloseDialog();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`${API_URL}${productId}/`);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast({ title: 'Deleted', description: 'Product removed successfully' });
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          variant: 'destructive',
        });
      }
    }
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
               <div className="relative flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mt-12 md:mt-0 mb-2">
      Products Management
    </h1>
    <p className="text-gray-400">Manage your factory products</p>
  </div>
  <Button
    onClick={() => handleOpenDialog()}
    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20 absolute top-[-10px] right-[-10px] md:static"
  >
    <Plus className="mr-2" size={20} />
    Add Product
  </Button>
</div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-800 text-gray-100 placeholder:text-gray-500"
          />
        </div>

        {/* Product List */}
        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm group"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || product.image_url || ''}
                      alt={product.name_uz}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button size="sm" onClick={() => handleView(product)} className="bg-gray-900/90 text-white">
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" onClick={() => handleOpenDialog(product)} className="bg-blue-600 text-white">
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" onClick={() => handleDelete(product.id)} className="bg-red-600 text-white">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">{product.name_uz}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
                        {product.category_uz}
                      </span>
                      <span className="text-green-400 font-bold text-sm">${product.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl">
            {viewingProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{viewingProduct.name_uz}</DialogTitle>
                </DialogHeader>
                <img
                  src={viewingProduct.image || viewingProduct.image_url || ''}
                  alt={viewingProduct.name_uz}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Description</p>
                    <p className="text-gray-100 whitespace-pre-line">{viewingProduct.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                      {viewingProduct.category_uz}
                    </span>
                    <span className="text-green-400 font-bold text-lg">${viewingProduct.price}</span>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                {['name_uz', 'name_ru'].map((key) => (
                  <div className="space-y-2" key={key}>
                    <Label>{getLabel(key)}</Label>
                    <Input
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 gap-4">
                {['category_uz', 'category_ru'].map((key) => (
                  <div className="space-y-2" key={key}>
                    <Label>{getLabel(key)}</Label>
                    <Input
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Price & Image */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>PRICE</Label>
                  <Input
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>IMAGE</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required={!editingProduct}
                  />
                  {(formData.image || editingProduct?.image || editingProduct?.image_url) && (
                    <img
                      src={
                        formData.image
                          ? URL.createObjectURL(formData.image)
                          : editingProduct?.image || editingProduct?.image_url
                      }
                      alt="Preview"
                      className="w-48 h-32 object-cover rounded-lg mt-2 border border-gray-700"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>DESCRIPTION</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ProductsManagement;