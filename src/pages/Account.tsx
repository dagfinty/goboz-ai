import { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Trash2, 
  Download, 
  Bell,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const Account = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: 'en',
    autoBackup: true
  });

  const handleSave = () => {
    // In real app, this would update user data via Supabase
    toast({
      title: "Profile updated successfully",
      description: "Your changes have been saved",
    });
    setIsEditing(false);
  };

  const handleDeactivate = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action can be reversed within 30 days.')) {
      toast({
        title: "Account deactivated",
        description: "You can reactivate within 30 days by signing in",
        variant: "destructive",
      });
      signOut();
      navigate('/');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        toast({
          title: "Account deleted",
          description: "Your account and all data have been permanently deleted",
          variant: "destructive",
        });
        signOut();
        navigate('/');
      }
    }
  };

  const handleExportData = () => {
    // In real app, this would export user data
    toast({
      title: "Data export started",
      description: "You'll receive an email with your data within 24 hours",
    });
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-ethiopic">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile, preferences, and account security
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 gobez-card">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gobez-green to-gobez-yellow flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-gobez-green mt-2">
                    Member since {new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span>Joined December 2024</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span>Account verified</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information */}
              <Card className="p-6 gobez-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2"
                  >
                    <User className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  {isEditing && (
                    <>
                      <Separator />
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.currentPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          New Password (optional)
                        </label>
                        <Input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              {/* Preferences */}
              <Card className="p-6 gobez-card">
                <h2 className="text-xl font-semibold text-foreground mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates about your progress</p>
                      </div>
                    </div>
                    <Switch 
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="en">English</option>
                      <option value="am">አማርኛ</option>
                      <option value="both">Both / ሁለቱም</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {preferences.darkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                      </div>
                    </div>
                    <Switch 
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, darkMode: checked }))}
                    />
                  </div>
                </div>
              </Card>

              {/* Data & Privacy */}
              <Card className="p-6 gobez-card">
                <h2 className="text-xl font-semibold text-foreground mb-6">Data & Privacy</h2>
                
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="w-full justify-start gap-3"
                  >
                    <Download className="w-4 h-4" />
                    Export My Data
                  </Button>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Account Actions</h3>
                    
                    <Button
                      variant="outline"
                      onClick={handleDeactivate}
                      className="w-full justify-start gap-3 text-orange-600 hover:text-orange-700"
                    >
                      <Shield className="w-4 h-4" />
                      Deactivate Account
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleDelete}
                      className="w-full justify-start gap-3 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account Permanently
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;