"use client";

import { Calendar, Search, Users } from 'lucide-react';

interface FeaturesGridProps {
  onCreateEventClick?: () => void;
  onFindEventsClick?: () => void;
  onMakeFriendsClick?: () => void;
}

export function FeaturesGrid({
  onCreateEventClick,
  onFindEventsClick,
  onMakeFriendsClick
}: FeaturesGridProps) {
  const features = [
    {
      icon: Calendar,
      title: '이벤트 만들기',
      description: '관심사를 공유할 사람들을 모으고, 직접 모임을 만들어보세요.',
      onClick: onCreateEventClick,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      icon: Search,
      title: '이벤트 찾기',
      description: '내 주변의 흥미로운 활동들을 찾아 새로운 경험을 시작하세요.',
      onClick: onFindEventsClick,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      icon: Users,
      title: '친구 만들기',
      description: '같은 관심사를 가진 사람들과 연결되어 지속적인 관계를 만들어가세요.',
      onClick: onMakeFriendsClick,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="py-12">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              onClick={feature.onClick}
              className={`
                bg-white rounded-2xl p-8 border-2 ${feature.borderColor}
                transition-all duration-300
                ${feature.onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''}
              `}
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                <Icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
