"use client";

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
import regionsData from '@/assets/regions.json';

interface LocationFilterProps {
  value: string;
  onChange: (location: string) => void;
}

// regions.json 데이터를 사용
const locations = regionsData as Record<string, string[]>;

export function LocationFilter({ value, onChange }: LocationFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => onChange('전체 지역')}>
          전체 지역
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {Object.entries(locations).map(([province, districts]) => (
          <DropdownMenuSub key={province}>
            <DropdownMenuSubTrigger className="text-sm">
              {province}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-96 overflow-y-auto w-48">
              <DropdownMenuItem onClick={() => onChange(province)}>
                {province} 전체
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {districts.map((district) => (
                <DropdownMenuItem
                  key={district}
                  onClick={() => onChange(`${province} ${district}`)}
                  className="text-sm"
                >
                  {district}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
