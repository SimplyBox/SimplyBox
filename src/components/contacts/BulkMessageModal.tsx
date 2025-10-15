import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Users, 
  Send, 
  Crown,
  Filter,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Contact {
  id: string;
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

interface BulkMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  userPlan: 'free' | 'starter' | 'professional';
}

const BulkMessageModal: React.FC<BulkMessageModalProps> = ({
  isOpen,
  onClose,
  contacts,
  userPlan
}) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [messageChannel, setMessageChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [messageContent, setMessageContent] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'tag' | 'status'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const messageLimits = {
    free: 10,
    starter: 50,
    professional: 200
  };

  const currentLimit = messageLimits[userPlan];

  // Get available tags and statuses
  const availableTags = Array.from(new Set(contacts.flatMap(c => c.tags)));
  const availableStatuses = Array.from(new Set(contacts.map(c => c.status)));

  // Filter contacts based on selected criteria
  const filteredContacts = contacts.filter(contact => {
    if (filterBy === 'tag' && selectedTag) {
      return contact.tags.includes(selectedTag);
    }
    if (filterBy === 'status' && selectedStatus) {
      return contact.status === selectedStatus;
    }
    return true;
  });

  // Get contacts that support the selected channel
  const channelCompatibleContacts = filteredContacts.filter(contact => {
    if (messageChannel === 'whatsapp') {
      return contact.phone && (contact.mainChannel === 'whatsapp' || contact.phone);
    }
    if (messageChannel === 'email') {
      return contact.email;
    }
    return false;
  });

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === channelCompatibleContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(channelCompatibleContacts.map(c => c.id));
    }
  };

  const handleSendMessages = async () => {
    if (!messageContent.trim() || selectedContacts.length === 0) return;

    if (selectedContacts.length > currentLimit) {
      alert(`Your ${userPlan} plan allows sending to ${currentLimit} contacts at once. Please select fewer contacts or upgrade your plan.`);
      return;
    }

    setIsSending(true);

    // Simulate sending messages
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const successCount = Math.floor(selectedContacts.length * 0.9);
      const failedCount = selectedContacts.length - successCount;
      
      setSendResults({
        success: successCount,
        failed: failedCount,
        errors: failedCount > 0 ? [`${failedCount} messages failed to send due to invalid contact information`] : []
      });
    } catch (error) {
      setSendResults({
        success: 0,
        failed: selectedContacts.length,
        errors: ['Failed to send messages. Please try again.']
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setSelectedContacts([]);
    setMessageContent('');
    setFilterBy('all');
    setSelectedTag('');
    setSelectedStatus('');
    setSendResults(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const getChannelIcon = (channel: 'whatsapp' | 'email') => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />;
    }
  };

  const isFreePlanLimited = userPlan === 'free' && selectedContacts.length > currentLimit;

  if (sendResults) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Message Sent Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-[#2ECC71] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Messages Delivered
              </h3>
              <p className="text-gray-600">
                Successfully sent {sendResults.success} messages via {messageChannel}
              </p>
            </div>

            {sendResults.failed > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">{sendResults.failed} messages failed to send:</p>
                    {sendResults.errors.map((error, index) => (
                      <p key={index} className="text-sm">• {error}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center gap-3 pt-4">
              <Button variant="outline" onClick={handleReset}>
                Send Another Message
              </Button>
              <Button onClick={handleClose} className="bg-[#3A9BDC] hover:bg-[#2E8BC7]">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Send Bulk Message
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Limit Info */}
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              Your {userPlan} plan allows sending messages to <strong>{currentLimit} contacts</strong> at once.
              {userPlan !== 'professional' && (
                <span className="text-[#3A9BDC]"> Upgrade to send to more contacts.</span>
              )}
            </AlertDescription>
          </Alert>

          {/* Message Channel Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-[#3A9BDC]" />
                Message Channel
              </CardTitle>
              <CardDescription>
                Choose how you want to send your message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    messageChannel === 'whatsapp' 
                      ? 'border-[#2ECC71] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMessageChannel('whatsapp')}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-[#2ECC71]" />
                    <div>
                      <h3 className="font-medium text-gray-900">WhatsApp</h3>
                      <p className="text-sm text-gray-600">
                        {contacts.filter(c => c.phone).length} contacts available
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    messageChannel === 'email' 
                      ? 'border-[#3A9BDC] bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMessageChannel('email')}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-[#3A9BDC]" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-sm text-gray-600">
                        {contacts.filter(c => c.email).length} contacts available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#3A9BDC]" />
                  Select Recipients
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contacts</SelectItem>
                      <SelectItem value="tag">By Tag</SelectItem>
                      <SelectItem value="status">By Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
              <CardDescription>
                Choose contacts to send your message to ({selectedContacts.length} selected)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filter Options */}
              {filterBy === 'tag' && (
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {filterBy === 'status' && (
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map(status => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Select All Button */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  disabled={channelCompatibleContacts.length === 0}
                >
                  {selectedContacts.length === channelCompatibleContacts.length ? 'Deselect All' : 'Select All'}
                </Button>
                <span className="text-sm text-gray-600">
                  {channelCompatibleContacts.length} contacts available for {messageChannel}
                </span>
              </div>

              {/* Contact List */}
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {channelCompatibleContacts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No contacts available for {messageChannel}</p>
                    <p className="text-sm mt-1">
                      {messageChannel === 'whatsapp' 
                        ? 'Add phone numbers to your contacts' 
                        : 'Add email addresses to your contacts'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {channelCompatibleContacts.map((contact) => (
                      <div key={contact.id} className="p-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={() => handleContactToggle(contact.id)}
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className="text-xs">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              {contact.isVip && <Star className="h-3 w-3 text-[#F1C40F] fill-current" />}
                            </div>
                            <p className="text-sm text-gray-600">
                              {messageChannel === 'whatsapp' ? contact.phone : contact.email}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {contact.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isFreePlanLimited && (
                <Alert>
                  <Crown className="h-4 w-4" />
                  <AlertDescription>
                    You've selected {selectedContacts.length} contacts, but your free plan allows only {currentLimit}.
                    <Button variant="link" className="p-0 h-auto text-[#3A9BDC]">
                      Upgrade to send to more contacts
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getChannelIcon(messageChannel)}
                Compose Message
              </CardTitle>
              <CardDescription>
                Write your message for {messageChannel} delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea
                    id="message"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder={`Write your ${messageChannel} message here...`}
                    rows={6}
                    className="mt-1"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {messageContent.length} characters
                    </span>
                    <span className="text-sm text-gray-500">
                      Will be sent to {selectedContacts.length} contacts
                    </span>
                  </div>
                </div>

                {messageChannel === 'whatsapp' && (
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertDescription>
                      WhatsApp messages will be sent through your connected WhatsApp Business account.
                      Make sure your account is properly configured.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSendMessages}
            disabled={!messageContent.trim() || selectedContacts.length === 0 || isFreePlanLimited || isSending}
            className="bg-[#2ECC71] hover:bg-[#27AE60]"
          >
            {isSending ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to {selectedContacts.length} Contacts
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkMessageModal;
