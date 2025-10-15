import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Star } from "lucide-react";

interface Contact {
  name: string;
  businessName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  tags: string[];
  lastContacted: Date;
  mainChannel: 'whatsapp' | 'email' | 'phone';
  isVip: boolean;
  notes: string;
  totalMessages: number;
  status: 'active' | 'inactive' | 'lead' | 'customer';
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: Contact) => void;
  availableTags: string[];
}

const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  availableTags
}) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    mainChannel: 'whatsapp' as 'whatsapp' | 'email' | 'phone',
    isVip: false,
    notes: '',
    status: 'lead' as 'active' | 'inactive' | 'lead' | 'customer',
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newContact: Contact = {
      name: formData.name.trim(),
      businessName: formData.businessName.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      tags: formData.tags,
      lastContacted: new Date(),
      mainChannel: formData.mainChannel,
      isVip: formData.isVip,
      notes: formData.notes.trim(),
      totalMessages: 0,
      status: formData.status
    };

    onAdd(newContact);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      name: '',
      businessName: '',
      email: '',
      phone: '',
      mainChannel: 'whatsapp',
      isVip: false,
      notes: '',
      status: 'lead',
      tags: []
    });
    setNewTag('');
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addNewTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add New Contact
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter contact name"
                  className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter business name"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                  className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Communication Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mainChannel">Primary Communication Channel</Label>
                <Select
                  value={formData.mainChannel}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, mainChannel: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Contact Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="vip"
                checked={formData.isVip}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVip: checked }))}
              />
              <Label htmlFor="vip" className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#F1C40F]" />
                Mark as VIP Contact
              </Label>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Tags</h3>
            
            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div>
              <Label>Available Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags
                  .filter(tag => !formData.tags.includes(tag))
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-[#3A9BDC] hover:text-white transition-colors"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Add Custom Tag */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Create new tag"
                onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addNewTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Notes</h3>
            <div>
              <Label htmlFor="notes">Contact Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this contact..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#3A9BDC] hover:bg-[#2E8BC7]"
            disabled={!formData.name.trim()}
          >
            Add Contact
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;
