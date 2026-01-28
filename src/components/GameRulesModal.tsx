import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/translations';
import { QRCodeSVG } from 'qrcode.react';
import { GameType } from '@/types/game';
import { getGame } from '@/games/registry';
import { useState, useEffect } from 'react';

interface StatementData {
  truth1: string;
  truth2: string;
  lie: string;
  lie_index: number;
}

interface GameRulesModalProps {
  isHost: boolean;
  onReady: () => void;
  onStart: () => void;
  canStart: boolean; // 외부에서 계산된 게임 시작 가능 여부
  isReady: boolean;
  roomCode?: string;
  onLeave: () => void;
  gameType?: GameType | null;
  // Two Truths 전용 props
  hasSubmittedStatements?: boolean;
  onSubmitStatements?: (truth1: string, truth2: string, lie: string) => void;
  myStatement?: StatementData | null;
}

export function GameRulesModal({
  isHost,
  onReady,
  onStart,
  canStart,
  isReady,
  roomCode,
  onLeave,
  gameType,
  hasSubmittedStatements,
  onSubmitStatements,
  myStatement,
}: GameRulesModalProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);

  // Two Truths 진술 입력 state
  const [truth1, setTruth1] = useState('');
  const [truth2, setTruth2] = useState('');
  const [lie, setLie] = useState('');

  // myStatement가 있으면 초기값으로 설정
  useEffect(() => {
    if (myStatement) {
      setTruth1(myStatement.truth1);
      setTruth2(myStatement.truth2);
      setLie(myStatement.lie);
    }
  }, [myStatement]);

  // 게임별 규칙 컴포넌트 가져오기
  const gameEntry = gameType ? getGame(gameType) : null;
  const RulesContent = gameEntry?.components.RulesContent;
  const game = gameEntry?.game;

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      alert(t.codeCopied);
    }
  };

  // 게임별 타이틀 가져오기
  const getGameTitle = () => {
    if (!gameType) return t.gameRulesTitle;

    const gameIcons: Record<GameType, string> = {
      [GameType.NUNCHI]: '👀',
      // [GameType.THREE_SIX_NINE]: '👏',
      [GameType.TWO_TRUTHS]: '🤥',
      [GameType.BASKIN_ROBBINS_31]: '🍦',
      [GameType.APARTMENT]: '🏢',
      [GameType.ZERO]: '🖐️',
    };

    const icon = gameIcons[gameType] || '🎮';
    return `${icon} ${t[gameType as keyof typeof t]}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content game-rules-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getGameTitle()}</h2>
        </div>

        <div className="modal-body">
          {roomCode && (
            <div className="room-invite-section">
              <h3 className="invite-title">{t.invitePlayers}</h3>
              <div className="invite-content">
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    value={`${window.location.origin}/room/${roomCode}`}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="room-code-display" onClick={handleCopyCode} title={t.clickToCopy}>
                  <span className="code-label">{t.roomCode}</span>
                  <span className="code-value">{roomCode}</span>
                  <span className="copy-icon">📋</span>
                </div>
                <p className="qr-code-hint">{t.scanToJoin}</p>
              </div>
            </div>
          )}

          {/* 게임별 규칙 표시 (항상 위에) */}
          {RulesContent && game ? (
            <RulesContent
              minPlayers={game.minPlayers}
              maxPlayers={game.maxPlayers}
              language={language}
            />
          ) : (
            <div className="rules-section">
              <h3 className="rules-title">{t.gameRulesSubtitle}</h3>
              <ul className="rules-list">
                <li>{t.modalRule1}</li>
                <li>{t.modalRule2}</li>
                <li>{t.modalRule3}</li>
                <li className="highlight-rule">{t.modalRule4}</li>
                {t.modalRule5 && <li>{t.modalRule5}</li>}
                {t.modalRule6 && <li>{t.modalRule6}</li>}
              </ul>
            </div>
          )}

          {/* Two Truths 게임: 진술 입력 폼 */}
          {gameType === GameType.TWO_TRUTHS && (
            <div style={{
              marginTop: '24px',
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
              border: '2px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '16px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                ✍️ {t.twoTruthsInputTitle}
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {t.twoTruthsInputDescription}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 진실 1 */}
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-dark)',
                  borderRadius: '12px',
                  border: '2px solid ' + (truth1.trim() ? 'var(--secondary)' : 'var(--border)'),
                  transition: 'all 0.3s ease'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--secondary)',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    {t.twoTruthsTruth1Label}
                  </label>
                  <input
                    type="text"
                    value={truth1}
                    onChange={(e) => setTruth1(e.target.value)}
                    placeholder={t.twoTruthsPlaceholder}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: (!isHost && hasSubmittedStatements && isReady) ? '0.6' : '1',
                      cursor: (!isHost && hasSubmittedStatements && isReady) ? 'not-allowed' : 'text'
                    }}
                    maxLength={200}
                    disabled={!isHost && hasSubmittedStatements && isReady}
                  />
                </div>

                {/* 진실 2 */}
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-dark)',
                  borderRadius: '12px',
                  border: '2px solid ' + (truth2.trim() ? 'var(--secondary)' : 'var(--border)'),
                  transition: 'all 0.3s ease'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--secondary)',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    {t.twoTruthsTruth2Label}
                  </label>
                  <input
                    type="text"
                    value={truth2}
                    onChange={(e) => setTruth2(e.target.value)}
                    placeholder={t.twoTruthsPlaceholder}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: (!isHost && hasSubmittedStatements && isReady) ? '0.6' : '1',
                      cursor: (!isHost && hasSubmittedStatements && isReady) ? 'not-allowed' : 'text'
                    }}
                    maxLength={200}
                    disabled={!isHost && hasSubmittedStatements && isReady}
                  />
                </div>

                {/* 거짓 */}
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-dark)',
                  borderRadius: '12px',
                  border: '2px solid ' + (lie.trim() ? 'var(--danger)' : 'var(--border)'),
                  transition: 'all 0.3s ease'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--danger)',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>❌</span>
                    {t.twoTruthsLieLabel}
                  </label>
                  <input
                    type="text"
                    value={lie}
                    onChange={(e) => setLie(e.target.value)}
                    placeholder={t.twoTruthsPlaceholder}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: (!isHost && hasSubmittedStatements && isReady) ? '0.6' : '1',
                      cursor: (!isHost && hasSubmittedStatements && isReady) ? 'not-allowed' : 'text'
                    }}
                    maxLength={200}
                    disabled={!isHost && hasSubmittedStatements && isReady}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Two Truths가 아닌 경우 또는 진술 제출 후 ready info */}
          {gameType !== GameType.TWO_TRUTHS && (
            <div className="ready-info">
              {isHost ? (
                <p className="host-message">{t.hostReady}</p>
              ) : (
                <p className="player-message">{t.playerReady}</p>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-large btn-secondary" onClick={onLeave}>
            {t.leaveRoom}
          </button>
          {gameType === GameType.TWO_TRUTHS ? (
            /* Two Truths 게임 버튼 로직 */
            isHost ? (
              /* 호스트 버튼 - 게임 시작 (클릭 시 진술 자동 제출) */
              <button
                className="btn btn-large btn-primary"
                onClick={() => {
                  // 진술이 제출되지 않았으면 먼저 제출하고 ready도 설정
                  if (!hasSubmittedStatements && truth1.trim() && truth2.trim() && lie.trim() && onSubmitStatements) {
                    onSubmitStatements(truth1, truth2, lie);
                    // 호스트도 ready 상태로 변경
                    if (!isReady) {
                      onReady();
                    }
                  }
                  // 모든 조건이 만족되면 게임 시작
                  if (canStart) {
                    onStart();
                  }
                }}
                disabled={!truth1.trim() || !truth2.trim() || !lie.trim() || !canStart}
              >
                {t.startGame}
              </button>
            ) : (
              /* 일반 플레이어 버튼 */
              hasSubmittedStatements ? (
                /* 진술 제출 완료 - 준비/준비 취소 토글 */
                <button
                  className={`btn btn-large ${isReady ? 'btn-success' : 'btn-primary'}`}
                  onClick={onReady}
                  disabled={!isReady && (!truth1.trim() || !truth2.trim() || !lie.trim())}
                >
                  {isReady ? t.readyButton : t.notReadyButton}
                </button>
              ) : (
                /* 진술 미제출 - 진술 제출 및 자동 준비 */
                <button
                  className="btn btn-large btn-primary"
                  onClick={() => {
                    if (truth1.trim() && truth2.trim() && lie.trim() && onSubmitStatements) {
                      onSubmitStatements(truth1, truth2, lie);
                      onReady();
                    }
                  }}
                  disabled={!truth1.trim() || !truth2.trim() || !lie.trim()}
                >
                  {truth1.trim() && truth2.trim() && lie.trim() ? t.notReadyButton : t.notReadyButton}
                </button>
              )
            )
          ) : (
            /* 일반 게임 */
            isHost ? (
              <button
                className="btn btn-large btn-primary"
                onClick={onStart}
                disabled={!canStart}
              >
                {canStart ? t.startGame : t.waitingForPlayers}
              </button>
            ) : (
              <button
                className={`btn btn-large ${isReady ? 'btn-success' : 'btn-primary'}`}
                onClick={onReady}
              >
                {isReady ? t.readyButton : t.notReadyButton}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
