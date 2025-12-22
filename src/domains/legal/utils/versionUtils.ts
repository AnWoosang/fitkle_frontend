import fs from 'fs';
import path from 'path';

export interface LegalDocVersion {
  version: string;
  date: string;
  filename: string;
  isCurrent: boolean;
}

/**
 * 파일명에서 버전 정보 파싱
 * 예: "20251217-terms-v1.0.md" -> { version: "1.0", date: "2025-12-17" }
 */
function parseVersionFromFilename(filename: string): { version: string; date: string } | null {
  const match = filename.match(/^(\d{4})(\d{2})(\d{2})-\w+-v([\d.]+)\.md$/);
  if (!match) return null;

  const [, year, month, day, version] = match;
  return {
    version,
    date: `${year}-${month}-${day}`,
  };
}

/**
 * 파일명이 유효한 법적 문서 형식인지 검증
 */
function isValidLegalDocFile(filename: string, docType: string): boolean {
  const pattern = new RegExp(`^\\d{8}-${docType}-v[\\d.]+\\.md$`);
  return pattern.test(filename);
}

/**
 * archive 폴더에서 특정 문서 타입의 모든 버전 가져오기
 * @param docType 'terms' | 'privacy' | 'location'
 */
export function getVersionsForDocument(docType: string): LegalDocVersion[] {
  const archivePath = path.join(process.cwd(), 'public/legal/archive');

  // archive 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(archivePath)) {
    return [];
  }

  const files = fs.readdirSync(archivePath);

  const versions = files
    .filter((f) => isValidLegalDocFile(f, docType))
    .map((filename) => {
      const parsed = parseVersionFromFilename(filename);
      if (!parsed) return null;

      return {
        version: parsed.version,
        date: parsed.date,
        filename,
        isCurrent: false, // 일단 false로 설정
      };
    })
    .filter((v): v is LegalDocVersion => v !== null)
    .sort((a, b) => {
      // 버전 번호로 내림차순 정렬 (최신 버전이 먼저)
      const [aMajor, aMinor] = a.version.split('.').map(Number);
      const [bMajor, bMinor] = b.version.split('.').map(Number);

      if (aMajor !== bMajor) return bMajor - aMajor;
      return bMinor - aMinor;
    });

  return versions;
}

/**
 * 현재 버전 정보 가져오기
 */
export function getCurrentVersion(docType: string): LegalDocVersion {
  // 현재는 하드코딩, 나중에 메타데이터 파일에서 읽어올 수 있음
  const currentVersions: Record<string, LegalDocVersion> = {
    terms: {
      version: '1.0',
      date: '2025-12-17',
      filename: 'public/legal/terms_of_service.md',
      isCurrent: true,
    },
    privacy: {
      version: '1.0',
      date: '2025-12-17',
      filename: 'public/legal/privacy_policy.md',
      isCurrent: true,
    },
    location: {
      version: '1.0',
      date: '2025-12-17',
      filename: 'public/legal/location_terms.md',
      isCurrent: true,
    },
  };

  return currentVersions[docType];
}

/**
 * 모든 버전 목록 가져오기 (현재 버전 포함)
 */
export function getAllVersions(docType: string): LegalDocVersion[] {
  const archivedVersions = getVersionsForDocument(docType);
  const currentVersion = getCurrentVersion(docType);

  // 현재 버전을 맨 앞에 추가
  return [currentVersion, ...archivedVersions];
}

/**
 * 특정 버전의 파일 경로 가져오기
 */
export function getVersionFilePath(docType: string, version: string): string {
  const currentVersion = getCurrentVersion(docType);

  // 현재 버전이면 루트의 파일 반환
  if (version === currentVersion.version) {
    return path.join(process.cwd(), currentVersion.filename);
  }

  // 아카이브 버전이면 archive 폴더에서 찾기
  const allVersions = getAllVersions(docType);
  const targetVersion = allVersions.find((v) => v.version === version);

  if (!targetVersion) {
    // 버전을 찾을 수 없으면 현재 버전 반환
    return path.join(process.cwd(), currentVersion.filename);
  }

  return path.join(process.cwd(), 'public/legal/archive', targetVersion.filename);
}
