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
        <li>{t.baskinRobbins31Rule4}</li>
        <li className="highlight-rule">{t.baskinRobbins31Rule5}</li>
        <li>{t.baskinRobbins31Rule6}</li>
      </ul>

      {/* 게임 데모 GIF */}
      <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <img
          src="/gifs/baskinrobins31.gif"
          alt="베스킨라빈스31 게임 인트로"
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
          {t.baskinRobbins31HowToPlayTitle}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>{t.baskinRobbins31HowToPlay1}</li>
          <li>{t.baskinRobbins31HowToPlay2}</li>
          <li>{t.baskinRobbins31HowToPlay3}</li>
        </ul>
      </div>

      <div style={{ marginTop: '12px', padding: '12px', background: '#334155', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
          {t.baskinRobbins31ScenarioTitle}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li>{t.baskinRobbins31Scenario1}</li>
          <li>{t.baskinRobbins31Scenario2}</li>
          <li>{t.baskinRobbins31Scenario3}</li>
        </ul>
      </div>
    </div>
  );
}
