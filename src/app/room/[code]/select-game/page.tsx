'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { GameType, GAME_REGISTRY } from '@/types/game';

interface GameCard {
  id: GameType;
  icon: string;
  descriptionKey: keyof ReturnType<typeof useTranslation>;
}

export default function SelectGamePage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const code = params?.code as string;
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게임 레지스트리에서 자동으로 게임 목록 생성
  const getDescriptionKey = (gameType: GameType): keyof ReturnType<typeof useTranslation> => {
    switch (gameType) {
      case GameType.NUNCHI:
        return 'nunchiGameDescription';
      case GameType.THREE_SIX_NINE:
        return 'threeSixNineGameDescription';
      case GameType.TWO_TRUTHS:
        return 'twoTruthsGameDescription';
      case GameType.BASKIN_ROBBINS_31:
        return 'baskinRobbins31GameDescription';
      default:
        return 'nunchiGameDescription';
    }
  };

  const games: GameCard[] = Object.values(GAME_REGISTRY).map((game) => ({
    id: game.id,
    icon: game.icon,
    descriptionKey: getDescriptionKey(game.id),
  }));

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
      // DB에 게임 타입 저장
      await supabase
        .from('rooms')
        .update({ game_type: gameType })
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

        <div className="game-selection">
          {games.map((game) => (
            <button
              key={game.id}
              className="game-card"
              onClick={() => handleGameSelect(game.id)}
            >
              <div className="game-icon">{game.icon}</div>
              <h3 className="game-title">{t[game.id]}</h3>
              <p className="game-description">{t[game.descriptionKey]}</p>
            </button>
          ))}
        </div>

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
