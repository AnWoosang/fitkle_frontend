import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/translations';

export function HostSelectingGameModal() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>⏳ {t.waitingForHostGameSelection}</h2>
        </div>
        <div className="modal-body">
          <p>{t.hostSelectingGame}</p>
          <p className="hint">{t.pleaseWait}</p>
          <div className="spinner" style={{ margin: '2rem auto' }}></div>
        </div>
      </div>
    </div>
  );
}
