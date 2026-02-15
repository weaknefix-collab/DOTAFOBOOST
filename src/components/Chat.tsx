import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, User, ChevronLeft } from 'lucide-react';

const Chat = () => {
  const {
    isChatModalOpen,
    setChatModalOpen,
    user,
    chats,
    messages,
    activeChat,
    setActiveChat,
    sendMessage,
    getUserChats,
    getChatMessages,
    markChatAsRead,
  } = useStore();

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userChats = user ? getUserChats(user.id) : [];
  const currentMessages = activeChat ? getChatMessages(activeChat) : [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]);

  useEffect(() => {
    if (activeChat) {
      markChatAsRead(activeChat);
    }
  }, [activeChat, messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChat) return;
    sendMessage(activeChat, messageText);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getChatPartner = (chat: typeof userChats[0]) => {
    if (!user) return null;
    const partnerIndex = chat.participants.findIndex(id => id !== user.id);
    return {
      name: chat.participantNames[partnerIndex],
      avatar: chat.participantAvatars[partnerIndex],
    };
  };

  const getActiveChatPartner = () => {
    if (!activeChat || !user) return null;
    const chat = chats.find(c => c.id === activeChat);
    if (!chat) return null;
    return getChatPartner(chat);
  };

  return (
    <Dialog open={isChatModalOpen} onOpenChange={setChatModalOpen}>
      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl h-[80vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Chat List */}
          {!activeChat && (
            <div className="w-full flex flex-col">
              <DialogHeader className="p-4 border-b border-white/10">
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Сообщения
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="flex-1">
                {userChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>У вас пока нет сообщений</p>
                    <p className="text-sm mt-2">Начните общение с бустером</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {userChats.map((chat) => {
                      const partner = getChatPartner(chat);
                      if (!partner) return null;

                      return (
                        <button
                          key={chat.id}
                          onClick={() => setActiveChat(chat.id)}
                          className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                        >
                          {partner.avatar ? (
                            <img
                              src={partner.avatar}
                              alt={partner.name}
                              className="w-12 h-12 rounded-full border border-white/10"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">
                              {partner.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {chat.lastMessage || 'Нет сообщений'}
                            </div>
                          </div>
                          {chat.unreadCount > 0 && (
                            <div className="w-5 h-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-semibold">
                              {chat.unreadCount}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Active Chat */}
          {activeChat && (
            <div className="w-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveChat(null)}
                  className="text-white hover:bg-white/10 -ml-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                Назад
                </Button>
                {(() => {
                  const partner = getActiveChatPartner();
                  if (!partner) return null;
                  return (
                    <>
                      {partner.avatar ? (
                        <img
                          src={partner.avatar}
                          alt={partner.name}
                          className="w-10 h-10 rounded-full border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <span className="font-semibold text-white">{partner.name}</span>
                    </>
                  );
                })()}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Начните общение</p>
                    </div>
                  ) : (
                    currentMessages.map((msg) => {
                      const isOwn = msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                              isOwn
                                ? 'bg-white text-black rounded-br-md'
                                : 'bg-white/10 text-white rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <span
                              className={`text-xs mt-1 block ${
                                isOwn ? 'text-black/50' : 'text-gray-500'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите сообщение..."
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Chat;
