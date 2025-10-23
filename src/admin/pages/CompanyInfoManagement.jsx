import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Save, Building2, MapPin, Mail, Phone, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import aPi from '../API'

const API = `https://tokenized.pythonanywhere.com/api/company-info/`;

const CompanyInfoManagement = () => {
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Ma’lumotni yuklash
  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      const response = await aPi.get(API);
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading company info:', error);
      toast({
        title: "Error",
        description: "Failed to load company information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Input o‘zgarganda
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 🔹 Saqlash (PUT so‘rovi)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await aPi.put(API, formData);
      toast({
        title: "Success",
        description: "Company information updated successfully",
      });
    } catch (error) {
      console.error('Error updating company info:', error);
      toast({
        title: "Error",
        description: "Failed to update company information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-gray-400">Loading company information...</div>
      </AdminLayout>
    );
  }

  if (!formData) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-red-400">Failed to load company information.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Company Information
            </h1>
            <p className="text-gray-400">Update your factory's company details</p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/20"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={20} />
                Save Changes
              </span>
            )}
          </Button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* About Section */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <Building2 size={20} className="text-orange-500" />
                About Company
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_uz">About (Uzbek)</Label>
                <Textarea
                  id="about_uz"
                  value={formData.about_uz || ""}
                  onChange={(e) => handleChange('about_uz', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_ru">About (Russian)</Label>
                <Textarea
                  id="about_ru"
                  value={formData.about_ru || ""}
                  onChange={(e) => handleChange('about_ru', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* History Section */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <CalendarIcon size={20} className="text-orange-500" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="history_uz">History (Uzbek)</Label>
                <Textarea
                  id="history_uz"
                  value={formData.history_uz || ""}
                  onChange={(e) => handleChange('history_uz', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history_ru">History (Russian)</Label>
                <Textarea
                  id="history_ru"
                  value={formData.history_ru || ""}
                  onChange={(e) => handleChange('history_ru', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100">Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Mission (Uzbek)</Label>
                <Textarea
                  value={formData.mission_uz || ""}
                  onChange={(e) => handleChange('mission_uz', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
                <Label>Mission (Russian)</Label>
                <Textarea
                  value={formData.mission_ru || ""}
                  onChange={(e) => handleChange('mission_ru', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100">Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Vision (Uzbek)</Label>
                <Textarea
                  value={formData.vision_uz || ""}
                  onChange={(e) => handleChange('vision_uz', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
                <Label>Vision (Russian)</Label>
                <Textarea
                  value={formData.vision_ru || ""}
                  onChange={(e) => handleChange('vision_ru', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <MapPin size={20} className="text-orange-500" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
              </div>

              <Label>Telegram</Label>
              <Input
                value={formData.telegram || ""}
                onChange={(e) => handleChange('telegram', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />

              <Label>Address (Uzbek)</Label>
              <Input
                value={formData.address_uz || ""}
                onChange={(e) => handleChange('address_uz', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />

              <Label>Address (Russian)</Label>
              <Input
                value={formData.address_ru || ""}
                onChange={(e) => handleChange('address_ru', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.latitude || ""}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.longitude || ""}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Stats */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <Users size={20} className="text-orange-500" />
                Company Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Number of Employees</Label>
                <Input
                  type="number"
                  value={formData.employees_count || ""}
                  onChange={(e) => handleChange('employees_count', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
              <div>
                <Label>Established Year</Label>
                <Input
                  type="number"
                  value={formData.established_year || ""}
                  onChange={(e) => handleChange('established_year', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CompanyInfoManagement;