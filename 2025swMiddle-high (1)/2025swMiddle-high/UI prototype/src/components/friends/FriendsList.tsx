import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { MessageCircle, UserMinus, Eye, Ban } from 'lucide-react';

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  bio: string;
  status: 'online' | 'offline' | 'away';
}

interface FriendsListProps {
  user: User;
}

export function FriendsList({ user }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '2',
      username: 'study_master',
      displayName: '공부마스터',
      level: 8,
      bio: '매일 아침 6시 기상!',
      status: 'online',
    },
    {
      id: '3',
      username: 'healthy_life',
      displayName: '건강한삶',
      level: 6,
      bio: '운동과 명상을 사랑합니다',
      status: 'offline',
    },
    {
      id: '4',
      username: 'book_lover',
      displayName: '책벌레',
      level: 10,
      bio: '독서광입니다 📚',
      status: 'online',
    },
  ]);

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const handleRemoveFriend = (friendId: string) => {
    if (confirm('정말 친구를 삭제하시겠습니까?')) {
      setFriends(friends.filter(f => f.id !== friendId));
    }
  };

  const handleBlockUser = (friendId: string) => {
    if (confirm('이 사용자를 차단하시겠습니까?')) {
      setFriends(friends.filter(f => f.id !== friendId));
      alert('사용자가 차단되었습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>내 친구 ({friends.length}명)</CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              아직 친구가 없습니다. 친구를 찾아보세요!
            </p>
          ) : (
            <div className="space-y-3">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        friend.status
                      )}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p>{friend.displayName}</p>
                      <Badge variant="outline">Lv.{friend.level}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">@{friend.username}</p>
                    <p className="text-sm text-gray-600 truncate">{friend.bio}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setSelectedFriend(friend)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>프로필</DialogTitle>
                        </DialogHeader>
                        {selectedFriend && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={selectedFriend.avatar} />
                                <AvatarFallback>
                                  {selectedFriend.displayName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-lg">{selectedFriend.displayName}</p>
                                <p className="text-sm text-gray-500">
                                  @{selectedFriend.username}
                                </p>
                                <Badge>Lv.{selectedFriend.level}</Badge>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                {selectedFriend.bio}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button size="icon" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleBlockUser(friend.id)}
                    >
                      <Ban className="w-4 h-4 text-orange-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      <UserMinus className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
