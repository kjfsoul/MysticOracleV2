import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, Lock, User, Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: "Spiritual seeker on a journey to understand the cosmos and my place within it.",
    birthDate: "1990-05-15",
    birthTime: "14:30", // Added birth time
    birthLocation: "Los Angeles, CA", // Renamed from location to birthLocation for consistency
    profileImage: user?.profileImage || null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API to update the profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would call an API to update the password
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">Your Profile</h1>
        <p className="text-muted-foreground mt-2 text-center">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-6">
            <TabsList className="bg-background border border-gold/30">
              <TabsTrigger 
                value="profile" 
                className={activeTab === "profile" ? "text-gold data-[state=active]:bg-gold/10" : ""}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className={activeTab === "security" ? "text-gold data-[state=active]:bg-gold/10" : ""}
              >
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="subscription" 
                className={activeTab === "subscription" ? "text-gold data-[state=active]:bg-gold/10" : ""}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Subscription
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className={activeTab === "settings" ? "text-gold data-[state=active]:bg-gold/10" : ""}
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="mt-0">
            <Card className="border-gold/30">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and how it appears on your profile
                    </CardDescription>
                  </div>
                  <div className="mt-4 md:mt-0">
                    {!isEditing ? (
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        variant="outline"
                        className="border-gold text-gold"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(false)} 
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit}>
                  <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4 border-2 border-gold">
                        <AvatarImage src={profileData.profileImage || undefined} />
                        <AvatarFallback className="bg-gold/20 text-gold text-xl">
                          {profileData.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="border-gold/50 text-gold"
                        >
                          Change Picture
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            readOnly={!isEditing}
                            className={!isEditing ? "opacity-70" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            readOnly={!isEditing}
                            className={!isEditing ? "opacity-70" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthDate">Birth Date</Label>
                          <Input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={profileData.birthDate}
                            onChange={handleProfileChange}
                            readOnly={!isEditing}
                            className={!isEditing ? "opacity-70" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthLocation">Birth Location</Label>
                          <Input
                            id="birthLocation"
                            name="birthLocation"
                            value={profileData.birthLocation}
                            onChange={handleProfileChange}
                            readOnly={!isEditing}
                            className={!isEditing ? "opacity-70" : ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthTime">Birth Time</Label>
                          <Input
                            id="birthTime"
                            name="birthTime"
                            placeholder="e.g., 14:30 or 2:30 PM"
                            value={profileData.birthTime}
                            onChange={handleProfileChange}
                            readOnly={!isEditing}
                            className={!isEditing ? "opacity-70" : ""}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          readOnly={!isEditing}
                          className={!isEditing ? "opacity-70 min-h-[100px]" : "min-h-[100px]"}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end mt-6">
                      <Button 
                        type="submit"
                        className="bg-gold hover:bg-gold/80 text-background"
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <Card className="border-gold/30">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      type="submit"
                      className="bg-gold hover:bg-gold/80 text-background"
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="mt-0">
            <Card className="border-gold/30">
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gold/5 rounded-lg p-6 mb-6 border border-gold/20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium text-lg text-gold mb-1">Free Plan</h3>
                      <p className="text-muted-foreground">Basic access to tarot readings and horoscopes</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button
                        className="bg-gold hover:bg-gold/80 text-background"
                        asChild
                      >
                        <a href="/upgrade">Upgrade to Premium</a>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Premium Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✦</span>
                      <span>Unlimited tarot readings and detailed interpretations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✦</span>
                      <span>Advanced astrological charts and compatibility readings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✦</span>
                      <span>AI-powered insights and personalized forecasts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✦</span>
                      <span>Save unlimited readings to your history</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✦</span>
                      <span>Remove ads and unlock exclusive content</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Card className="border-gold/30">
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Customize your app experience and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotif">Email Notifications</Label>
                        <input 
                          type="checkbox" 
                          id="emailNotif" 
                          className="h-4 w-4 accent-gold" 
                          defaultChecked 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dailyHoroscope">Daily Horoscope</Label>
                        <input 
                          type="checkbox" 
                          id="dailyHoroscope" 
                          className="h-4 w-4 accent-gold" 
                          defaultChecked 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="specialEvents">Special Astrological Events</Label>
                        <input 
                          type="checkbox" 
                          id="specialEvents" 
                          className="h-4 w-4 accent-gold" 
                          defaultChecked 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gold/10">
                    <h3 className="font-medium text-lg mb-3">Privacy</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="shareReadings">Share my readings publicly</Label>
                        <input 
                          type="checkbox" 
                          id="shareReadings" 
                          className="h-4 w-4 accent-gold" 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="analytics">Allow anonymous usage analytics</Label>
                        <input 
                          type="checkbox" 
                          id="analytics" 
                          className="h-4 w-4 accent-gold" 
                          defaultChecked 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gold/10">
                    <h3 className="font-medium text-lg mb-3">Account Actions</h3>
                    <div className="space-y-4 pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full border-gold/50 text-gold justify-start"
                      >
                        Export Your Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-destructive/50 text-destructive justify-start"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-gold/10 pt-6">
                <Button 
                  type="submit"
                  className="bg-gold hover:bg-gold/80 text-background"
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}