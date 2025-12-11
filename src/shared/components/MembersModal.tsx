'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface Member {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
}

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  title?: string;
  onMemberClick?: (memberId: string) => void;
}

export function MembersModal({ isOpen, onClose, members, title = 'Members', onMemberClick }: MembersModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 아바타 색상 헬퍼
  const getAvatarColor = (index: number) => {
    const colors = ['bg-pink-200', 'bg-purple-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200'];
    return colors[index % colors.length];
  };

  // 이니셜 추출
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">{title} ({members.length})</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
          {members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((member, idx) => {
                const isClickable = onMemberClick && member.role === 'admin';
                const content = (
                  <>
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full ${getAvatarColor(idx)} flex items-center justify-center`}>
                        <span className="text-lg font-medium">{getInitial(member.name)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{member.name}</p>
                      {member.role && (
                        <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                      )}
                    </div>
                  </>
                );

                return isClickable ? (
                  <button
                    key={member.id}
                    onClick={() => onMemberClick(member.id)}
                    className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    {content}
                  </button>
                ) : (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">아직 멤버가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
