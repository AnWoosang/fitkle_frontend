'use client';

import { RulesContentProps } from '@/games/common/types';
import { useTranslation } from '@/i18n/translations';

export function ZeroRules({ minPlayers, maxPlayers, language }: RulesContentProps) {
  const t = useTranslation(language);

  return (
    <div className="rules-section">
      <h3 className="rules-title">{t.gameRulesSubtitle}</h3>
      <ul className="rules-list">
        <li>{t.zeroRule1}</li>
        <li>{t.zeroRule2}</li>
        <li>{t.zeroRule3}</li>
        <li className="highlight-rule">{t.zeroRule4}</li>
      </ul>

      <div style={{ marginTop: '20px', padding: '12px', background: '#334155', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
          {t.zeroHowToPlayTitle}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>{t.zeroHowToPlay1}</li>
          <li>{t.zeroHowToPlay2}</li>
          <li>{t.zeroHowToPlay3}</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '12px', background: '#334155', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
          {t.zeroScenarioTitle}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>{t.zeroScenario1}</li>
          <li>{t.zeroScenario2}</li>
          <li>{t.zeroScenario3}</li>
        </ul>
      </div>
    </div>
  );
}
