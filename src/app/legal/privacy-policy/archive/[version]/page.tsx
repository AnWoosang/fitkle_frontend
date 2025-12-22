import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface PageProps {
  params: Promise<{
    version: string; // 예: "v1.0"
  }>;
}

export default async function PrivacyPolicyVersionPage({ params }: PageProps) {
  const { version } = await params;

  // archive 디렉토리에서 해당 버전 파일 찾기
  const archiveDir = path.join(process.cwd(), 'public/legal/archive');

  if (!fs.existsSync(archiveDir)) {
    notFound();
  }

  const files = fs.readdirSync(archiveDir);
  const targetFile = files.find(file => file.includes(`-${version}.md`) && file.includes('privacy-policy'));

  if (!targetFile) {
    notFound();
  }

  // 파일 읽기
  const filePath = path.join(archiveDir, targetFile);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // 파일명에서 시행일 추출
  const dateMatch = targetFile.match(/^(\d{8})/);
  const dateStr = dateMatch ? dateMatch[1] : '';
  const effectiveDate = dateStr
    ? new Date(`${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`)
        .toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/legal/privacy-policy/archive"
            className="text-sm text-primary hover:underline"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ 이것은 과거 버전({version})입니다. 시행일: {effectiveDate}
          </p>
          <Link
            href="/legal/privacy-policy"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            최신 버전 보기 →
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          개인정보 처리방침 ({version})
        </h1>

        <div className="prose prose-sm md:prose-base max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-h1:text-xl md:prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6
          prose-h2:text-lg md:prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-5
          prose-h3:text-base md:prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
          prose-p:text-foreground/90 prose-p:mb-4 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
          prose-strong:text-foreground prose-strong:font-semibold
          prose-ul:text-foreground/90 prose-ul:mb-4 prose-ul:list-disc prose-ul:pl-5 md:prose-ul:pl-6 prose-ul:space-y-2
          prose-ol:text-foreground/90 prose-ol:mb-4 prose-ol:list-decimal prose-ol:pl-5 md:prose-ol:pl-6 prose-ol:space-y-2
          prose-li:leading-relaxed prose-li:text-sm md:prose-li:text-base
          prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-3 md:prose-blockquote:pl-4
          prose-blockquote:py-2 prose-blockquote:my-4 prose-blockquote:italic prose-blockquote:bg-gradient-to-r
          prose-blockquote:from-primary/5 prose-blockquote:to-transparent prose-blockquote:rounded-r-lg prose-blockquote:text-foreground/80
          prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs md:prose-code:text-sm
          prose-code:border prose-code:border-border/30 prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
          prose-table:border-collapse prose-table:w-full prose-table:my-4
          prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:px-3 prose-th:py-2 prose-th:text-left
          prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {fileContents}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

// 정적 생성을 위한 경로 목록 (선택사항)
export async function generateStaticParams() {
  const archiveDir = path.join(process.cwd(), 'public/legal/archive');

  if (!fs.existsSync(archiveDir)) {
    return [];
  }

  const files = fs.readdirSync(archiveDir);

  return files
    .filter(file => file.includes('privacy-policy') && file.endsWith('.md'))
    .map(file => {
      const match = file.match(/-(v[\d.]+)\.md$/);
      return match ? { version: match[1] } : null;
    })
    .filter(Boolean) as { version: string }[];
}
