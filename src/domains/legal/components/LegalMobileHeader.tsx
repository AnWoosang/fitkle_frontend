'use client';

import { useRouter } from 'next/navigation';
import { AppLogo } from '@/shared/components/AppLogo';
import { LegalDocVersion } from '../utils/versionUtils';

interface LegalMobileHeaderProps {
  title: string;
  versions: LegalDocVersion[];
  currentPath: string;
  currentVersion: string;
}

export function LegalMobileHeader({
  title,
  versions,
  currentPath,
  currentVersion,
}: LegalMobileHeaderProps) {
  const router = useRouter();

  const handleVersionChange = (version: string) => {
    if (version === currentVersion) return;
    router.push(`${currentPath}?version=${version}`);
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div className="md:hidden sticky top-0 z-50 bg-background">
      {/* 상단 로고 헤더 */}
      <div className="bg-background">
        <div className="flex items-center justify-center px-4 py-3">
          {/* 로고 */}
          <AppLogo onClick={handleLogoClick} />
        </div>
      </div>

      {/* 문서 정보 헤더 */}
      <div className="bg-background border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-center mb-4">{title}</h1>

          {/* 버전 선택 */}
          <div className="flex items-center justify-center">
            <select
              value={currentVersion}
              onChange={(e) => handleVersionChange(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {versions.map((v) => (
                <option key={v.version} value={v.version}>
                  {v.date}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
