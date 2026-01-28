import { RulesContentProps } from '../common/types';
import { useTranslation } from '@/i18n/translations';

/**
 * 눈치게임 규칙 컴포넌트
 */
export function NunchiRules({ minPlayers, maxPlayers, language }: RulesContentProps) {
  const t = useTranslation(language);

  return (
    <div className="rules-section">
      <h3 className="rules-title">{t.gameRulesSubtitle}</h3>

      {/* 규칙 리스트 */}
      <ul className="rules-list">
        <li>{t.modalRule1}</li>
        <li>{t.modalRule2}</li>
        <li>{t.modalRule3}</li>
        <li>{t.modalRule4}</li>
        <li>{t.modalRule5}</li>
        <li className="highlight-rule">{t.modalRule6}</li>
      </ul>

      {/* 게임 데모 GIF */}
      <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <img
          src="/gifs/nunchi.gif"
          alt="눈치게임 플레이 예시"
          style={{
            maxWidth: '100%',
            maxHeight: '300px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        />
      </div>

      <div style={{ marginTop: '20px', padding: '12px', background: '#334155', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
          {t.nunchiScenarioTitle}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>{t.nunchiScenario1}</li>
          <li>{t.nunchiScenario2}</li>
          <li>{t.nunchiScenario3}</li>
        </ul>
      </div>
    </div>
  );
}
