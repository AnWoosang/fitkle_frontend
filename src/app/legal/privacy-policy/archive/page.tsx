import fs from 'fs';
import path from 'path';
import Link from 'next/link';

interface VersionInfo {
  version: string;        // v1.0
  date: string;           // 2024-12-17
  filename: string;       // 20241217-privacy-policy-v1.0.md
  effectiveDate: string;  // 2024년 12월 17일
}

export default function PrivacyPolicyArchivePage() {
  const archiveDir = path.join(process.cwd(), 'public/legal/archive');

  // archive 디렉토리가 없거나 비어있으면 빈 배열
  let versions: VersionInfo[] = [];

  if (fs.existsSync(archiveDir)) {
    const files = fs.readdirSync(archiveDir)
      .filter(file => file.includes('privacy-policy') && file.endsWith('.md'))
      .sort()
      .reverse(); // 최신순 정렬

    versions = files.map(filename => {
      // 파일명에서 정보 추출: 20241217-privacy-policy-v1.0.md
      const match = filename.match(/^(\d{8})-privacy-policy-(v[\d.]+)\.md$/);
      if (!match) return null;

      const [, dateStr, version] = match;
      const date = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
      const effectiveDate = new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return { version, date, filename, effectiveDate };
    }).filter(Boolean) as VersionInfo[];
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/legal/privacy-policy"
            className="text-sm text-primary hover:underline"
          >
            ← 최신 버전으로 돌아가기
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">개인정보 처리방침 - 이전 버전</h1>

        {versions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              아직 보관된 이전 버전이 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map(({ version, effectiveDate }) => (
              <div
                key={version}
                className="border border-border rounded-lg p-4 hover:bg-card/50 transition-colors"
              >
                <Link href={`/legal/privacy-policy/archive/${version}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">{version}</h2>
                      <p className="text-sm text-muted-foreground">
                        시행일: {effectiveDate}
                      </p>
                    </div>
                    <span className="text-primary">보기 →</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
