import { RulesContentProps } from '../common/types';
import { useTranslation } from '@/i18n/translations';

/**
 * 아파트 게임 규칙 컴포넌트
 */
export function ApartmentRules({ minPlayers, maxPlayers, language }: RulesContentProps) {
  const t = useTranslation(language);

  return (
    <div className="rules-section">
      <h3 className="rules-title">{t.gameRulesSubtitle}</h3>
      <ul className="rules-list">
        <li>{t.apartmentRule1}</li>
        <li>{t.apartmentRule2}</li>
        <li>{t.apartmentRule3}</li>
        <li>{t.apartmentRule4}</li>
        <li>{t.apartmentRule5}</li>
        <li className="highlight-rule">{t.apartmentRule6}</li>
      </ul>

      <div style={{ marginTop: '20px', padding: '12px', background: '#334155', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
          {t.apartmentExampleTitle}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>{t.apartmentExample1}</li>
          <li>{t.apartmentExample2}</li>
          <li>{t.apartmentExample3}</li>
        </ul>
      </div>
    </div>
  );
}
