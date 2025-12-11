"use client";

import { Search, Calendar, Users, Heart } from 'lucide-react';

export function HowItWorksFlow() {
  const steps = [
    {
      icon: Search,
      title: '관심사 찾기',
      description: '좋아하는 활동이나 관심사를 검색하세요',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Calendar,
      title: '이벤트 참여',
      description: '마음에 드는 이벤트에 참가 신청하세요',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Users,
      title: '모임 참석',
      description: '새로운 사람들과 함께 즐거운 시간을 보내세요',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: Heart,
      title: '친구 만들기',
      description: '지속적인 관계를 만들어가세요',
      color: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ];

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-12">
        이렇게 시작하세요
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all h-full">
                <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
