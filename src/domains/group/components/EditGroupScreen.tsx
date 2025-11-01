import { useState, useEffect } from 'react';
import { Users, MapPin, Image as ImageIcon, FileText, Globe, Lock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { BackButton } from '@/shared/components/BackButton';
import { groups } from '@/data/groups';

interface EditGroupScreenProps {
  groupId: string;
  onBack: () => void;
  onUpdate: (groupData: any) => void;
}

export function EditGroupScreen({ groupId, onBack, onUpdate }: EditGroupScreenProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Seoul');
  const [category, setCategory] = useState('Social Activities');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  const categories = [
    'Social Activities',
    'Food & Dining',
    'Sports & Fitness',
    'Arts & Culture',
    'Language Exchange',
    'Professional Networking',
    'Outdoor Adventures',
    'Tech & Innovation',
  ];

  const locations = [
    'Seoul',
    'Busan',
    'Incheon',
    'Daegu',
    'Daejeon',
    'Gwangju',
    'Ulsan',
    'Online',
  ];

  // Load existing group data
  useEffect(() => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setName(group.name);
      setDescription(group.description);
      setLocation(group.location);
      setCategory(group.category);
      // privacy는 mock data에 없으므로 기본값 유지
    }
  }, [groupId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      id: groupId,
      name,
      description,
      location,
      category,
      privacy,
    });
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto overscroll-contain">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 left-0 right-0 z-20 px-4 pt-4 pb-3 bg-gradient-to-b from-background via-background to-transparent backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <BackButton onClick={onBack} className="bg-card" />
          <h1 className="text-xl">그룹 수정</h1>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-4 mb-8">
            <BackButton onClick={onBack} className="bg-card" />
            <div>
              <h1 className="text-3xl">그룹 수정</h1>
              <p className="text-muted-foreground mt-1">
                그룹 정보를 업데이트하세요
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 pb-8">
            {/* Group Image */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <Label className="text-base mb-3 block">그룹 이미지 *</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 lg:p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  그룹 사진 업로드 (권장: 1200x630px)
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, GIF (최대 5MB)
                </p>
              </div>
            </div>

            {/* Group Name */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  그룹 이름 *
                </Label>
                <Input
                  id="name"
                  placeholder="예: Seoul Coffee Lovers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  그룹 설명 *
                </Label>
                <Textarea
                  id="description"
                  placeholder="그룹에 대한 상세 설명을 작성해주세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>
            </div>

            {/* Location & Category */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base">
                  위치 *
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`p-3 rounded-lg border transition-all text-sm ${
                        location === loc
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">카테고리 *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-lg border transition-all text-sm ${
                        category === cat
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <Label className="text-base">공개 설정 *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPrivacy('public')}
                  className={`p-4 rounded-xl border transition-all ${
                    privacy === 'public'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Globe
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        privacy === 'public' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="text-left">
                      <p className="font-medium">공개 그룹</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        누구나 참여 가능
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPrivacy('private')}
                  className={`p-4 rounded-xl border transition-all ${
                    privacy === 'private'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Lock
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        privacy === 'private' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="text-left">
                      <p className="font-medium">비공개 그룹</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        승인 후 참여 가능
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 lg:flex-none lg:px-8 py-6"
              >
                취소
              </Button>
              <Button type="submit" className="flex-1 lg:flex-none lg:px-12 py-6">
                수정 완료
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
