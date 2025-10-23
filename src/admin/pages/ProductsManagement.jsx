import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { mockProducts } from '../mockData';
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
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
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name_uz: '',
    name_ru: '',
    description_uz: '',
    description_ru: '',
    category_uz: '',
    category_ru: '',
    price: '',
    image_url: '',
    specifications_uz: '',
    specifications_ru: '',
  });

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_uz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name_uz: product.name_uz,
        name_ru: product.name_ru,
        description_uz: product.description_uz,
        description_ru: product.description_ru,
        category_uz: product.category_uz,
        category_ru: product.category_ru,
        price: product.price,
        image_url: product.image_url,
        specifications_uz: JSON.stringify(product.specifications_uz, null, 2),
        specifications_ru: JSON.stringify(product.specifications_ru, null, 2),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name_uz: '',
        name_ru: '',
        description_uz: '',
        description_ru: '',
        category_uz: '',
        category_ru: '',
        price: '',
        image_url: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const newProduct = {
        id: editingProduct?.id || `prod-${Date.now()}`,
        ...formData,
        price: parseFloat(formData.price),
        specifications_uz: JSON.parse(formData.specifications_uz),
        specifications_ru: JSON.parse(formData.specifications_ru),
        created_at: editingProduct?.created_at || new Date().toISOString(),
      };

      if (editingProduct) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        setProducts([newProduct, ...products]);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON in specifications",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Products Management
            </h1>
            <p className="text-gray-400">Manage your factory products</p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20"
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image_url}
                    alt={product.name_uz}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleView(product)}
                      className="bg-gray-900/90 hover:bg-gray-800 text-white"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenDialog(product)}
                      className="bg-blue-600/90 hover:bg-blue-700 text-white"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600/90 hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-100 line-clamp-1">
                      {product.name_uz}
                    </h3>
                    <span className="text-green-400 font-bold text-lg ml-2">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description_uz}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
                      {product.category_uz}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_uz">Name (Uzbek)</Label>
                  <Input
                    id="name_uz"
                    value={formData.name_uz}
                    onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ru">Name (Russian)</Label>
                  <Input
                    id="name_ru"
                    value={formData.name_ru}
                    onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_uz">Description (Uzbek)</Label>
                <Textarea
                  id="description_uz"
                  value={formData.description_uz}
                  onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_ru">Description (Russian)</Label>
                <Textarea
                  id="description_ru"
                  value={formData.description_ru}
                  onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications_uz">Specifications (Uzbek) - JSON Format</Label>
                <Textarea
                  id="specifications_uz"
                  value={formData.specifications_uz}
                  onChange={(e) => setFormData({ ...formData, specifications_uz: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 font-mono text-sm min-h-24"
                  placeholder='{"Key": "Value"}'
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications_ru">Specifications (Russian) - JSON Format</Label>
                <Textarea
                  id="specifications_ru"
                  value={formData.specifications_ru}
                  onChange={(e) => setFormData({ ...formData, specifications_ru: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100 font-mono text-sm min-h-24"
                  placeholder='{"Key": "Value"}'
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
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-2xl">
            {viewingProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{viewingProduct.name_uz}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={viewingProduct.image_url}
                    alt={viewingProduct.name_uz}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Category</p>
                      <p className="text-gray-100">{viewingProduct.category_uz}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Price</p>
                      <p className="text-green-400 font-bold text-xl">
                        ${viewingProduct.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Description (UZ)</p>
                    <p className="text-gray-100">{viewingProduct.description_uz}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Description (RU)</p>
                    <p className="text-gray-100">{viewingProduct.description_ru}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Specifications (UZ)</p>
                    <div className="bg-gray-800 p-3 rounded-lg space-y-1">
                      {Object.entries(viewingProduct.specifications_uz).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">{key}:</span>
                          <span className="text-gray-100">{value}</span>
                        </div>
                      ))}
                    </div>
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

export default ProductsManagement;