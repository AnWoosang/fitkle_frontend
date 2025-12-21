import fs from 'fs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { VersionSelector } from '@/domains/legal/components';
import { getAllVersions, getVersionFilePath, getCurrentVersion } from '@/domains/legal/utils';
import { Footer } from '@/shared/components';

interface PageProps {
  searchParams: { version?: string };
}

export default function LocationTermsPage({ searchParams }: PageProps) {
  const requestedVersion = searchParams.version;

  // 모든 버전 목록 가져오기
  const allVersions = getAllVersions('location');
  const currentVersion = getCurrentVersion('location');

  // 요청된 버전 또는 현재 버전의 파일 읽기
  const version = requestedVersion || currentVersion.version;
  const filePath = getVersionFilePath('location', version);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // 현재 표시 중인 버전 정보
  const displayVersion = allVersions.find((v) => v.version === version) || currentVersion;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-12 pb-6">
        {/* Header with Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">위치기반서비스 이용약관</h1>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">시행일</span>
              <span>{displayVersion.date}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <VersionSelector versions={allVersions} currentPath="/legal/location-terms" />
          </div>
        </div>

        {/* Markdown Content */}
        <article className="space-y-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-8 pb-2 border-b border-border text-foreground">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl md:text-2xl font-bold mb-3 mt-6 pb-2 border-b border-border/50 text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg md:text-xl font-bold mb-3 mt-5 text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-foreground/85 mb-5 leading-relaxed text-[15px] md:text-base">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="text-foreground/85 mb-5 list-disc pl-6 md:pl-7 space-y-2.5">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-foreground/85 mb-5 list-decimal pl-6 md:pl-7 space-y-2.5">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed text-[15px] md:text-base pl-1">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-foreground font-bold text-[15px] md:text-base">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="text-foreground/90 italic">
                  {children}
                </em>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary font-medium no-underline hover:underline decoration-2 underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/40 pl-4 md:pl-5 py-3 my-6 italic bg-muted/30 rounded-r-md text-foreground/75">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-muted/60 px-2 py-0.5 rounded-md text-sm border border-border/40 text-foreground font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted/60 p-4 rounded-md overflow-x-auto border border-border/40 my-6">
                  {children}
                </pre>
              ),
              hr: () => (
                <hr className="border-border/30 my-8" />
              ),
              br: () => <br />,
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="border-collapse w-full">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted/60">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody>
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr>
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="border border-border px-4 py-3 text-left font-semibold text-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-3 text-foreground/85">
                  {children}
                </td>
              ),
            }}
          >
            {fileContents}
          </ReactMarkdown>
        </article>
      </div>
      <Footer />
    </div>
  );
}
