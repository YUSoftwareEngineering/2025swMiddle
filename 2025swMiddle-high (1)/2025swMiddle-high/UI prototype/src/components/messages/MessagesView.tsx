import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { MessageCircle, Send, Mail } from 'lucide-react';

interface Message {
  id: string;
  fromUserId: string;
  fromName: string;
  fromAvatar?: string;
  toUserId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessagesViewProps {
  user: User;
}

export function MessagesView({ user }: MessagesViewProps) {
  const [conversations, setConversations] = useState([
    { id: '2', name: '공부마스터', avatar: undefined, lastMessage: '화이팅!', unread: 2 },
    { id: '3', name: '건강한삶', avatar: undefined, lastMessage: '오늘 운동 어땠어?', unread: 0 },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>('2');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      fromUserId: '2',
      fromName: '공부마스터',
      toUserId: user.id,
      content: '안녕하세요! 같이 공부해요',
      timestamp: '오전 10:30',
      read: true,
    },
    {
      id: '2',
      fromUserId: user.id,
      fromName: user.displayName,
      toUserId: '2',
      content: '네 좋아요! 함께 열심히 해봐요',
      timestamp: '오전 10:32',
      read: true,
    },
    {
      id: '3',
      fromUserId: '2',
      fromName: '공부마스터',
      toUserId: user.id,
      content: '화이팅!',
      timestamp: '오전 10:35',
      read: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [newPostcard, setNewPostcard] = useState({ recipient: '', message: '' });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: Date.now().toString(),
        fromUserId: user.id,
        fromName: user.displayName,
        toUserId: selectedConversation,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        read: false,
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleSendPostcard = () => {
    if (newPostcard.recipient && newPostcard.message) {
      alert(`${newPostcard.recipient}님께 엽서를 보냈습니다!`);
      setNewPostcard({ recipient: '', message: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <MessageCircle className="w-8 h-8" />
          메시지
        </h1>
        <p className="text-gray-600">친구들과 소통하세요</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle>대화 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conv.id
                      ? 'bg-teal-100'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedConversation(conv.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={conv.avatar} />
                      <AvatarFallback>{conv.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p>{conv.name}</p>
                        {conv.unread > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedConversation
                ? conversations.find(c => c.id === selectedConversation)?.name
                : '대화를 선택하세요'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <div className="space-y-4">
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-4">
                    {messages
                      .filter(
                        m =>
                          (m.fromUserId === user.id &&
                            m.toUserId === selectedConversation) ||
                          (m.fromUserId === selectedConversation &&
                            m.toUserId === user.id)
                      )
                      .map(message => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.fromUserId === user.id
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.fromUserId === user.id
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-100'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.fromUserId === user.id
                                  ? 'text-teal-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">
                대화를 선택하세요
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Postcard Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            엽서 보내기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">받는 사람</label>
            <Input
              placeholder="친구 이름을 입력하세요"
              value={newPostcard.recipient}
              onChange={e =>
                setNewPostcard({ ...newPostcard, recipient: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">메시지</label>
            <Textarea
              placeholder="따뜻한 메시지를 전해보세요..."
              rows={4}
              value={newPostcard.message}
              onChange={e =>
                setNewPostcard({ ...newPostcard, message: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSendPostcard} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            엽서 보내기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
