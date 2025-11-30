import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Ban } from 'lucide-react';

interface BlockedUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  blockedAt: string;
}

interface BlockedUsersProps {
  user: User;
}

export function BlockedUsers({ user }: BlockedUsersProps) {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: '11',
      username: 'spammer123',
      displayName: '스패머',
      blockedAt: '2024-10-15',
    },
  ]);

  const handleUnblock = (userId: string) => {
    if (confirm('이 사용자를 차단 해제하시겠습니까?')) {
      setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>차단한 사용자</CardTitle>
      </CardHeader>
      <CardContent>
        {blockedUsers.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            차단한 사용자가 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {blockedUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-red-50/50"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p>{user.displayName}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <p className="text-xs text-gray-500">
                    차단일: {user.blockedAt}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUnblock(user.id)}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  차단 해제
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
