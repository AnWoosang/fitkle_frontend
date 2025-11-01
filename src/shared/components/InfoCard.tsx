import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  subValue?: string;
  className?: string;
}

export function InfoCard({ icon: Icon, label, value, subValue, className = '' }: InfoCardProps) {
  return (
    <div className={`flex items-start gap-3 p-3 bg-muted rounded-lg ${className}`}>
      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <div className="text-sm">{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
        )}
      </div>
    </div>
  );
}
