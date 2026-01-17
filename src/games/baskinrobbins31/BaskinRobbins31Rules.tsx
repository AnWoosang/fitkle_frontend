import { RulesContentProps } from '../common/types';
import { useTranslation } from '@/i18n/translations';

/**
 * 베스킨라빈스31 게임 규칙 컴포넌트
 */
export function BaskinRobbins31Rules({ minPlayers, maxPlayers, language }: RulesContentProps) {
  const t = useTranslation(language);

  return (
    <div className="rules-section">
      <h3 className="rules-title">{t.gameRulesSubtitle}</h3>
      <ul className="rules-list">
        <li>{t.baskinRobbins31Rule1}</li>
        <li>{t.baskinRobbins31Rule2}</li>
        <li>{t.baskinRobbins31Rule3}</li>
        <li className="highlight-rule">{t.baskinRobbins31Rule4}</li>
        <li>{t.baskinRobbins31Rule5}</li>
      </ul>
    </div>
  );
}
