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
        <li>{t.modalRule5}</li>
        <li>{t.modalRule6}</li>
        <li>{t.modalRule7}</li>
      </ul>
    </div>
  );
}
