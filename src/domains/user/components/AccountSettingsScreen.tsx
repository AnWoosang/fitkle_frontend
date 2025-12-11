"use client";

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/domains/auth/api/authApi';
import { useAuthStore } from '@/domains/auth/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { Settings, Mail, Lock, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileSettingsSidebar } from './ProfileSettingsSidebar';

export function AccountSettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout: logoutStore } = useAuthStore();

  // Account settings state
  const [language, setLanguage] = useState('english');
  const [contactPermission, setContactPermission] = useState('anyone');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = () => {
    // TODO: 계정 설정 저장 API 연동
    toast.success('계정 설정이 성공적으로 업데이트되었습니다.');
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: 실제 계정 삭제 API 호출
      // await deleteAccountApi();

      // 서버 로그아웃 (세션 종료)
      await authApi.logout();

      // Zustand 스토어 초기화
      logoutStore();

      // React Query 캐시 초기화
      queryClient.clear();

      // 인증 관련 로컬 스토리지만 삭제
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('rememberMe');

      // 모달 닫기
      setShowDeleteModal(false);

      // 성공 메시지
      toast.success('계정이 삭제되었습니다.');

      // 홈 화면으로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('계정 삭제 중 오류 발생:', error);
      toast.error('계정 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
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
                    <h1 className="mb-2">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences and security</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border"></div>

                  {/* Language Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3>Language</h3>
                        <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                      </div>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="h-12 border-2 border-border bg-input-background rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">🇬🇧 English</SelectItem>
                        <SelectItem value="korean">🇰🇷 한국어</SelectItem>
                        <SelectItem value="japanese">🇯🇵 日本語</SelectItem>
                        <SelectItem value="chinese">🇨🇳 中文</SelectItem>
                        <SelectItem value="spanish">🇪🇸 Español</SelectItem>
                        <SelectItem value="french">🇫🇷 Français</SelectItem>
                        <SelectItem value="german">🇩🇪 Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border"></div>

                  {/* Privacy Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3>Privacy</h3>
                        <p className="text-sm text-muted-foreground">Control who can reach out to you</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base">Who can contact you on Fitkle?</Label>
                      <Select value={contactPermission} onValueChange={setContactPermission}>
                        <SelectTrigger className="h-12 border-2 border-border bg-input-background rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anyone">✅ Anyone on Fitkle</SelectItem>
                          <SelectItem value="members">👥 Members of my groups only</SelectItem>
                          <SelectItem value="organizers">👨‍💼 Organizers only</SelectItem>
                          <SelectItem value="none">🚫 No one</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border"></div>

                  {/* Security Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3>Security</h3>
                        <p className="text-sm text-muted-foreground">Keep your account secure</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
                      <div className="flex-1">
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You'll be signed out from other sessions
                        </p>
                      </div>
                      <button className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Change</span>
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border"></div>

                  {/* Deactivate Account */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <UserX className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-red-900">Delete Account</h3>
                        <p className="text-sm text-red-600">Permanently remove your account</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex-1">
                        <p className="font-medium text-red-900">Delete your account</p>
                        <p className="text-sm text-red-700 mt-1">
                          All your data will be permanently deleted and cannot be recovered
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Delete Account</span>
                      </button>
                    </div>
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

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-900">계정 삭제</h2>
                <p className="text-sm text-red-600">정말로 계정을 삭제하시겠습니까?</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-900 font-medium mb-2">
                ⚠️ 이 작업은 되돌릴 수 없습니다
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>모든 프로필 정보가 삭제됩니다</li>
                <li>가입한 그룹에서 자동으로 탈퇴됩니다</li>
                <li>생성한 이벤트가 삭제됩니다</li>
                <li>모든 데이터는 영구적으로 삭제되며 복구할 수 없습니다</li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1 h-11 border-2 hover:bg-gray-50"
              >
                취소
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="flex-1 h-11 bg-red-600 text-white hover:bg-red-700"
              >
                계정 삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
