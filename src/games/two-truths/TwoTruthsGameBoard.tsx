'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { Player } from '@/types/game';
import { useState, useEffect } from 'react';

interface TwoTruthsGameBoardProps {
  players: Player[];
  currentTurn: number;
  currentTurnPlayer: Player | null;
  currentStatements: string[] | null;
  hasSubmittedStatements: boolean;
  hasVoted: boolean;
  isMyTurnToBeGuessed: boolean;
  playerId: string;
  gameStatus: 'waiting' | 'preparing' | 'playing' | 'revealing' | 'finished';
  onSubmitStatements: (truth1: string, truth2: string, lie: string) => void;
  onCastVote: (index: number) => void;
}

export function TwoTruthsGameBoard({
  players,
  currentTurn,
  currentTurnPlayer,
  currentStatements,
  hasSubmittedStatements,
  hasVoted,
  isMyTurnToBeGuessed,
  playerId,
  gameStatus,
  onSubmitStatements,
  onCastVote,
}: TwoTruthsGameBoardProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [truth1, setTruth1] = useState('');
  const [truth2, setTruth2] = useState('');
  const [lie, setLie] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const myPlayer = players.find(p => p.id === playerId);
  const isAlive = myPlayer?.is_alive ?? false;

  // 턴이 바뀔 때마다 선택 초기화
  useEffect(() => {
    setSelectedIndex(null);
  }, [currentTurn]);

  // 준비 단계: 진술 작성 (이 화면은 모달에서 처리하므로 여기서는 제거)
  if (gameStatus === 'waiting' && !hasSubmittedStatements) {
    return null;
  }

  // 대기 중: 다른 플레이어들이 진술 작성 중
  if (gameStatus === 'waiting' && hasSubmittedStatements) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        minHeight: '300px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '4px solid rgba(99, 102, 241, 0.2)',
          borderTop: '4px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '24px'
        }}></div>
        <p style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          {t.twoTruthsWaitingForStatements}
        </p>
      </div>
    );
  }

  // 게임 진행 중
  if (gameStatus === 'playing' && currentStatements && currentTurnPlayer) {
    // 본인 차례인 경우: 투표 안 함
    if (isMyTurnToBeGuessed) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              🎯 {currentTurnPlayer.nickname} {t.twoTruthsYourTurn}
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500'
            }}>
              다른 플레이어들이 투표 중입니다...
            </p>
          </div>

          {/* 본인의 진술 표시 (섞인 순서) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentStatements.map((statement, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '2px solid var(--border)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    minWidth: '32px'
                  }}>
                    {index + 1}.
                  </span>
                  <p style={{
                    color: 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: '500',
                    lineHeight: '1.6',
                    flex: 1
                  }}>
                    {statement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 생존자가 아닌 경우: 관전
    if (!isAlive) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6b7280, #4b5563)',
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(107, 114, 128, 0.3)'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              👁️ {currentTurnPlayer.nickname} {t.twoTruthsYourTurn}
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500'
            }}>
              {t.twoTruthsEliminated} - 관전 중
            </p>
          </div>

          {/* 진술 표시 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentStatements.map((statement, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '2px solid var(--border)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  opacity: '0.5',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: 'var(--text-secondary)',
                    minWidth: '32px'
                  }}>
                    {index + 1}.
                  </span>
                  <p style={{
                    color: 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: '500',
                    lineHeight: '1.6',
                    flex: 1
                  }}>
                    {statement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 투표해야 하는 경우
    if (!hasVoted) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              🤔 {currentTurnPlayer.nickname} {t.twoTruthsYourTurn}
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              {t.twoTruthsVotePrompt}
            </p>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '400',
              fontStyle: 'italic'
            }}>
              {t.twoTruthsDiscussPrompt}
            </p>
          </div>

          {/* 진술 선택 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentStatements.map((statement, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: selectedIndex === index
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))'
                    : 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: selectedIndex === index
                    ? '3px solid var(--danger)'
                    : '2px solid var(--border)',
                  boxShadow: selectedIndex === index
                    ? '0 8px 24px rgba(239, 68, 68, 0.2)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: selectedIndex === index ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: selectedIndex === index ? 'var(--danger)' : 'var(--primary)',
                    minWidth: '32px'
                  }}>
                    {index + 1}.
                  </span>
                  <p style={{
                    color: 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: '500',
                    lineHeight: '1.6',
                    flex: 1
                  }}>
                    {statement}
                  </p>
                  {selectedIndex === index && (
                    <span style={{
                      fontSize: '24px',
                      color: 'var(--danger)',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* 투표 버튼 */}
          <button
            onClick={() => {
              if (selectedIndex !== null) {
                onCastVote(selectedIndex);
              }
            }}
            disabled={selectedIndex === null}
            style={{
              width: '100%',
              padding: '18px 24px',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: '800',
              border: 'none',
              cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
              background: selectedIndex !== null
                ? 'linear-gradient(135deg, var(--danger), #dc2626)'
                : 'var(--bg-dark)',
              color: selectedIndex !== null ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: selectedIndex !== null
                ? '0 8px 24px rgba(239, 68, 68, 0.3)'
                : 'none',
              transition: 'all 0.3s ease',
              transform: selectedIndex !== null ? 'translateY(0)' : 'none',
              opacity: selectedIndex !== null ? 1 : 0.5
            }}
          >
            {selectedIndex !== null ? `❌ ${t.twoTruthsVoted}` : t.twoTruthsVoted}
          </button>
        </div>
      );
    }

    // 투표 완료
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--secondary), #059669)',
          borderRadius: '20px',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '12px'
          }}>
            ✅ {currentTurnPlayer.nickname} {t.twoTruthsYourTurn}
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500'
          }}>
            {t.twoTruthsWaitingForVotes}
          </p>
        </div>

        {/* 진술 표시 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentStatements.map((statement, index) => (
            <div
              key={index}
              style={{
                background: selectedIndex === index
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
                  : 'var(--bg-card)',
                borderRadius: '16px',
                padding: '20px 24px',
                border: selectedIndex === index
                  ? '3px solid var(--secondary)'
                  : '2px solid var(--border)',
                boxShadow: selectedIndex === index
                  ? '0 8px 24px rgba(16, 185, 129, 0.2)'
                  : '0 4px 12px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: selectedIndex === index ? 'var(--secondary)' : 'var(--primary)',
                  minWidth: '32px'
                }}>
                  {index + 1}.
                </span>
                <p style={{
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  fontWeight: '500',
                  lineHeight: '1.6',
                  flex: 1
                }}>
                  {statement}
                </p>
                {selectedIndex === index && (
                  <span style={{
                    fontSize: '18px',
                    color: 'var(--secondary)',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ✓ 투표함
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 기본
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      minHeight: '300px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        border: '4px solid rgba(99, 102, 241, 0.2)',
        borderTop: '4px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  );
}
