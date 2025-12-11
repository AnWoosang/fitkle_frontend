"use client";

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile, useUpdateProfile } from '../hooks';
import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileSettingsSidebar } from './ProfileSettingsSidebar';

export function SocialMediaScreen() {
  const router = useRouter();

  // 프로필 데이터 가져오기
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  // Social media state
  const [facebookHandle, setFacebookHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [linkedinHandle, setLinkedinHandle] = useState('');
  const [emailHandle, setEmailHandle] = useState('');

  // 프로필 데이터가 로드되면 state 초기화
  useEffect(() => {
    if (profile) {
      setFacebookHandle(profile.facebook_handle || '');
      setInstagramHandle(profile.instagram_handle || '');
      setTwitterHandle(profile.twitter_handle || '');
      setLinkedinHandle(profile.linkedin_handle || '');
      setEmailHandle(profile.email_handle || '');
    }
  }, [profile]);

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        facebook_handle: facebookHandle,
        instagram_handle: instagramHandle,
        twitter_handle: twitterHandle,
        linkedin_handle: linkedinHandle,
        email_handle: emailHandle,
      },
      {
        onSuccess: () => {
          toast.success('소셜 미디어 정보가 성공적으로 업데이트되었습니다.');
          router.push('/profile');
        },
        onError: (error) => {
          console.error('소셜 미디어 업데이트 실패:', error);
          toast.error('소셜 미디어 업데이트에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 프로필이 없을 때
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">프로필을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <ProfileSettingsSidebar />

          {/* Content Area */}
          <div className="flex-1">
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-6">
                {/* Header */}
                <div>
                  <h1 className="mb-2">Social Media</h1>
                  <p className="text-muted-foreground">Connect your social accounts to display on your profile</p>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Facebook */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center">
                      <Facebook className="w-4 h-4 fill-white text-white" />
                    </div>
                    <Label htmlFor="facebook" className="text-base">Facebook</Label>
                  </div>
                  <Input
                    id="facebook"
                    type="text"
                    value={facebookHandle}
                    onChange={(e) => setFacebookHandle(e.target.value)}
                    placeholder="your_facebook_name"
                    className="h-12 border-2 border-border bg-input-background rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">https://facebook.com/your_facebook_name</p>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Instagram */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FD5949] via-[#D6249F] to-[#285AEB] flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                    <Label htmlFor="instagram" className="text-base">Instagram</Label>
                  </div>
                  <Input
                    id="instagram"
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@your_instagram_name"
                    className="h-12 border-2 border-border bg-input-background rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">https://instagram.com/your_instagram_name or @username</p>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Twitter */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-white fill-white" />
                    </div>
                    <Label htmlFor="twitter" className="text-base">Twitter</Label>
                  </div>
                  <Input
                    id="twitter"
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="@Your_Twitter_Name"
                    className="h-12 border-2 border-border bg-input-background rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">https://twitter.com/Your_Twitter_Name or @username</p>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* LinkedIn */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <Label htmlFor="linkedin" className="text-base">LinkedIn</Label>
                  </div>
                  <Input
                    id="linkedin"
                    type="text"
                    value={linkedinHandle}
                    onChange={(e) => setLinkedinHandle(e.target.value)}
                    placeholder="yourlinkedinname"
                    className="h-12 border-2 border-border bg-input-background rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">https://linkedin.com/in/yourlinkedinname</p>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Email Handle */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <Label htmlFor="email-handle" className="text-base">Email</Label>
                  </div>
                  <Input
                    id="email-handle"
                    type="email"
                    value={emailHandle}
                    onChange={(e) => setEmailHandle(e.target.value)}
                    placeholder="contact@example.com"
                    className="h-12 border-2 border-border bg-input-background rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">Public contact email (different from login email)</p>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="px-8 py-3 h-12 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
