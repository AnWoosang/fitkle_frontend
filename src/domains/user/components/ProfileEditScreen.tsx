"use client";

import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/useTranslations';
import { useAvatarUpload, useProfile, useUpdateProfile } from '../hooks';
import {
  Edit2,
  Upload,
  Loader2,
  MapPin,
  Info,
  Phone as PhoneIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProfileSettingsSidebar } from './ProfileSettingsSidebar';
import REGIONS from '@/assets/regions.json';

export function ProfileEditScreen() {
  const t = useTranslations('profile');
  const router = useRouter();

  // 프로필 데이터 가져오기
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  // State for all fields
  const [bio, setBio] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [districts, setDistricts] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  // 프로필 데이터가 로드되면 state 초기화
  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setNickname(profile.nickname || profile.name || '');

      // birthdate를 년/월/일로 분리
      if (profile.birthdate) {
        const [year, month, day] = profile.birthdate.split('-');
        setBirthYear(year || '');
        setBirthMonth(month || '');
        setBirthDay(day || '');
      }

      // location을 지역/구군으로 분리
      if (profile.location) {
        const parts = profile.location.split(' ');
        if (parts.length >= 2) {
          setRegion(parts[0] || '');
          setDistrict(parts[1] || '');
        }
      }

      setPhone(profile.phone || '');
      setGender(profile.gender || '');
    }
  }, [profile]);

  // 지역 선택 시 구/군 목록 업데이트
  useEffect(() => {
    if (region && REGIONS[region as keyof typeof REGIONS]) {
      setDistricts(REGIONS[region as keyof typeof REGIONS]);
      // 지역 변경 시 구/군이 목록에 없으면 초기화
      const regionDistricts = REGIONS[region as keyof typeof REGIONS];
      if (!regionDistricts.includes(district)) {
        setDistrict('');
      }
    } else {
      setDistricts([]);
      setDistrict('');
    }
  }, [region, district]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadAvatar, isUploading, uploadProgress } = useAvatarUpload();

  const handleSave = () => {
    // birthdate 조합
    const birthdate = birthYear && birthMonth && birthDay
      ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
      : undefined;

    // location 조합
    const location = region && district ? `${region} ${district}` : undefined;

    updateProfileMutation.mutate(
      {
        bio,
        nickname,
        birthdate,
        location,
        phone,
        gender,
      },
      {
        onSuccess: () => {
          toast.success('프로필이 성공적으로 업데이트되었습니다.');
          router.push('/profile');
        },
        onError: (error) => {
          console.error('프로필 업데이트 실패:', error);
          toast.error('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  // 전화번호 인증 페이지로 이동
  const handlePhoneVerification = () => {
    router.push('/profile/verify-phone');
  };

  // 아바타 클릭 → 파일 선택 열기
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 → 검증 및 업로드
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 클라이언트 측 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('이미지 파일만 업로드 가능합니다. (JPG, PNG, WebP, GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 업로드 시작
    try {
      uploadAvatar(file);
    } catch (error) {
      setPreviewUrl(null);
    }

    // input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = '';
  };

  // 현재 표시할 아바타 URL
  const displayAvatarUrl = previewUrl || profile?.avatar_url;
  const displayInitial = profile?.nickname?.[0]?.toUpperCase() || profile?.name?.[0]?.toUpperCase() || 'U';

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
                  <h1 className="mb-2">Edit Profile</h1>
                  <p className="text-muted-foreground">
                    This information will appear on your public profile
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Profile Photo */}
                <div>
                  <h3 className="mb-4">Profile Photo</h3>
                  <div className="relative w-fit">
                    <Avatar className="w-32 h-32 cursor-pointer" onClick={handleAvatarClick}>
                      {displayAvatarUrl ? (
                        <AvatarImage src={displayAvatarUrl} alt="Profile" />
                      ) : (
                        <AvatarFallback className="bg-accent-rose text-foreground text-4xl">
                          {displayInitial}
                        </AvatarFallback>
                      )}

                      {/* 업로드 중 오버레이 */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                          <span className="text-xs text-white font-medium">
                            {uploadProgress}%
                          </span>
                        </div>
                      )}
                    </Avatar>

                    {/* Edit Button */}
                    <button
                      onClick={handleAvatarClick}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* 숨겨진 파일 input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* 업로드 가이드 */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Upload className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-900">
                        <p className="font-medium mb-1">이미지 업로드 가이드</p>
                        <ul className="space-y-0.5 text-blue-700">
                          <li>• 지원 형식: JPG, PNG, WebP, GIF</li>
                          <li>• 최대 크기: 5MB</li>
                          <li>• 권장 비율: 1:1 (정사각형)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Basic Information */}
                <div className="space-y-6">
                  <h3>Basic Information</h3>

                  {/* Nickname Field */}
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-base">
                      Nickname<span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter your nickname"
                      className="h-12 border-2 border-border bg-input-background rounded-lg"
                      minLength={2}
                      maxLength={20}
                    />
                    <p className="text-xs text-muted-foreground">
                      2-20 characters, displayed on your public profile
                    </p>
                  </div>

                  {/* Birthdate */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-base">Birthdate</Label>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Year */}
                      <div className="relative">
                        <select
                          value={birthYear}
                          onChange={(e) => setBirthYear(e.target.value)}
                          className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 105 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Month */}
                      <div className="relative">
                        <select
                          value={birthMonth}
                          onChange={(e) => setBirthMonth(e.target.value)}
                          className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Day */}
                      <div className="relative">
                        <select
                          value={birthDay}
                          onChange={(e) => setBirthDay(e.target.value)}
                          className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
                        >
                          <option value="">Day</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This will not appear on your public profile
                    </p>
                  </div>

                  {/* Location - Region */}
                  <div className="space-y-2">
                    <Label className="text-base">Region</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="flex h-12 w-full rounded-xl border-2 border-input bg-background pl-11 pr-10 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
                      >
                        <option value="">Select region</option>
                        {Object.keys(REGIONS).map((regionName) => (
                          <option key={regionName} value={regionName}>
                            {regionName}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Location - District */}
                  <div className="space-y-2">
                    <Label className="text-base">District</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="flex h-12 w-full rounded-xl border-2 border-input bg-background pl-11 pr-10 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
                        disabled={!region}
                      >
                        <option value="">Select district</option>
                        {districts.map((districtName) => (
                          <option key={districtName} value={districtName}>
                            {districtName}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-base">Phone Number</Label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
                      <div className="flex items-center gap-3 flex-1">
                        <PhoneIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {phone ? phone : 'Not verified'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {phone ? 'Verified phone number' : 'Add your phone number for verification'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handlePhoneVerification}
                        variant={phone ? "outline" : "default"}
                        className="ml-4"
                      >
                        {phone ? 'Change' : 'Verify'}
                      </Button>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="gender" className="text-base">Gender</Label>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="h-12 border-2 border-border bg-input-background rounded-lg">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This will not appear on your public profile
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Bio Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2">About Me</h3>
                    <p className="text-sm text-muted-foreground">
                      Tell others about yourself
                    </p>
                  </div>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t('aboutMePlaceholder')}
                    className="min-h-[120px] resize-none border-2 border-border bg-input-background rounded-lg"
                    maxLength={2000}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-muted-foreground">
                      Share your interests, hobbies, or what you're looking for
                    </p>
                    <p className="text-muted-foreground">
                      {bio.length}/2000
                    </p>
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
  );
}
