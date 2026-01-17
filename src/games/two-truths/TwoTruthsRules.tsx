'use client';

import { RulesContentProps } from '@/games/common/types';

export function TwoTruthsRules({ minPlayers, maxPlayers, language }: RulesContentProps) {

  const rules = {
    ko: {
      rules: [
        '최소 3명의 플레이어가 필요해요.',
        '게임 시작 전에 각자 자신에 대한 진실 2개와 거짓 1개를 작성합니다.',
        '플레이어가 입장한 순서대로 차례가 진행됩니다.',
        '자신의 차례가 되면 작성한 3개의 진술이 무작위로 섞여서 모두에게 공개됩니다.',
        '본인을 제외한 다른 플레이어들이 어떤 진술이 거짓인지 투표합니다.',
        '거짓말이 최다 득표를 받으면 진술자가 탈락합니다.',
        '마지막까지 남은 1명이 승리합니다!',
      ],
    },
    en: {
      rules: [
        'At least 3 players are needed.',
        'Before the game starts, each player writes 2 truths and 1 lie about themselves.',
        'Turns proceed in the order players joined.',
        'On your turn, your 3 statements are randomly shuffled and shown to everyone.',
        'All other players vote on which statement is the lie.',
        'If the lie gets the most votes, the statement author is eliminated.',
        'The last player standing wins!',
      ],
    },
    ja: {
      rules: [
        '最低3人のプレイヤーが必要です。',
        'ゲーム開始前に、各自が自分について真実2つと嘘1つを書きます。',
        'プレイヤーが入った順番でターンが進みます。',
        '自分のターンになると、書いた3つの発言がランダムに並び替えられてみんなに公開されます。',
        '本人以外の他のプレイヤーがどの発言が嘘かを投票します。',
        '嘘が最多得票を獲得すると、発言者が脱落します。',
        '最後まで残った1人が勝利します！',
      ],
    },
    zh: {
      rules: [
        '至少需要3名玩家。',
        '游戏开始前，每个玩家写下关于自己的2个真相和1个谎言。',
        '按照玩家进入的顺序进行回合。',
        '轮到你时，你写的3个陈述会随机打乱并向所有人展示。',
        '除本人外的其他玩家投票选出哪个陈述是谎言。',
        '如果谎言获得最多票数，陈述者被淘汰。',
        '坚持到最后的1人获胜！',
      ],
    },
    es: {
      rules: [
        'Se necesitan al menos 3 jugadores.',
        'Antes de comenzar el juego, cada jugador escribe 2 verdades y 1 mentira sobre sí mismo.',
        'Los turnos avanzan en el orden en que los jugadores se unieron.',
        'En tu turno, tus 3 declaraciones se mezclan aleatoriamente y se muestran a todos.',
        'Todos los demás jugadores votan sobre cuál declaración es la mentira.',
        'Si la mentira recibe más votos, el autor de la declaración es eliminado.',
        '¡El último jugador en pie gana!',
      ],
    },
  };

  const content = rules[language];

  return (
    <div className="rules-section">
      <h3 className="rules-title">📜 게임 규칙</h3>
      <ul className="rules-list">
        {content.rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </div>
  );
}
