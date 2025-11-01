import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className = '' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-border/50 hover:bg-accent transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}
