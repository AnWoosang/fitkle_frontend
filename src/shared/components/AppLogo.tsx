"use client";

import Image from 'next/image';

interface AppLogoProps {
  compact?: boolean;
  onClick?: () => void;
}

export function AppLogo({ compact = false, onClick }: AppLogoProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        <Image
          src="/logo.png"
          alt="Fitkle"
          width={100}
          height={28}
          className="h-7 w-auto"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <Image
        src="/logo.png"
        alt="Fitkle"
        width={100}
        height={32}
        className="h-8 w-auto"
      />
    </div>
  );
}
