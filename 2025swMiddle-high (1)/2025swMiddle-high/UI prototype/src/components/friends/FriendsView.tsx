import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FriendsList } from './FriendsList';
import { FriendSearch } from './FriendSearch';
import { FriendRequests } from './FriendRequests';
import { BlockedUsers } from './BlockedUsers';
import { Users } from 'lucide-react';

interface FriendsViewProps {
  user: User;
}

export function FriendsView({ user }: FriendsViewProps) {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <Users className="w-8 h-8" />
          친구
        </h1>
        <p className="text-gray-600">친구들과 함께 성장하세요</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">친구 목록</TabsTrigger>
          <TabsTrigger value="search">친구 찾기</TabsTrigger>
          <TabsTrigger value="requests">
            요청
            {pendingRequestsCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="blocked">차단</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <FriendsList user={user} />
        </TabsContent>

        <TabsContent value="search">
          <FriendSearch user={user} />
        </TabsContent>

        <TabsContent value="requests">
          <FriendRequests
            user={user}
            onRequestCountChange={setPendingRequestsCount}
          />
        </TabsContent>

        <TabsContent value="blocked">
          <BlockedUsers user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
