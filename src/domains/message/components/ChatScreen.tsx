"use client";

import { BackButton } from '@/shared/components/BackButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import { Flag, LogOut, MoreVertical, Send } from 'lucide-react';
import { useState } from 'react';

interface ChatScreenProps {
  userId: string;
  userName: string;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

export function ChatScreen({ userName, onBack }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 모임 참여하고 싶어요 😊',
      sender: 'me',
      timestamp: '오후 2:30',
    },
    {
      id: '2',
      text: '안녕하세요! 환영합니다. 참가 신청 버튼을 눌러주세요!',
      sender: 'other',
      timestamp: '오후 2:32',
    },
    {
      id: '3',
      text: '장소가 정확히 어디인가요?',
      sender: 'me',
      timestamp: '오후 2:35',
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleLeaveChat = () => {
    console.log('Leaving chat with:', userName);
    setShowLeaveDialog(false);
    onBack();
  };

  const handleReportUser = () => {
    console.log('Reporting user:', userName);
    setShowReportDialog(false);
    // Here you would typically send a report to your backend
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-background via-background to-transparent backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <BackButton onClick={onBack} className="bg-card" />
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-semibold">{userName}</h2>
            <p className="text-xs text-muted-foreground">온라인</p>
          </div>
          
          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-secondary/80 transition-colors">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => setShowLeaveDialog(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span>채팅방 나가기</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowReportDialog(true)}
                className="cursor-pointer"
              >
                <Flag className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>신고하기</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender === 'me'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <Input
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="h-10 w-10 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Leave Chat Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>채팅방을 나가시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 대화방을 나가면 대화 내용이 삭제되며, 메시지 목록에서 사라집니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLeaveChat}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report User Confirmation Dialog */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>사용자를 신고하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              {userName}님을 부적절한 행동으로 신고합니다. 신고 내용은 관리자가 검토하며, 필요시 조치가 취해집니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReportUser}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              신고하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
