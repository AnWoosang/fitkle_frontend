"use client";

import { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LocationFilterProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const locations = {
  '서울': [
    '강남구', '강동구', '강북구', '강서구', '관악구', 
    '광진구', '구로구', '금천구', '노원구', '도봉구',
    '동대문구', '동작구', '마포구', '서대문구', '서초구',
    '성동구', '성북구', '송파구', '양천구', '영등포구',
    '용산구', '은평구', '종로구', '중구', '중랑구'
  ],
  '경기': [
    '수원시', '성남시', '고양시', '용인시', '부천시',
    '안산시', '안양시', '남양주시', '화성시', '평택시'
  ],
  '인천': ['전체'],
  '부산': ['전체'],
  '대구': ['전체'],
  '대전': ['전체'],
  '광주': ['전체'],
};

export function LocationFilter({ selectedLocation, onLocationChange }: LocationFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{selectedLocation}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => onLocationChange('전체 지역')}>
          전체 지역
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {Object.entries(locations).map(([city, districts]) => (
          districts.length === 1 && districts[0] === '전체' ? (
            <DropdownMenuItem key={city} onClick={() => onLocationChange(city)}>
              {city}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuSub key={city}>
              <DropdownMenuSubTrigger>{city}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="max-h-96 overflow-y-auto">
                <DropdownMenuItem onClick={() => onLocationChange(city)}>
                  {city} 전체
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {districts.map((district) => (
                  <DropdownMenuItem
                    key={district}
                    onClick={() => onLocationChange(`${city} ${district}`)}
                  >
                    {district}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
