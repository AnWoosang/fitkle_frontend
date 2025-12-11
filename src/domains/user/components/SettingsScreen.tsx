"use client";

import { ArrowLeft, User, Settings, Lock, Share2, Heart, Edit2, Info, Calendar, Plus, X, Search, UserX, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface SettingsScreenProps {
  onBack: () => void;
}

type SettingSection = 
  | 'editProfile'
  | 'accountManagement'
  | 'socialMedia'
  | 'interests';

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>('editProfile');
  const [name, setName] = useState('Tony');
  const location = 'Seoul, Korea (South)';
  const [birthdate, setBirthdate] = useState('10/02/1997');
  const [gender, setGender] = useState('male');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Outdoors', 'New In Town', 'Make New Friends', 'Fun Times', 'Social Networking']);
  const [notificationRadius, setNotificationRadius] = useState('50 mi');
  const [interestSearchQuery, setInterestSearchQuery] = useState('');
  const [language, setLanguage] = useState('english');
  const [contactPermission, setContactPermission] = useState('anyone');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const menuItems = [
    { id: 'editProfile' as SettingSection, label: 'Edit Profile', icon: User },
    { id: 'accountManagement' as SettingSection, label: 'Account Management', icon: Settings },
    { id: 'socialMedia' as SettingSection, label: 'Social Media', icon: Share2 },
    { id: 'interests' as SettingSection, label: 'Interests', icon: Heart },
  ];

  const goals = [
    { id: 'hobbies', label: 'Practice Hobbies', emoji: '🎨' },
    { id: 'socialize', label: 'Socialize', emoji: '💬' },
    { id: 'friends', label: 'Make Friends', emoji: '🙌' },
    { id: 'network', label: 'Professionally Network', emoji: '💼' },
  ];

  const allInterests = [
    'Social', 'Professional Networking', 'Book Club', 'Adventure', 'Writing and Publishing',
    'Painting', 'Pickup Soccer', 'Social Justice', 'Camping', 'Group Singing', 'Family Friendly',
    'Outdoor Fitness', 'Eco-Conscious', 'Stress Relief', 'Game Night', 'Psychic', 'Vinyasa Yoga',
    'Birds', 'Walking Tours', 'Guided Meditation', 'New Parents', 'Support',
    'Breathing Meditation', 'Roleplaying Games (RPGs)', 'Yoga', 'International Travel', 'Soccer',
    'Acoustic Music', 'Social Innovation'
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(prev => prev.filter(i => i !== interest));
  };

  const filteredInterests = allInterests.filter(
    interest => 
      !selectedInterests.includes(interest) &&
      interest.toLowerCase().includes(interestSearchQuery.toLowerCase())
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'editProfile':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="mb-2">Edit profile</h1>
              <p className="text-muted-foreground">This information will appear on your public profile</p>
            </div>

            {/* Avatar */}
            <div className="relative w-fit">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="bg-accent-rose text-foreground text-4xl">
                  T
                </AvatarFallback>
              </Avatar>
              <button 
                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-border hover:bg-secondary transition-colors"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Name Field */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="name">
                Name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-border bg-input-background"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Your location</Label>
              <div className="text-muted-foreground">{location}</div>
              <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <Edit2 className="w-4 h-4" />
                <span>Edit address</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-8">
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Completing this information helps with your group recommendations.
                  Gender and Birthdate <span className="font-semibold">will not</span> appear on your public profile.
                </p>
              </div>

              {/* Birthdate */}
              <div className="space-y-2 max-w-md">
                <div className="flex items-center gap-2">
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <Input
                    id="birthdate"
                    type="text"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="border border-border bg-input-background pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
                <button 
                  onClick={() => setBirthdate('')}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Gender */}
              <div className="space-y-2 max-w-md mt-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="border border-border bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* What are you looking for? */}
              <div className="space-y-4 mt-8">
                <h3>What are you looking for?</h3>
                <div className="flex flex-wrap gap-3">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all ${
                        selectedGoals.includes(goal.id)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-input-background text-foreground hover:border-primary/50'
                      }`}
                    >
                      <span>{goal.emoji}</span>
                      <span>{goal.label}</span>
                      <Plus className={`w-4 h-4 transition-transform ${selectedGoals.includes(goal.id) ? 'rotate-45' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'accountManagement':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="mb-2">Account Management</h1>
              <p className="text-muted-foreground">Manage your account settings</p>
            </div>

            {/* Language */}
            <div className="space-y-4">
              <h2>Language</h2>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="max-w-2xl border border-border bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="korean">한국어</SelectItem>
                  <SelectItem value="japanese">日本語</SelectItem>
                  <SelectItem value="chinese">中文</SelectItem>
                  <SelectItem value="spanish">Español</SelectItem>
                  <SelectItem value="french">Français</SelectItem>
                  <SelectItem value="german">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contacts */}
            <div className="space-y-4">
              <h2>Contacts</h2>
              <div className="space-y-3">
                <Label>Who can contact you on Meetup?</Label>
                <Select value={contactPermission} onValueChange={setContactPermission}>
                  <SelectTrigger className="max-w-2xl border border-border bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anyone">Anyone on Meetup</SelectItem>
                    <SelectItem value="members">Members of my groups only</SelectItem>
                    <SelectItem value="organizers">Organizers only</SelectItem>
                    <SelectItem value="none">No one</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Change your password */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h2>Change your password</h2>
              <p className="text-muted-foreground">
                When you change your password, you will be automatically signed out from your other sessions
              </p>
              <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <Lock className="w-5 h-5" />
                <span>Change password</span>
              </button>
            </div>

            {/* Deactivate your account */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h2>Deactivate your account</h2>
              <p className="text-muted-foreground">
                If you decide to use Meetup again, you'll need to create a new account
              </p>
              <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <UserX className="w-5 h-5" />
                <span>Deactivate account</span>
              </button>
            </div>
          </div>
        );

      case 'socialMedia':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="mb-2">Social media</h1>
              <p className="text-muted-foreground">Add your social media below to display links to them on all your Meetup group profiles.</p>
            </div>

            {/* Facebook */}
            <div className="space-y-3">
              <Label htmlFor="facebook">Facebook</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1877F2]">
                  <Facebook className="w-5 h-5 fill-current" />
                </div>
                <Input
                  id="facebook"
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder=""
                  className="pl-12 border border-border bg-input-background"
                />
              </div>
              <p className="text-sm text-muted-foreground">https://facebook.com/your_facebook_name</p>
            </div>

            {/* Instagram */}
            <div className="space-y-3">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Instagram className="w-5 h-5 text-[#E4405F]" />
                </div>
                <Input
                  id="instagram"
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder=""
                  className="pl-12 border border-border bg-input-background"
                />
              </div>
              <p className="text-sm text-muted-foreground">https://instagram.com/your_instagram_name or @your_instagram_name</p>
            </div>

            {/* Twitter */}
            <div className="space-y-3">
              <Label htmlFor="twitter">Twitter</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                </div>
                <Input
                  id="twitter"
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder=""
                  className="pl-12 border border-border bg-input-background"
                />
              </div>
              <p className="text-sm text-muted-foreground">https://twitter.com/Your_Twitter_Name or @Your_Twitter_Name</p>
            </div>

            {/* LinkedIn */}
            <div className="space-y-3">
              <Label htmlFor="linkedin">Linkedin</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                </div>
                <Input
                  id="linkedin"
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder=""
                  className="pl-12 border border-border bg-input-background"
                />
              </div>
              <p className="text-sm text-muted-foreground">https://linkedin.com/in/yourlinkedinname</p>
            </div>

            {/* Save Changes Button */}
            <div className="pt-4">
              <Button 
                variant="outline"
                className="px-8 py-3 rounded-full border-2 border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                onClick={() => {
                  // Mock save - 실제로는 API 호출
                  console.log('Saving social media:', { facebook, instagram, twitter, linkedin });
                }}
              >
                Save changes
              </Button>
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="mb-2">Interests</h1>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <p className="text-muted-foreground flex-1">
                  We'll notify you about Meetup groups that match your interests within:
                </p>
                <Select value={notificationRadius} onValueChange={setNotificationRadius}>
                  <SelectTrigger className="w-32 border border-border bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10 mi">10 mi</SelectItem>
                    <SelectItem value="25 mi">25 mi</SelectItem>
                    <SelectItem value="50 mi">50 mi</SelectItem>
                    <SelectItem value="100 mi">100 mi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Interests */}
            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => removeInterest(interest)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    <span>{interest}</span>
                    <X className="w-4 h-4" />
                  </button>
                ))}
              </div>
            )}

            {/* Browse and Search Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select>
                <SelectTrigger className="border border-border bg-input-background">
                  <SelectValue placeholder="Browse by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="arts">Arts & Culture</SelectItem>
                  <SelectItem value="career">Career & Business</SelectItem>
                  <SelectItem value="community">Community & Environment</SelectItem>
                  <SelectItem value="dancing">Dancing</SelectItem>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="health">Health & Wellbeing</SelectItem>
                  <SelectItem value="hobbies">Hobbies & Passions</SelectItem>
                  <SelectItem value="identity">Identity & Language</SelectItem>
                  <SelectItem value="movements">Movements & Politics</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="parents">Parents & Family</SelectItem>
                  <SelectItem value="pets">Pets & Animals</SelectItem>
                  <SelectItem value="religion">Religion & Spirituality</SelectItem>
                  <SelectItem value="sci-tech">Science & Tech</SelectItem>
                  <SelectItem value="social">Social Activities</SelectItem>
                  <SelectItem value="sports">Sports & Fitness</SelectItem>
                  <SelectItem value="support">Support & Coaching</SelectItem>
                  <SelectItem value="travel">Travel & Outdoor</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for an interest"
                  value={interestSearchQuery}
                  onChange={(e) => setInterestSearchQuery(e.target.value)}
                  className="border border-border bg-input-background pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Available Interests */}
            <div className="flex flex-wrap gap-2">
              {filteredInterests.slice(0, 30).map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-input-background text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <span>{interest}</span>
                  <Plus className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop & Mobile Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-0">
          {/* Sidebar */}
          <div className="w-72 border-r border-border bg-white min-h-screen">
            {/* Desktop Back Button */}
            <div className="block border-b border-border px-6 py-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>뒤로 가기</span>
              </button>
            </div>

            {/* Menu Items */}
            <nav className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/5 border-l-4 border-primary'
                        : 'text-foreground hover:bg-secondary border-l-4 border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-left">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
