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
      <ul className="rules-list">
        <li>{t.modalRule1}</li>
        <li>{t.modalRule2}</li>
        <li>{t.modalRule3}</li>
        <li className="highlight-rule">{t.modalRule4}</li>
      </ul>

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
