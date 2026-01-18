'use client';

import { RulesContentProps } from '@/games/common/types';
import { useTranslation } from '@/i18n/translations';

export function TwoTruthsRules({ minPlayers, maxPlayers, language }: RulesContentProps) {
  const t = useTranslation(language);

  return (
    <div className="rules-section">
      <h3 className="rules-title">{t.gameRulesSubtitle}</h3>
      <ul className="rules-list">
        <li>{t.twoTruthsRule1}</li>
        <li>{t.twoTruthsRule2}</li>
        <li>{t.twoTruthsRule3}</li>
        <li className="highlight-rule">{t.twoTruthsRule4}</li>
      </ul>

      <div style={{ marginTop: '20px', padding: '12px', background: '#334155', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
          {t.twoTruthsScenarioTitle}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>{t.twoTruthsScenario1}</li>
          <li>{t.twoTruthsScenario2}</li>
          <li>{t.twoTruthsScenario3}</li>
          <li>{t.twoTruthsScenario4}</li>
        </ul>
      </div>
    </div>
  );
}
