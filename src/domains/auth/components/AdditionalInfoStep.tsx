'use client';

import { useState, useEffect, useMemo } from 'react';
import { Globe, Check, MapPin, Bell, Mail, User, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { useInterests, usePreferences } from '@/shared/hooks';
import type { AdditionalInfoFormData } from '../types/signup';
import REGIONS from '@/assets/regions.json';
import UI_LANGUAGES from '@/assets/ui_languages.json';

interface AdditionalInfoStepProps {
  onSubmit: (data: AdditionalInfoFormData) => void;
}

// 국적 옵션
const NATIONALITIES = [
  { value: '대한민국', label: '🇰🇷 대한민국' },
  { value: '미국', label: '🇺🇸 미국' },
  { value: '일본', label: '🇯🇵 일본' },
  { value: '중국', label: '🇨🇳 중국' },
  { value: '영국', label: '🇬🇧 영국' },
  { value: '프랑스', label: '🇫🇷 프랑스' },
  { value: '독일', label: '🇩🇪 독일' },
  { value: '캐나다', label: '🇨🇦 캐나다' },
  { value: '호주', label: '🇦🇺 호주' },
  { value: '베트남', label: '🇻🇳 베트남' },
  { value: '태국', label: '🇹🇭 태국' },
  { value: '필리핀', label: '🇵🇭 필리핀' },
  { value: '인도', label: '🇮🇳 인도' },
  { value: '기타', label: '🌍 기타' },
];

// 사용 언어 옵션 (사용자가 구사할 수 있는 언어) - 임시 주석 처리
// const LANGUAGES = [
//   '한국어',
//   '영어',
//   '일본어',
//   '중국어',
//   '스페인어',
//   '프랑스어',
//   '독일어',
//   '베트남어',
//   '태국어',
//   '러시아어',
// ];


// 연락 허용 설정
const CONTACT_PERMISSIONS = [
  { value: 'ANYONE', label: '모든 사용자', description: '누구나 연락할 수 있습니다' },
  { value: 'EVENT_OR_GROUP_MEMBERS', label: '이벤트/그룹 멤버', description: '같은 이벤트나 그룹 멤버만' },
  { value: 'EVENT_MEMBERS_ONLY', label: '이벤트 멤버만', description: '같은 이벤트 참여자만' },
  { value: 'GROUP_MEMBERS_ONLY', label: '그룹 멤버만', description: '같은 그룹 멤버만' },
  { value: 'NONE', label: '받지 않음', description: '연락을 받지 않습니다' },
];

export function AdditionalInfoStep({ onSubmit }: AdditionalInfoStepProps) {
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY' | ''>('');
  const [bio, setBio] = useState('');
  // const [languages, setLanguages] = useState<string[]>([]); // 임시 주석 처리
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [districts, setDistricts] = useState<string[]>([]);

  // 검색 필터 상태
  const [interestSearchQuery, setInterestSearchQuery] = useState('');
  const [preferenceSearchQuery, setPreferenceSearchQuery] = useState('');

  // account_settings 관련 상태
  const [uiLanguage, setUiLanguage] = useState('ko');
  const [contactPermission, setContactPermission] = useState<'ANYONE' | 'EVENT_OR_GROUP_MEMBERS' | 'EVENT_MEMBERS_ONLY' | 'GROUP_MEMBERS_ONLY' | 'NONE'>('ANYONE');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [groupUpdates, setGroupUpdates] = useState(true);
  const [newsletterSubscription, setNewsletterSubscription] = useState(false);

  // interests 테이블에서 관심사 데이터 가져오기
  const { data: interestsData, isLoading: isLoadingInterests, error: interestsError } = useInterests();

  // preference 테이블에서 선호 카테고리 데이터 가져오기
  const { data: preferencesData, isLoading: isLoadingPreferences, error: preferencesError } = usePreferences();

  // 검색 필터링된 관심사 목록
  const filteredInterests = useMemo(() => {
    if (!Array.isArray(interestsData)) return [];
    if (!interestSearchQuery.trim()) return interestsData;

    const query = interestSearchQuery.toLowerCase().trim();
    return interestsData.filter((interest) =>
      interest.name_ko.toLowerCase().includes(query) ||
      interest.code?.toLowerCase().includes(query)
    );
  }, [interestsData, interestSearchQuery]);

  // 검색 필터링된 선호 카테고리 목록
  const filteredPreferences = useMemo(() => {
    if (!Array.isArray(preferencesData)) return [];
    if (!preferenceSearchQuery.trim()) return preferencesData;

    const query = preferenceSearchQuery.toLowerCase().trim();
    return preferencesData.filter((preference) =>
      preference.name.toLowerCase().includes(query) ||
      preference.code?.toLowerCase().includes(query)
    );
  }, [preferencesData, preferenceSearchQuery]);

  // 디버깅: 관심사 데이터 확인
  useEffect(() => {
    console.log('🔍 [AdditionalInfoStep] Interests data:', {
      isLoading: isLoadingInterests,
      error: interestsError,
      data: interestsData,
      isArray: Array.isArray(interestsData),
      length: Array.isArray(interestsData) ? interestsData.length : 0,
      filteredLength: filteredInterests.length,
    });
  }, [interestsData, isLoadingInterests, interestsError, filteredInterests]);

  // 디버깅: 선호 카테고리 데이터 확인
  useEffect(() => {
    console.log('🔍 [AdditionalInfoStep] Preferences data:', {
      isLoading: isLoadingPreferences,
      error: preferencesError,
      data: preferencesData,
      isArray: Array.isArray(preferencesData),
      length: Array.isArray(preferencesData) ? preferencesData.length : 0,
      filteredLength: filteredPreferences.length,
    });
  }, [preferencesData, isLoadingPreferences, preferencesError, filteredPreferences]);

  // 지역 선택 시 구/군 목록 업데이트
  useEffect(() => {
    if (region && REGIONS[region as keyof typeof REGIONS]) {
      setDistricts(REGIONS[region as keyof typeof REGIONS]);
      setDistrict(''); // 지역 변경 시 구/군 초기화
    } else {
      setDistricts([]);
      setDistrict('');
    }
  }, [region]);

  // 임시 주석 처리
  // const toggleLanguage = (language: string) => {
  //   setLanguages((prev) =>
  //     prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
  //   );
  // };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((i) => i !== interestId) : [...prev, interestId]
    );
  };

  const togglePreference = (preferenceId: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preferenceId) ? prev.filter((p) => p !== preferenceId) : [...prev, preferenceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nationality) {
      alert('국적을 선택해주세요.');
      return;
    }

    if (!gender) {
      alert('성별을 선택해주세요.');
      return;
    }

    if (bio && bio.length > 2000) {
      alert('자기소개는 최대 2000자까지 입력 가능합니다.');
      return;
    }

    if (!region) {
      alert('지역을 선택해주세요.');
      return;
    }

    if (!district) {
      alert('구/군을 선택해주세요.');
      return;
    }

    // 임시 주석 처리
    // if (languages.length === 0) {
    //   alert('사용 가능한 언어를 최소 1개 이상 선택해주세요.');
    //   return;
    // }

    if (selectedInterests.length === 0) {
      alert('관심사를 최소 1개 이상 선택해주세요.');
      return;
    }

    if (selectedPreferences.length === 0) {
      alert('선호 카테고리를 최소 1개 이상 선택해주세요.');
      return;
    }

    const formData: AdditionalInfoFormData = {
      nationality,
      gender: gender as 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY',
      bio: bio || undefined,
      languages: [], // 임시로 빈 배열 전달
      interests: selectedInterests,
      preferences: selectedPreferences,
      region,
      district,
      // account_settings 관련 데이터
      language: uiLanguage,
      contactPermission,
      emailNotifications,
      pushNotifications,
      eventReminders,
      groupUpdates,
      newsletterSubscription,
    };
    console.log('🚀 [AdditionalInfoStep] Submitting form data:', formData);
    console.log('🔍 [AdditionalInfoStep] Selected interests detail:', {
      selectedInterests,
      interestsData: Array.isArray(interestsData)
        ? interestsData.filter((i) => selectedInterests.includes(i.id))
        : [],
    });
    console.log('🔍 [AdditionalInfoStep] Selected preferences detail:', {
      selectedPreferences,
      preferencesData: Array.isArray(preferencesData)
        ? preferencesData.filter((p) => selectedPreferences.includes(p.id))
        : [],
    });

    onSubmit(formData);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">추가 정보 입력</h2>
        <p className="text-muted-foreground text-sm">프로필 설정을 위한 정보를 입력해주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 국적 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">국적</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="flex h-12 w-full rounded-xl border-2 border-input bg-background pl-11 pr-10 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
              required
            >
              <option value="">국적을 선택하세요</option>
              {NATIONALITIES.map((nat) => (
                <option key={nat.value} value={nat.value}>
                  {nat.label}
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

        {/* 성별 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">성별</Label>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setGender('MALE')}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center justify-between ${
                gender === 'MALE'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-white text-foreground hover:border-gray-300'
              }`}
            >
              <span>남성</span>
              {gender === 'MALE' && <Check className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setGender('FEMALE')}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center justify-between ${
                gender === 'FEMALE'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-white text-foreground hover:border-gray-300'
              }`}
            >
              <span>여성</span>
              {gender === 'FEMALE' && <Check className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setGender('PREFER_NOT_TO_SAY')}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center justify-between ${
                gender === 'PREFER_NOT_TO_SAY'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-white text-foreground hover:border-gray-300'
              }`}
            >
              <span>밝히고 싶지 않음</span>
              {gender === 'PREFER_NOT_TO_SAY' && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 자기소개 (선택) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            자기소개 <span className="text-muted-foreground">(선택사항)</span>
          </Label>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자신을 소개해주세요 (취미, 관심사, 목표 등)"
              className="flex min-h-[120px] w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              maxLength={2000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {bio.length} / 2000
            </div>
          </div>
        </div>

        {/* 지역 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">지역</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="flex h-12 w-full rounded-xl border-2 border-input bg-background pl-11 pr-10 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
              required
            >
              <option value="">시/도를 선택하세요</option>
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

        {/* 구/군 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">구/군</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="flex h-12 w-full rounded-xl border-2 border-input bg-background pl-11 pr-10 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
              required
              disabled={!region}
            >
              <option value="">구/군을 선택하세요</option>
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

        {/* 사용 언어 선택 - 임시 주석 처리 */}
        {/* <div className="space-y-3">
          <Label className="text-sm font-medium">
            사용 언어 <span className="text-muted-foreground">(복수 선택 가능)</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => toggleLanguage(language)}
                className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  languages.includes(language)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-white text-foreground hover:border-gray-300'
                }`}
              >
                {languages.includes(language) && <Check className="w-4 h-4 inline mr-1" />}
                {language}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">선택한 언어: {languages.length}개</p>
        </div> */}

        {/* 관심사 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            관심사 <span className="text-muted-foreground">(복수 선택 가능)</span>
          </Label>

          {/* 관심사 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="관심사 검색..."
              value={interestSearchQuery}
              onChange={(e) => setInterestSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-2"
            />
          </div>

          {isLoadingInterests ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                {filteredInterests.length > 0 ? (
                  filteredInterests.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-2 ${
                        selectedInterests.includes(interest.id)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-white text-foreground hover:border-gray-300'
                      }`}
                    >
                      <span>{interest.emoji}</span>
                      <span className="flex-1 text-left">{interest.name_ko}</span>
                      {selectedInterests.includes(interest.id) && <Check className="w-4 h-4" />}
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                    검색 결과가 없습니다
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                선택한 관심사: {selectedInterests.length}개
                {interestSearchQuery && ` (전체 ${Array.isArray(interestsData) ? interestsData.length : 0}개 중 ${filteredInterests.length}개 표시)`}
              </p>
            </>
          )}
        </div>

        {/* 선호 카테고리 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            선호 카테고리 <span className="text-muted-foreground">(복수 선택 가능)</span>
          </Label>

          {/* 선호 카테고리 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="선호 카테고리 검색..."
              value={preferenceSearchQuery}
              onChange={(e) => setPreferenceSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-2"
            />
          </div>

          {isLoadingPreferences ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                {filteredPreferences.length > 0 ? (
                  filteredPreferences.map((preference) => (
                    <button
                      key={preference.id}
                      type="button"
                      onClick={() => togglePreference(preference.id)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-2 ${
                        selectedPreferences.includes(preference.id)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-white text-foreground hover:border-gray-300'
                      }`}
                    >
                      <span>{preference.emoji}</span>
                      <span className="flex-1 text-left">{preference.name}</span>
                      {selectedPreferences.includes(preference.id) && <Check className="w-4 h-4" />}
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                    검색 결과가 없습니다
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                선택한 선호 카테고리: {selectedPreferences.length}개
                {preferenceSearchQuery && ` (전체 ${Array.isArray(preferencesData) ? preferencesData.length : 0}개 중 ${filteredPreferences.length}개 표시)`}
              </p>
            </>
          )}
        </div>

        {/* UI 언어 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">UI 언어</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
            <select
              value={uiLanguage}
              onChange={(e) => setUiLanguage(e.target.value)}
              className="flex h-12 w-full rounded-xl border-2 border-input bg-background pl-11 pr-10 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-gray-300"
              required
            >
              {UI_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
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

        {/* 연락 허용 설정 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">연락 허용 설정</Label>
          <div className="space-y-2">
            {CONTACT_PERMISSIONS.map((permission) => (
              <button
                key={permission.value}
                type="button"
                onClick={() => setContactPermission(permission.value as typeof contactPermission)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  contactPermission === permission.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-white text-foreground hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{permission.label}</p>
                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                  </div>
                  {contactPermission === permission.value && <Check className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <Label className="text-sm font-medium">알림 설정</Label>
          </div>
          <div className="space-y-3 bg-gray-50 rounded-xl p-4">
            {/* 이메일 알림 */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">이메일 알림</p>
                  <p className="text-xs text-muted-foreground">중요한 소식을 이메일로 받습니다</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>

            {/* 푸시 알림 */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">푸시 알림</p>
                  <p className="text-xs text-muted-foreground">앱 알림을 받습니다</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${pushNotifications ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${pushNotifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>

            {/* 이벤트 리마인더 */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium">이벤트 리마인더</p>
                  <p className="text-xs text-muted-foreground">예정된 이벤트 알림</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={eventReminders}
                  onChange={(e) => setEventReminders(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${eventReminders ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${eventReminders ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>

            {/* 그룹 업데이트 */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">그룹 업데이트</p>
                  <p className="text-xs text-muted-foreground">내 그룹의 새 소식</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={groupUpdates}
                  onChange={(e) => setGroupUpdates(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${groupUpdates ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${groupUpdates ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>

            {/* 뉴스레터 구독 */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">뉴스레터 구독</p>
                  <p className="text-xs text-muted-foreground">핏클 소식과 팁</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={newsletterSubscription}
                  onChange={(e) => setNewsletterSubscription(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${newsletterSubscription ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${newsletterSubscription ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 rounded-xl font-semibold"
          disabled={
            !nationality ||
            !gender ||
            !region ||
            !district ||
            // languages.length === 0 || // 임시 주석 처리
            selectedInterests.length === 0 ||
            selectedPreferences.length === 0
          }
        >
          가입 완료
        </Button>
      </form>
    </div>
  );
}
