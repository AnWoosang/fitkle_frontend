import { RulesContentProps } from '../common/types';
import { useTranslation } from '@/i18n/translations';

/**
 * 369 게임 규칙 컴포넌트
 */
export function ThreeSixNineRules({ minPlayers, maxPlayers, language }: RulesContentProps) {
  const t = useTranslation(language);

  return (
    <div className="rules-section">
      <h3 className="rules-title">{t.gameRulesSubtitle}</h3>
      <ul className="rules-list">
        <li>{t.modal369Rule1.replace('2', minPlayers.toString()).replace('10', maxPlayers.toString())}</li>
        <li>{t.modal369Rule2}</li>
        <li>{t.modal369Rule3}</li>
        <li className="highlight-rule">{t.modal369Rule4}</li>
        <li>
          {t.modal369Rule5}
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>{t.modal369ChoiceSayNumber}</li>
            <li>{t.modal369ChoiceClapOnce}</li>
            <li>{t.modal369ChoiceClapTwice}</li>
            <li>{t.modal369ChoiceClapThrice}</li>
          </ul>
        </li>
        <li>{t.modal369Rule6}</li>
        <li>{t.modal369Rule8}</li>
      </ul>

      <div style={{ marginTop: '20px', padding: '12px', background: '#334155', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
          {t.modal369ExampleTitle}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>{t.modal369Example1}</li>
          <li>{t.modal369Example2}</li>
          <li>{t.modal369Example3}</li>
          <li>{t.modal369Example4}</li>
        </ul>
      </div>
    </div>
  );
}
