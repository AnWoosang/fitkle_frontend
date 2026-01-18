'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { GameType, GAME_REGISTRY } from '@/types/game';
import type { Room } from '@/types/game';
import { QRCodeSVG } from 'qrcode.react';

export default function GameRulesPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const code = params?.code as string;

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wantChangeGame, setWantChangeGame] = useState<string[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [hasRequestedChange, setHasRequestedChange] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem('playerId');
    if (!id) {
      router.push('/');
      return;
    }
    setPlayerId(id);

    const loadRoomData = async () => {
      try {
        // 방 정보 조회
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('code', code)
          .single();

        if (roomError || !roomData) {
          setError(t.roomNotFound);
          return;
        }

        const roomTyped = roomData as Room;
        setRoom(roomTyped);
        setIsHost(roomTyped.host_id === id);
        setWantChangeGame(roomTyped.want_change_game || []);

        // 플레이어 수 조회
        const { count } = await supabase
          .from('players')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', roomTyped.id);

        setTotalPlayers(count || 0);
        setHasRequestedChange((roomTyped.want_change_game || []).includes(id));
      } catch (err) {
        console.error('방 정보 로드 실패:', err);
        setError(t.error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomData();
  }, [code, router, t]);

  // Realtime 구독 - 방 정보 변경 감지
  useEffect(() => {
    if (!room) return;

    const subscription = supabase
      .channel(`room_rules:${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          const newRoom = payload.new as Room;
          setRoom(newRoom);
          setWantChangeGame(newRoom.want_change_game || []);

          // 호스트가 게임 선택으로 돌아간 경우
          if (newRoom.status === 'game_selection') {
            // 호스트만 게임 선택 페이지로, 플레이어는 대기실로
            if (isHost) {
              router.push(`/room/${code}/select-game`);
            } else {
              router.push(`/room/${code}`);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_id=eq.${room.id}`,
        },
        async () => {
          // 플레이어 변경 시 카운트 새로고침
          const { count } = await supabase
            .from('players')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);
          setTotalPlayers(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [room?.id, code, router]);

  const handleRequestChangeGame = async () => {
    if (!room || !playerId || hasRequestedChange) return;

    const updatedList = [...(room.want_change_game || []), playerId];

    await supabase
      .from('rooms')
      // @ts-ignore
      .update({ want_change_game: updatedList })
      .eq('id', room.id);

    setHasRequestedChange(true);
  };

  const handleBackToSelection = async () => {
    if (!room || !isHost) return;

    // 상태를 game_selection으로 변경하고 want_change_game 초기화
    await supabase
      .from('rooms')
      // @ts-ignore
      .update({
        status: 'game_selection',
        game_type: null as any,
        want_change_game: [],
      })
      .eq('id', room.id);

    router.push(`/room/${code}/select-game`);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(code);
    alert(t.codeCopied);
  };

  const renderRulesContent = () => {
    if (!room?.game_type) return null;

    switch (room.game_type) {
      case GameType.ZERO:
        const { ZeroRules } = require('@/games/zero/ZeroRules');
        return <ZeroRules minPlayers={2} maxPlayers={10} language={language} />;
      default:
        return <p>{t.error}</p>;
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

  if (error || !room) {
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

  const allPlayersWantChange = wantChangeGame.length === totalPlayers;

  return (
    <div className="lobby">
      <div className="lobby-container">
        <header className="lobby-header">
          <h1>{room.game_type && t[room.game_type]}</h1>
          <p className="subtitle">{t.gameRulesSubtitle || '게임 규칙'}</p>
        </header>

        {/* 방 코드 및 QR 코드 섹션 */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div className="room-code-section" style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>
              {t.roomCode}
            </p>
            <div
              onClick={copyRoomCode}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
              }}
            >
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em' }}>
                {code}
              </span>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                {t.clickToCopy}
              </p>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            onClick={() => setShowQR(!showQR)}
            style={{ fontSize: '0.9rem' }}
          >
            {showQR ? t.hideQRCode : t.showQRCode}
          </button>

          {showQR && (
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <QRCodeSVG
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/room/${code}`}
                  size={200}
                  level="M"
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                {t.scanToJoin}
              </p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '32px' }}>
          {renderRulesContent()}
        </div>

        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            {wantChangeGame.length} / {totalPlayers} {t.playersWantChange || '명이 다른 게임을 원합니다'}
          </p>
        </div>

        <div className="button-group" style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          {!isHost && (
            <button
              className={`btn ${hasRequestedChange ? 'btn-ghost' : 'btn-secondary'}`}
              onClick={handleRequestChangeGame}
              disabled={hasRequestedChange}
            >
              {hasRequestedChange ? (t.requestedChangeGame || '✓ 변경 요청함') : (t.requestChangeGame || '다른 게임 하기')}
            </button>
          )}

          {isHost && (
            <button
              className="btn btn-primary"
              onClick={handleBackToSelection}
              disabled={!allPlayersWantChange}
              style={{
                opacity: allPlayersWantChange ? 1 : 0.5,
                cursor: allPlayersWantChange ? 'pointer' : 'not-allowed',
              }}
            >
              {allPlayersWantChange
                ? (t.backToGameSelection || '게임 선택으로 돌아가기')
                : (t.waitingForPlayers || '모든 플레이어가 변경을 원할 때까지 대기 중...')}
            </button>
          )}

          <button
            className="btn btn-ghost"
            onClick={() => router.push(`/room/${code}`)}
          >
            {t.backToRoom || '방으로 돌아가기'}
          </button>
        </div>
      </div>
    </div>
  );
}
