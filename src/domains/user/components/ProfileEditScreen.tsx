"use client";

import { BackButton } from '@/shared/components/BackButton';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProfileEditScreenProps {
  onBack: () => void;
  currentProfile: {
    bio: string;
    lookingFor: string[];
    tags: string[];
  };
  onSave: (profile: { bio: string; lookingFor: string[]; tags: string[] }) => void;
}

export function ProfileEditScreen({ onBack, currentProfile, onSave }: ProfileEditScreenProps) {
  const [bio, setBio] = useState(currentProfile.bio);
  const [lookingFor, setLookingFor] = useState<string[]>(currentProfile.lookingFor);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentProfile.tags);

  // 찾고 있는 것 옵션
  const lookingForOptions = [
    { key: 'friends', label: t('lookingForFriends') },
    { key: 'language', label: t('lookingForLanguage') },
    { key: 'activity', label: t('lookingForActivity') },
    { key: 'networking', label: t('lookingForNetworking') },
    { key: 'cultural', label: t('lookingForCultural') },
    { key: 'food', label: t('lookingForFood') },
  ];

  // 나를 나타내는 태그 옵션
  const tagOptions = [
    { key: 'adventurous', label: t('tagAdventurous'), emoji: '🌟' },
    { key: 'foodie', label: t('tagFoodie'), emoji: '🍜' },
    { key: 'creative', label: t('tagCreative'), emoji: '🎨' },
    { key: 'active', label: t('tagActive'), emoji: '⚡' },
    { key: 'bookworm', label: t('tagBookworm'), emoji: '📚' },
    { key: 'nature', label: t('tagNature'), emoji: '🌿' },
    { key: 'tech', label: t('tagTech'), emoji: '💻' },
    { key: 'music', label: t('tagMusic'), emoji: '🎵' },
    { key: 'coffee', label: t('tagCoffee'), emoji: '☕' },
    { key: 'travel', label: t('tagTravel'), emoji: '✈️' },
    { key: 'photography', label: t('tagPhotography'), emoji: '📸' },
    { key: 'yoga', label: t('tagYoga'), emoji: '🧘' },
    { key: 'gaming', label: t('tagGaming'), emoji: '🎮' },
    { key: 'cooking', label: t('tagCooking'), emoji: '👨‍🍳' },
    { key: 'pets', label: t('tagPets'), emoji: '🐾' },
    { key: 'art', label: t('tagArt'), emoji: '🖼️' },
    { key: 'sports', label: t('tagSports'), emoji: '⚽' },
    { key: 'nightlife', label: t('tagNightlife'), emoji: '🌃' },
  ];

  const toggleLookingFor = (key: string) => {
    setLookingFor(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const toggleTag = (key: string) => {
    if (selectedTags.includes(key)) {
      setSelectedTags(prev => prev.filter(tag => tag !== key));
    } else if (selectedTags.length < 8) {
      setSelectedTags(prev => [...prev, key]);
    } else {
      toast.error(t('maxTagsReached'));
    }
  };

  const handleSave = () => {
    onSave({ bio, lookingFor, tags: selectedTags });
    toast.success(t('profileUpdated'));
    onBack();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border/30 px-4 py-4">
        <div className="flex items-center justify-between">
          <BackButton onClick={onBack} />
          <h2 className="text-lg">{t('editProfile')}</h2>
          <Button onClick={handleSave} size="sm" className="px-4">
            {t('save')}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 pb-24">
        {/* Bio Section */}
        <section>
          <div className="mb-3">
            <h3 className="mb-1">{t('aboutMe')}</h3>
            <p className="text-sm text-muted-foreground">{t('aboutMeDescription')}</p>
          </div>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t('aboutMePlaceholder')}
            className="min-h-[120px] resize-none"
            maxLength={300}
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {bio.length}/300
          </p>
        </section>

        {/* Looking For Section */}
        <section>
          <div className="mb-3">
            <h3 className="mb-1">{t('lookingFor')}</h3>
            <p className="text-sm text-muted-foreground">{t('lookingForDescription')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lookingForOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => toggleLookingFor(option.key)}
                className={`px-4 py-2.5 rounded-xl text-sm transition-all border-2 ${
                  lookingFor.includes(option.key)
                    ? 'bg-primary border-primary text-white'
                    : 'bg-card border-border/50 text-foreground hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {lookingFor.includes(option.key) && (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Tags Section */}
        <section>
          <div className="mb-3">
            <h3 className="mb-1">{t('describeYourself')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('describeYourselfDescription')} ({selectedTags.length}/8)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                key={tag.key}
                onClick={() => toggleTag(tag.key)}
                className={`px-4 py-2.5 rounded-xl text-sm transition-all border-2 ${
                  selectedTags.includes(tag.key)
                    ? 'bg-primary border-primary text-white'
                    : 'bg-card border-border/50 text-foreground hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                  {selectedTags.includes(tag.key) && (
                    <Check className="w-4 h-4" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
