import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Users, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Crown,
  Mail,
  MessageSquare
} from "lucide-react";

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

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: Contact[]) => void;
  userPlan: 'free' | 'starter' | 'professional';
}

const ImportContactsModal: React.FC<ImportContactsModalProps> = ({
  isOpen,
  onClose,
  onImport,
  userPlan
}) => {
  const [activeTab, setActiveTab] = useState('csv');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
    contacts: Contact[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importLimits = {
    free: 50,
    starter: 200,
    professional: 1000
  };

  const currentLimit = importLimits[userPlan];

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate CSV parsing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock imported contacts
      const mockContacts: Contact[] = [
        {
          name: 'John Doe',
          businessName: 'Doe Enterprises',
          email: 'john@doe.com',
          phone: '+1234567890',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          tags: ['Lead'],
          lastContacted: new Date(),
          mainChannel: 'email',
          isVip: false,
          notes: 'Imported from CSV',
          totalMessages: 0,
          status: 'lead'
        },
        {
          name: 'Jane Smith',
          businessName: 'Smith Corp',
          email: 'jane@smith.com',
          phone: '+0987654321',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
          tags: ['Customer'],
          lastContacted: new Date(),
          mainChannel: 'whatsapp',
          isVip: false,
          notes: 'Imported from CSV',
          totalMessages: 0,
          status: 'customer'
        }
      ];

      setUploadProgress(100);
      setImportResults({
        success: mockContacts.length,
        errors: [],
        contacts: mockContacts
      });
    } catch (error) {
      setImportResults({
        success: 0,
        errors: ['Failed to parse CSV file. Please check the format.'],
        contacts: []
      });
    } finally {
      setIsUploading(false);
      clearInterval(interval);
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      handleFileUpload(file);
    } else {
      alert('Please select a valid CSV file.');
    }
  };

  const handleGoogleContactsImport = () => {
    // Mock Google Contacts import
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 300);

    setTimeout(() => {
      const mockContacts: Contact[] = [
        {
          name: 'Google Contact 1',
          email: 'contact1@gmail.com',
          phone: '+1111111111',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google1',
          tags: ['Lead'],
          lastContacted: new Date(),
          mainChannel: 'email',
          isVip: false,
          notes: 'Imported from Google Contacts',
          totalMessages: 0,
          status: 'lead'
        }
      ];

      setImportResults({
        success: mockContacts.length,
        errors: [],
        contacts: mockContacts
      });
      setIsUploading(false);
    }, 2000);
  };

  const handleWhatsAppImport = () => {
    if (userPlan === 'free') {
      alert('WhatsApp import is available for Starter and Professional plans only.');
      return;
    }

    // Mock WhatsApp import
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 400);

    setTimeout(() => {
      const mockContacts: Contact[] = [
        {
          name: 'WhatsApp Contact',
          phone: '+6281234567890',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=whatsapp1',
          tags: ['Customer'],
          lastContacted: new Date(),
          mainChannel: 'whatsapp',
          isVip: false,
          notes: 'Imported from WhatsApp',
          totalMessages: 5,
          status: 'customer'
        }
      ];

      setImportResults({
        success: mockContacts.length,
        errors: [],
        contacts: mockContacts
      });
      setIsUploading(false);
    }, 3000);
  };

  const handleConfirmImport = () => {
    if (importResults?.contacts) {
      onImport(importResults.contacts);
      handleReset();
    }
  };

  const handleReset = () => {
    setImportResults(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = "Name,Business Name,Email,Phone,Tags,Notes\nJohn Doe,Doe Enterprises,john@doe.com,+1234567890,Lead,Sample contact\nJane Smith,Smith Corp,jane@smith.com,+0987654321,Customer,Another sample";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Import Contacts
          </DialogTitle>
        </DialogHeader>

        {!importResults ? (
          <div className="space-y-6 py-4">
            {/* Plan Limit Info */}
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                Your {userPlan} plan allows importing up to <strong>{currentLimit} contacts</strong> at once.
                {userPlan === 'free' && (
                  <span className="text-[#3A9BDC]"> Upgrade to import more contacts.</span>
                )}
              </AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="csv">CSV File</TabsTrigger>
                <TabsTrigger value="google">Google Contacts</TabsTrigger>
                <TabsTrigger value="whatsapp" className="relative">
                  WhatsApp
                  {userPlan === 'free' && (
                    <Crown className="h-3 w-3 text-[#F1C40F] ml-1" />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="csv" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#3A9BDC]" />
                      Upload CSV File
                    </CardTitle>
                    <CardDescription>
                      Import contacts from a CSV file. Make sure your file follows our template format.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={downloadTemplate}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Template
                      </Button>
                      <span className="text-sm text-gray-600">
                        Use this template to format your contacts correctly
                      </span>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">
                          Drop your CSV file here, or click to browse
                        </p>
                        <p className="text-sm text-gray-600">
                          Supports CSV files up to 10MB
                        </p>
                      </div>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 bg-[#3A9BDC] hover:bg-[#2E8BC7]"
                        disabled={isUploading}
                      >
                        Choose File
                      </Button>
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Processing file...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="google" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-[#3A9BDC]" />
                      Google Contacts Integration
                    </CardTitle>
                    <CardDescription>
                      Import contacts directly from your Google account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Mail className="h-16 w-16 text-[#3A9BDC] mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Connect Your Google Account
                      </h3>
                      <p className="text-gray-600 mb-6">
                        We'll securely access your Google Contacts to import them into SimplyBox.
                        Your data remains private and secure.
                      </p>
                      <Button
                        onClick={handleGoogleContactsImport}
                        disabled={isUploading}
                        className="bg-[#3A9BDC] hover:bg-[#2E8BC7]"
                      >
                        {isUploading ? 'Importing...' : 'Connect Google Contacts'}
                      </Button>
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Importing from Google...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="whatsapp" className="space-y-4">
                {userPlan === 'free' ? (
                  <Card className="border-[#F1C40F] bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardContent className="p-6 text-center">
                      <Crown className="h-12 w-12 text-[#F1C40F] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
                      <p className="text-gray-600 mb-4">
                        WhatsApp contact import is available for Starter and Professional plans.
                        Upgrade to access this feature and import your WhatsApp contacts seamlessly.
                      </p>
                      <Button className="bg-[#F1C40F] hover:bg-[#E6B800] text-gray-900">
                        Upgrade Plan
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-[#2ECC71]" />
                        WhatsApp Contacts
                      </CardTitle>
                      <CardDescription>
                        Import your WhatsApp contacts and conversation history.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This feature requires WhatsApp Business API integration. 
                          Contact our support team to set up the connection.
                        </AlertDescription>
                      </Alert>

                      <div className="text-center py-8">
                        <MessageSquare className="h-16 w-16 text-[#2ECC71] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Import WhatsApp Contacts
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Import contacts from your WhatsApp Business account along with 
                          recent conversation history.
                        </p>
                        <Button
                          onClick={handleWhatsAppImport}
                          disabled={isUploading}
                          className="bg-[#2ECC71] hover:bg-[#27AE60]"
                        >
                          {isUploading ? 'Importing...' : 'Import WhatsApp Contacts'}
                        </Button>
                      </div>

                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Importing from WhatsApp...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="w-full" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* Import Results */
          <div className="space-y-6 py-4">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-[#2ECC71] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Import Completed!
              </h3>
              <p className="text-gray-600">
                Successfully imported {importResults.success} contacts
              </p>
            </div>

            {importResults.errors.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Some contacts couldn't be imported:</p>
                    {importResults.errors.map((error, index) => (
                      <p key={index} className="text-sm">• {error}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Preview Imported Contacts</CardTitle>
                <CardDescription>
                  Review the contacts that will be added to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {importResults.contacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-[#3A9BDC] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">
                          {contact.businessName && `${contact.businessName} • `}
                          {contact.email || contact.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                Import More
              </Button>
              <Button
                onClick={handleConfirmImport}
                className="bg-[#2ECC71] hover:bg-[#27AE60]"
              >
                Add {importResults.success} Contacts
              </Button>
            </div>
          </div>
        )}

        {!importResults && (
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsModal;
