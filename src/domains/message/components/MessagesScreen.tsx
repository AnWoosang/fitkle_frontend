import { useState } from 'react';
import { MessageCircle, Search, ChevronRight, Send, MoreVertical, LogOut, Flag } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { AppLogo } from '@/shared/components/AppLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
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

interface Message {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

interface MessagesScreenProps {
  onChatClick: (userId: string, userName: string) => void;
}

export function MessagesScreen({ onChatClick }: MessagesScreenProps) {
  const [selectedChat, setSelectedChat] = useState<Message | null>(null);
  const [message, setMessage] = useState('');
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
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

  // Mock messages data
  const messages: Message[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Jiyoung Park 🇰🇷',
      userInitials: 'JP',
      lastMessage: '다음 주 치맥 모임 참석하시나요?',
      timestamp: '2분 전',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Chen 🇨🇳',
      userInitials: 'MC',
      lastMessage: 'Thanks for joining the hiking group!',
      timestamp: '1시간 전',
      unread: 0,
      online: true,
    },
    {
      id: '3',
      userId: '3',
      userName: 'Sarah Johnson 🇺🇸',
      userInitials: 'SJ',
      lastMessage: '클라이밍 모임이 언제인가요?',
      timestamp: '어제',
      unread: 1,
      online: false,
    },
    {
      id: '4',
      userId: '4',
      userName: 'Yuki Tanaka 🇯🇵',
      userInitials: 'YT',
      lastMessage: 'See you at the language exchange!',
      timestamp: '2일 전',
      unread: 0,
      online: false,
    },
  ];

  const handleChatClick = (message: Message) => {
    // Mobile: navigate to separate chat screen
    if (window.innerWidth < 1024) {
      onChatClick(message.userId, message.userName);
    } else {
      // Desktop: show chat in right panel
      setSelectedChat(message);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
  };

  const handleLeaveChat = () => {
    console.log('Leaving chat with:', selectedChat?.userName);
    setShowLeaveDialog(false);
    setSelectedChat(null);
  };

  const handleReportUser = () => {
    console.log('Reporting user:', selectedChat?.userName);
    setShowReportDialog(false);
    // Here you would typically send a report to your backend
  };

  return (
    <div className="h-full bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Mobile Header with Logo */}
        <div className="px-4 pt-4 pb-2">
          <AppLogo />
        </div>
        
        <div className="px-4 py-4 bg-background border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="메시지 검색"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:bg-background focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleChatClick(msg)}
                  className="w-full bg-card hover:bg-accent/50 border border-border/50 rounded-2xl p-4 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-background">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {msg.userInitials}
                        </AvatarFallback>
                      </Avatar>
                      {msg.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="truncate">{msg.userName}</h3>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {msg.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${msg.unread > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {msg.lastMessage}
                        </p>
                        {msg.unread > 0 && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center ml-2 shrink-0">
                            <span className="text-[10px] text-primary-foreground">
                              {msg.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">메시지가 없습니다</p>
              <p className="text-sm text-muted-foreground">대화를 시작해보세요</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Split View */}
      <div className="hidden lg:flex h-full">
        {/* Left: Messages List */}
        <div className="w-96 border-r border-border/50 flex flex-col bg-background">
          {/* Search Bar */}
          <div className="p-4 border-b border-border/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="메시지 검색"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/50 focus:bg-background focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm"
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleChatClick(msg)}
                className={`w-full px-4 py-3 transition-all text-left border-b border-border/30 ${
                  selectedChat?.id === msg.id
                    ? 'bg-primary/10 border-l-4 border-l-primary'
                    : 'hover:bg-accent/50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-background">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {msg.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    {msg.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-sm truncate">{msg.userName}</h3>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {msg.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate ${msg.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {msg.lastMessage}
                      </p>
                      {msg.unread > 0 && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center ml-2 shrink-0">
                          <span className="text-[10px] text-primary-foreground font-medium">
                            {msg.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-border/30 bg-card">
                <div className="flex items-center gap-3">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedChat.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-base">{selectedChat.userName}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.online ? '온라인' : '오프라인'}
                    </p>
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

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        msg.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white border border-border/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border/30 bg-card">
                <div className="flex items-center gap-3 max-w-4xl mx-auto">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 rounded-xl"
                  />
                  <Button onClick={handleSend} size="icon" className="h-10 w-10 shrink-0 rounded-xl">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-12 h-12 text-primary" />
                </div>
                <h3 className="mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a message from the list to start chatting
                </p>
              </div>
            </div>
          )}
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
              {selectedChat?.userName}님을 부적절한 행동으로 신고합니다. 신고 내용은 관리자가 검토하며, 필요시 조치가 취해집니다.
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
