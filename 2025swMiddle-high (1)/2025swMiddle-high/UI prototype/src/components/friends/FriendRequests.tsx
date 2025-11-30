import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Check, X } from 'lucide-react';

interface FriendRequest {
  id: string;
  fromUserId: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  bio: string;
  createdAt: string;
}

interface FriendRequestsProps {
  user: User;
  onRequestCountChange: (count: number) => void;
}

export function FriendRequests({ user, onRequestCountChange }: FriendRequestsProps) {
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      fromUserId: '8',
      username: 'morning_person',
      displayName: '아침사람',
      level: 5,
      bio: '새벽 5시 기상 도전 중',
      createdAt: '2시간 전',
    },
    {
      id: '2',
      fromUserId: '9',
      username: 'language_learner',
      displayName: '언어학습자',
      level: 7,
      bio: '3개 국어 마스터하기',
      createdAt: '1일 전',
    },
  ]);

  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([
    {
      id: '3',
      fromUserId: '10',
      username: 'yoga_master',
      displayName: '요가마스터',
      level: 8,
      bio: '매일 요가와 명상',
      createdAt: '3일 전',
    },
  ]);

  useEffect(() => {
    onRequestCountChange(receivedRequests.length);
  }, [receivedRequests, onRequestCountChange]);

  const handleAccept = (requestId: string) => {
    setReceivedRequests(receivedRequests.filter(r => r.id !== requestId));
    alert('친구 요청을 수락했습니다!');
  };

  const handleReject = (requestId: string) => {
    setReceivedRequests(receivedRequests.filter(r => r.id !== requestId));
  };

  const handleCancelRequest = (requestId: string) => {
    setSentRequests(sentRequests.filter(r => r.id !== requestId));
  };

  return (
    <Tabs defaultValue="received">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="received">
          받은 요청
          {receivedRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {receivedRequests.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="sent">보낸 요청</TabsTrigger>
      </TabsList>

      <TabsContent value="received">
        <Card>
          <CardHeader>
            <CardTitle>받은 친구 요청</CardTitle>
          </CardHeader>
          <CardContent>
            {receivedRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                받은 친구 요청이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {receivedRequests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-blue-50/50"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback>{request.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p>{request.displayName}</p>
                        <Badge variant="outline">Lv.{request.level}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">@{request.username}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {request.bio}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {request.createdAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        수락
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        거절
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sent">
        <Card>
          <CardHeader>
            <CardTitle>보낸 친구 요청</CardTitle>
          </CardHeader>
          <CardContent>
            {sentRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                보낸 친구 요청이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {sentRequests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback>{request.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p>{request.displayName}</p>
                        <Badge variant="outline">Lv.{request.level}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">@{request.username}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {request.bio}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {request.createdAt}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelRequest(request.id)}
                    >
                      요청 취소
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
