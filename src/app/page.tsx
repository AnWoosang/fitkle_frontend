'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { GameType } from '@/types/game';
import type { Database } from '@/types/database';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
];

export default function Home() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async () => {
    if (!nickname.trim()) {
      setError(t.enterNickname);
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const playerId = uuidv4();
      const code = generateRoomCode();

      const roomData: Database['public']['Tables']['rooms']['Insert'] = {
        code,
        host_id: playerId,
        game_type: GameType.NUNCHI as string,
        status: 'waiting',
        max_players: 10,
        current_number: 0,
        is_deleted: false,
      };

      // @ts-ignore
      const { data: room, error: roomError } = await supabase
        // @ts-ignore
        .from('rooms')
        // @ts-ignore
        .insert(roomData)
        .select()
        .single();

      if (roomError) throw roomError;

      // @ts-ignore
      const { error: playerError } = await supabase.from('players').insert({
        // @ts-ignore
        room_id: room?.id,
        id: playerId,
        nickname: nickname.trim(),
        is_alive: true,
        is_ready: false,
        score: 0,
      });

      if (playerError) throw playerError;

      sessionStorage.setItem('playerId', playerId);
      sessionStorage.setItem('playerName', nickname.trim());

      router.push(`/room/${code}/select-game`);
    } catch (err) {
      console.error('방 생성 실패:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      if (err && typeof err === 'object') {
        console.error('Error message:', (err as any).message);
        console.error('Error code:', (err as any).code);
        console.error('Error details:', (err as any).details);
      }
      setError(t.roomCreateFailed);
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      setError(t.enterRoomCode);
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const code = roomCode.trim().toUpperCase();

      // @ts-ignore
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single();

      if (roomError || !room) {
        setError(t.roomNotFound);
        return;
      }

      if (room?.status === 'playing' || room?.status === 'finished') {
        setError(t.gameInProgress);
        return;
      }

      // playerId만 생성하고 저장 (닉네임은 GameRoom에서 입력)
      const playerId = uuidv4();
      console.log('🎯 참가하기 - playerId 생성:', playerId);

      sessionStorage.setItem('playerId', playerId);
      console.log('🎯 참가하기 - playerId 저장 완료');

      sessionStorage.removeItem('playerName'); // 닉네임 초기화
      console.log('🎯 참가하기 - playerName 제거 완료');

      console.log('🎯 참가하기 - sessionStorage 상태:', {
        playerId: sessionStorage.getItem('playerId'),
        playerName: sessionStorage.getItem('playerName')
      });

      console.log('🎯 참가하기 - 방으로 이동:', `/room/${code}`);
      router.push(`/room/${code}`);
    } catch (err) {
      console.error('방 참가 실패:', err);
      setError(t.roomJoinFailed);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="lobby">
      <div className="lobby-container">
        <header className="lobby-header">
          <div className="logo-section">
            <img src="/logo.png" alt="FITKLE" className="logo-image" />
            <h1 className="brand-title">FITKLE</h1>
          </div>
          <p className="subtitle">{t.lobbySubtitle}</p>
        </header>

        {/* Language Selector */}
        <div className="language-selector-lobby">
          <label>{t.language}</label>
          <div className="language-buttons">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                className={`language-button ${language === option.value ? 'active' : ''}`}
                onClick={() => setLanguage(option.value)}
              >
                <span className="flag">{option.flag}</span>
                <span className="label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Actions */}
        <div className="lobby-actions">
          {/* Create Room */}
          <div className="action-card">
            <h3>{t.createRoom}</h3>
            <div className="input-group">
              <label>{t.nickname}</label>
              <input
                type="text"
                className="input"
                placeholder={t.nicknamePlaceholder}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
              />
            </div>
            <button
              className="btn btn-primary btn-large"
              onClick={createRoom}
              disabled={isCreating || !nickname.trim()}
            >
              {isCreating ? t.creating : t.createRoomButton}
            </button>
          </div>

          <div className="divider">{t.or}</div>

          {/* Join Room */}
          <div className="action-card">
            <h3>{t.joinRoom}</h3>
            <input
              type="text"
              className="input"
              placeholder={t.roomCodePlaceholder}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button
              className="btn btn-primary btn-large"
              onClick={joinRoom}
              disabled={isJoining}
            >
              {isJoining ? t.joining : t.joinRoomButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
