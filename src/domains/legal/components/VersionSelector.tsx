'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Version {
  version: string;
  date: string;
  isCurrent: boolean;
}

interface VersionSelectorProps {
  versions: Version[];
  currentPath: string;
}

export function VersionSelector({ versions, currentPath }: VersionSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedVersion = searchParams.get('version') || versions.find(v => v.isCurrent)?.version || '';

  const handleVersionChange = (version: string) => {
    const currentVersion = versions.find(v => v.isCurrent);

    if (version === currentVersion?.version) {
      // 현재 버전 선택 시 쿼리 파라미터 제거
      router.push(currentPath);
    } else {
      // 다른 버전 선택 시 쿼리 파라미터 추가
      router.push(`${currentPath}?version=${version}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="version-select" className="text-sm font-medium text-muted-foreground">
        변경 이력
      </label>
      <select
        id="version-select"
        value={selectedVersion}
        onChange={(e) => handleVersionChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground cursor-pointer hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {versions.map((v) => (
          <option key={v.version} value={v.version}>
            {v.date}
          </option>
        ))}
      </select>
    </div>
  );
}
