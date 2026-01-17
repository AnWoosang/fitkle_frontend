import type { Player } from '../types/game';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/translations';

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string;
  hostId: string;
  gameStatus: 'waiting' | 'playing' | 'finished' | 'preparing' | 'revealing';
}

export function PlayerList({
  players,
  currentPlayerId,
  hostId,
  gameStatus,
}: PlayerListProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  return (
    <div className="player-list">
      <h3>👥 {t.players}</h3>
      <ul>
        {players.map((player) => {
          const isMe = player.id === currentPlayerId;
          const isHost = player.id === hostId;
          const isAlive = player.is_alive;
          const isReady = player.is_ready;
          const showGameStatus = gameStatus === 'playing' || gameStatus === 'finished';
          const showReadyStatus = gameStatus === 'waiting';

          return (
            <li
              key={player.id}
              className={`player-item ${isMe ? 'me' : ''} ${
                showGameStatus && !isAlive ? 'eliminated' : ''
              }`}
            >
              <span className="player-avatar">
                {showGameStatus ? (isAlive ? '😊' : '💀') : '🙂'}
              </span>
              <span className="player-name">
                {player.nickname}
                {isMe && <span className="badge me-badge">{t.me}</span>}
                {isHost && <span className="badge host-badge">{t.host}</span>}
                {showReadyStatus && isReady && !isHost && <span className="badge ready-badge">✅</span>}
              </span>
              {showGameStatus && (
                <span className={`player-status ${isAlive ? 'alive' : 'dead'}`}>
                  {isAlive ? t.alive : t.eliminated}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {players.length === 0 && (
        <p className="no-players">{t.noPlayers}</p>
      )}
    </div>
  );
}
