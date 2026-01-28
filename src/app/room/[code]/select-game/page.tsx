'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { GameType, GAME_REGISTRY } from '@/types/game';

console.log('🔍 [select-game/page.tsx] 파일 로드됨');

interface GameCard {
  id: GameType;
  icon: string;
  descriptionKey: string;
}

export default function SelectGamePage() {
  console.log('🔍 [SelectGamePage] 컴포넌트 렌더링 시작');

  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const code = params?.code as string;
  console.log('🔍 [SelectGamePage] code:', code);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 [SelectGamePage] 마운트됨');
    return () => console.log('🔍 [SelectGamePage] 언마운트됨');
  }, []);

  // 게임 레지스트리에서 자동으로 게임 목록 생성
  const getDescriptionKey = (gameType: GameType) => {
    switch (gameType) {
      case GameType.NUNCHI:
        return 'nunchiGameDescription' as const;
      // case GameType.THREE_SIX_NINE:
      //   return 'threeSixNineGameDescription' as const;
      case GameType.TWO_TRUTHS:
        return 'twoTruthsGameDescription' as const;
      case GameType.BASKIN_ROBBINS_31:
        return 'baskinRobbins31GameDescription' as const;
      case GameType.APARTMENT:
        return 'apartmentGameDescription' as const;
      case GameType.ZERO:
        return 'zeroGameDescription' as const;
      default:
        return 'nunchiGameDescription' as const;
    }
  };

  const games: GameCard[] = Object.values(GAME_REGISTRY).map((game) => ({
    id: game.id,
    icon: game.icon,
    descriptionKey: getDescriptionKey(game.id),
  }));

  // PLAYABLE과 INFO_ONLY 게임 분리
  const playableGames = games.filter(
    (game) => GAME_REGISTRY[game.id].implementationType === 'PLAYABLE'
  );
  const infoGames = games.filter(
    (game) => GAME_REGISTRY[game.id].implementationType === 'INFO_ONLY'
  );

  useEffect(() => {
    const id = sessionStorage.getItem('playerId');
    if (!id) {
      router.push('/');
      return;
    }
    setPlayerId(id);

    // 호스트 확인
    const checkHost = async () => {
      try {
        const { data: room } = await supabase
          .from('rooms')
          .select('host_id')
          .eq('code', code)
          .single();

        if (!room) {
          setError(t.roomNotFound);
          return;
        }

        if (room.host_id !== id) {
          // 호스트가 아니면 대기실로 리다이렉트
          router.push(`/room/${code}`);
          return;
        }

        setIsHost(true);
      } catch (err) {
        console.error('방 확인 실패:', err);
        setError(t.error);
      } finally {
        setIsLoading(false);
      }
    };

    checkHost();
  }, [code, router, t]);

  const handleGameSelect = async (gameType: GameType) => {
    if (!isHost) return;

    try {
      // INFO_ONLY 게임인 경우 규칙 페이지로 모든 플레이어 이동
      if (GAME_REGISTRY[gameType].implementationType === 'INFO_ONLY') {
        // DB에 게임 타입 저장하고 상태를 waiting으로 설정
        await supabase
          .from('rooms')
          // @ts-ignore
          .update({
            game_type: gameType,
            status: 'waiting',
            want_change_game: [],
          })
          .eq('code', code);

        // 규칙 페이지로 이동
        router.push(`/room/${code}/rules`);
        return;
      }

      // PLAYABLE 게임인 경우 기존 로직
      // DB에 게임 타입 저장 및 상태를 waiting으로 변경
      // @ts-ignore
      await supabase
        .from('rooms')
        .update({
          game_type: gameType,
          status: 'waiting',
          current_number: 0,
          current_turn: null,
          current_turn_player_id: null,
        })
        .eq('code', code);

      // 게임 페이지로 이동
      router.push(`/room/${code}`);
    } catch (err) {
      console.error('게임 선택 실패:', err);
      setError(t.error);
    }
  };

  if (isLoading) {
    return (
      <div className="game-room loading">
        <div className="spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-room error">
        <h2>⚠️ {t.error}</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => router.push('/')}>
          {t.backToLobby}
        </button>
      </div>
    );
  }

  return (
    <div className="lobby">
      <div className="lobby-container">
        <header className="lobby-header">
          <h1>{t.selectGameTitle}</h1>
          <p className="subtitle">{t.selectGameSubtitle}</p>
        </header>

        {/* PLAYABLE 게임 섹션 */}
        {playableGames.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#10b981' }}>
              {t.playableGamesTitle}
            </h2>
            <div className="game-selection">
              {playableGames.map((game) => (
                <button
                  key={game.id}
                  className="game-card"
                  onClick={() => handleGameSelect(game.id)}
                >
                  <div className="game-icon">{game.icon}</div>
                  <h3 className="game-title">{t[game.id as keyof typeof t]}</h3>
                  <p className="game-description">{t[game.descriptionKey as keyof typeof t]}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* INFO_ONLY 게임 섹션 */}
        {infoGames.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#94a3b8' }}>
              {t.infoGamesTitle}
            </h2>
            <div className="game-selection">
              {infoGames.map((game) => (
                <button
                  key={game.id}
                  className="game-card"
                  style={{ opacity: 0.8, border: '2px dashed #475569' }}
                  onClick={() => handleGameSelect(game.id)}
                >
                  <div className="game-icon">{game.icon}</div>
                  <h3 className="game-title">{t[game.id as keyof typeof t]}</h3>
                  <p className="game-description">{t[game.descriptionKey as keyof typeof t]}</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                    📖 {language === 'ko' ? '규칙 보기' : 'View Rules'}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        <button
          className="btn btn-ghost"
          onClick={() => router.push('/')}
        >
          {t.backToLobby}
        </button>
      </div>
    </div>
  );
}
