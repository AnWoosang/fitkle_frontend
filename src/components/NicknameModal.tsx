import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/translations';

interface NicknameModalProps {
  onSubmit: (nickname: string) => void;
}

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
];

export function NicknameModal({ onSubmit }: NicknameModalProps) {
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content nickname-modal">
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{t.enterNicknameTitle}</h2>

          {/* 언어 선택 */}
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
            }}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.flag} {option.label}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p>{t.enterNicknameDescription}</p>
            <input
              type="text"
              className="nickname-input"
              placeholder={t.nicknamePlaceholder}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoFocus
              maxLength={20}
            />
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={!nickname.trim()}
            >
              {t.joinRoom}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
