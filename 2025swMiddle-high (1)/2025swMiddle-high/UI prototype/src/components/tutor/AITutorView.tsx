import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { GraduationCap, Send, BookOpen, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface AITutorViewProps {
  user: User;
}

export function AITutorView({ user }: AITutorViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 저는 여러분의 학습을 도와주는 AI 학습봇입니다. 무엇을 도와드릴까요?',
      timestamp: '오전 9:00',
      suggestions: [
        '효과적인 공부 방법 알려줘',
        '습관 만들기 팁',
        '시간 관리 방법',
        '동기 부여 방법',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: '1', title: '효과적인 학습 방법', date: '2024-11-03', messages: 12 },
    { id: '2', title: '습관 형성 전략', date: '2024-11-02', messages: 8 },
    { id: '3', title: '시간 관리 팁', date: '2024-11-01', messages: 15 },
  ]);

  const mockResponses: { [key: string]: string } = {
    '효과적인 공부 방법 알려줘': '효과적인 공부 방법을 소개해드릴게요:\n\n1. 포모도로 기법: 25분 집중 + 5분 휴식\n2. 능동적 학습: 단순히 읽기보다는 요약하고 설명하기\n3. 분산 학습: 한 번에 몰아서 하기보다 여러 날에 걸쳐 학습\n4. 인출 연습: 배운 내용을 기억에서 끄집어내는 연습\n\n어떤 방법이 가장 관심이 가시나요?',
    '습관 만들기 팁': '새로운 습관을 만들기 위한 팁입니다:\n\n1. 작게 시작하기: 2분 규칙 활용 (처음엔 2분만 하기)\n2. 트리거 설정: 기존 습관에 새 습관 연결하기\n3. 환경 디자인: 습관을 실천하기 쉽게 환경 조성\n4. 진행 상황 추적: 매일 체크하며 동기 부여\n\n어떤 습관을 만들고 싶으신가요?',
    '시간 관리 방법': '효과적인 시간 관리 방법:\n\n1. 우선순위 매트릭스: 중요하고 긴급한 일부터 처리\n2. 시간 블록킹: 특정 시간대를 특정 작업에 할당\n3. 멀티태스킹 피하기: 한 번에 하나씩 집중\n4. 버퍼 타임: 예상 시간보다 20% 더 여유 있게\n\n가장 어려운 부분이 무엇인가요?',
    '동기 부여 방법': '동기 부여를 유지하는 방법:\n\n1. 명확한 목표 설정: SMART 목표 활용\n2. 작은 성공 축하하기: 매일의 진전 인정\n3. 시각화: 성공한 모습 상상하기\n4. 책임감 파트너: 친구와 함께 목표 공유\n\n어떤 부분에서 동기가 떨어지시나요?',
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = mockResponses[input] || '좋은 질문이네요! 이 주제에 대해 더 구체적으로 말씀해주시면 더 자세히 도와드릴 수 있어요.';
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        suggestions: ['더 자세히 알려줘', '다른 방법도 있어?', '실천 방법은?'],
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const loadChatHistory = (historyId: string) => {
    // In a real app, this would load the actual chat history
    alert(`대화 기록 "${chatHistory.find(h => h.id === historyId)?.title}" 불러오기`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8" />
          AI 학습봇
        </h1>
        <p className="text-gray-600">학습과 자기계발에 대해 질문하세요</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              대화 기록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chatHistory.map(history => (
                <div
                  key={history.id}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => loadChatHistory(history.id)}
                >
                  <p className="text-sm mb-1">{history.title}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{history.date}</span>
                    <Badge variant="outline">{history.messages}개</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Chat */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              학습 상담
            </CardTitle>
            <CardDescription>
              무엇이든 물어보세요. AI가 도와드립니다!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScrollArea className="h-96 pr-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {message.role === 'user' ? user.displayName[0] : 'AI'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`px-4 py-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100'
                            }`}
                          >
                            <p className="whitespace-pre-line">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.role === 'user'
                                  ? 'text-purple-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="질문을 입력하세요..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Topics */}
      <Card>
        <CardHeader>
          <CardTitle>추천 주제</CardTitle>
          <CardDescription>인기 있는 학습 주제들입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: '포모도로 기법', icon: '⏱️' },
              { title: '노트 필기법', icon: '📝' },
              { title: '집중력 향상', icon: '🎯' },
              { title: '아침 루틴', icon: '🌅' },
              { title: '독서 습관', icon: '📚' },
              { title: '운동 동기부여', icon: '💪' },
              { title: '명상 시작하기', icon: '🧘' },
              { title: '목표 설정법', icon: '🎪' },
            ].map((topic, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border text-center cursor-pointer hover:bg-purple-50 transition-colors"
                onClick={() => setInput(`${topic.title}에 대해 알려줘`)}
              >
                <div className="text-2xl mb-2">{topic.icon}</div>
                <p className="text-sm">{topic.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
