import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/translations';

interface Player {
  id: string;
  nickname: string;
  is_alive: boolean;
}

interface GameResultModalProps {
  players: Player[];
  currentPlayerId: string;
  isHost: boolean;
  onRestart: () => void;
  onLeave: () => void;
}

export function GameResultModal({
  players,
  currentPlayerId,
  isHost,
  onRestart,
  onLeave,
}: GameResultModalProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);

  // 눈치게임: 탈락하지 않은 사람들은 모두 승리자, 탈락한 사람들은 패배
  const survivors = players.filter(p => p.is_alive);
  const eliminated = players.filter(p => !p.is_alive);

  // 현재 플레이어가 생존자인지 확인
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isSurvivor = currentPlayer?.is_alive ?? false;

  return (
    <div className="modal-overlay">
      <div className="modal-content game-result-modal">
        <div className="modal-header">
          <h2>{t.gameOver}</h2>
        </div>

        <div className="modal-body">
          <div className="result-message">
            <p className="main-message">
              {isSurvivor ? t.congratulations : t.eliminated}
            </p>
          </div>

          <div className="survivors-list">
            <h3>🏆 {t.survivors}</h3>
            <ul>
              {survivors.map((player) => (
                <li key={player.id} className="survivor-player">
                  <span className="player-emoji">🎉</span>
                  <span className="player-name">{player.nickname}</span>
                </li>
              ))}
            </ul>
          </div>

          {eliminated.length > 0 && (
            <div className="eliminated-list">
              <h3>{t.eliminatedPlayers}</h3>
              <ul>
                {eliminated.map((player) => (
                  <li key={player.id} className="eliminated-player">
                    <span className="player-emoji">💀</span>
                    <span className="player-name">{player.nickname}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {isHost && (
            <button className="btn btn-primary" onClick={onRestart}>
              {t.restartGame}
            </button>
          )}
          <button className="btn btn-secondary" onClick={onLeave}>
            {t.leaveRoom}
          </button>
        </div>
      </div>
    </div>
  );
}
