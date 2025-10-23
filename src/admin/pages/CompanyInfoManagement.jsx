import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { mockCompanyInfo } from '../mockData';
import { Save, Building2, MapPin, Mail, Phone, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const CompanyInfoManagement = () => {
  const [formData, setFormData] = useState(mockCompanyInfo);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Company information updated successfully",
      });
      setIsSaving(false);
    }, 1000);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

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
                  value={formData.about_uz}
                  onChange={(e) => handleChange('about_uz', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-24"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_ru">About (Russian)</Label>
                <Textarea
                  id="about_ru"
                  value={formData.about_ru}
                  onChange={(e) => handleChange('about_ru', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-24"
                  required
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
                  value={formData.history_uz}
                  onChange={(e) => handleChange('history_uz', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-24"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history_ru">History (Russian)</Label>
                <Textarea
                  id="history_ru"
                  value={formData.history_ru}
                  onChange={(e) => handleChange('history_ru', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 min-h-24"
                  required
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
                <div className="space-y-2">
                  <Label htmlFor="mission_uz">Mission (Uzbek)</Label>
                  <Textarea
                    id="mission_uz"
                    value={formData.mission_uz}
                    onChange={(e) => handleChange('mission_uz', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission_ru">Mission (Russian)</Label>
                  <Textarea
                    id="mission_ru"
                    value={formData.mission_ru}
                    onChange={(e) => handleChange('mission_ru', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100">Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vision_uz">Vision (Uzbek)</Label>
                  <Textarea
                    id="vision_uz"
                    value={formData.vision_uz}
                    onChange={(e) => handleChange('vision_uz', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision_ru">Vision (Russian)</Label>
                  <Textarea
                    id="vision_ru"
                    value={formData.vision_ru}
                    onChange={(e) => handleChange('vision_ru', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
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
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone size={14} />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={14} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={formData.telegram}
                  onChange={(e) => handleChange('telegram', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_uz">Address (Uzbek)</Label>
                <Input
                  id="address_uz"
                  value={formData.address_uz}
                  onChange={(e) => handleChange('address_uz', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_ru">Address (Russian)</Label>
                <Input
                  id="address_ru"
                  value={formData.address_ru}
                  onChange={(e) => handleChange('address_ru', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employees_count">Number of Employees</Label>
                  <Input
                    id="employees_count"
                    type="number"
                    value={formData.employees_count}
                    onChange={(e) => handleChange('employees_count', parseInt(e.target.value))}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established_year">Established Year</Label>
                  <Input
                    id="established_year"
                    type="number"
                    value={formData.established_year}
                    onChange={(e) => handleChange('established_year', parseInt(e.target.value))}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CompanyInfoManagement;