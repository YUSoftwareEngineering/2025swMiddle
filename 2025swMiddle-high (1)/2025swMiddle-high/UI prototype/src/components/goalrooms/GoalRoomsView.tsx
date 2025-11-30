import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Plus, Users, Lock, Globe, LogOut, UserPlus, MessageCircle, Target, Search } from 'lucide-react';

interface GoalRoom {
  id: string;
  name: string;
  description: string;
  category: string;
  isPublic: boolean;
  memberCount: number;
  maxMembers: number;
  createdBy: string;
  joined: boolean;
  members?: Member[];
}

interface Member {
  id: string;
  displayName: string;
  avatar?: string;
  level: number;
}

interface GoalRoomsViewProps {
  user: User;
}

export function GoalRoomsView({ user }: GoalRoomsViewProps) {
  const [myRooms, setMyRooms] = useState<GoalRoom[]>([
    {
      id: '1',
      name: '아침 6시 기상 챌린지',
      description: '함께 아침형 인간 되기',
      category: '습관',
      isPublic: true,
      memberCount: 12,
      maxMembers: 20,
      createdBy: user.id,
      joined: true,
      members: [
        { id: '1', displayName: '자기계발왕', level: 5 },
        { id: '2', displayName: '공부마스터', level: 8 },
        { id: '3', displayName: '건강한삶', level: 6 },
      ],
    },
    {
      id: '2',
      name: '영어 회화 스터디',
      description: '매일 영어로 대화하기',
      category: '학습',
      isPublic: false,
      memberCount: 5,
      maxMembers: 10,
      createdBy: user.id,
      joined: true,
      members: [
        { id: '1', displayName: '자기계발왕', level: 5 },
        { id: '4', displayName: '책벌레', level: 10 },
      ],
    },
  ]);

  

  const [publicRooms, setPublicRooms] = useState<GoalRoom[]>([
    {
      id: '3',
      name: '운동 30분 챌린지',
      description: '매일 30분씩 운동하기',
      category: '건강',
      isPublic: true,
      memberCount: 25,
      maxMembers: 30,
      createdBy: 'other_user',
      joined: false,
    },
    {
      id: '4',
      name: '독서 모임',
      description: '한 달에 한 권 읽기',
      category: '취미',
      isPublic: true,
      memberCount: 15,
      maxMembers: 20,
      createdBy: 'other_user',
      joined: false,
    },
    {
      id: '5',
      name: '새벽 명상 챌린지',
      description: '매일 아침 명상으로 하루를 시작하기',
      category: '습관',
      isPublic: true,
      memberCount: 8,
      maxMembers: 15,
      createdBy: 'other_user',
      joined: false,
    },
    {
      id: '6',
      name: '코딩 테스트 준비',
      description: '알고리즘 문제 풀이 모임',
      category: '학습',
      isPublic: true,
      memberCount: 12,
      maxMembers: 20,
      createdBy: 'other_user',
      joined: false,
    },
    {
      id: '7',
      name: '물 2L 마시기',
      description: '하루 물 2리터 마시기 습관',
      category: '건강',
      isPublic: true,
      memberCount: 20,
      maxMembers: 30,
      createdBy: 'other_user',
      joined: false,
    },
    {
      id: '8',
      name: '그림 그리기 챌린지',
      description: '매일 30분 그림 그리기',
      category: '취미',
      isPublic: true,
      memberCount: 6,
      maxMembers: 10,
      createdBy: 'other_user',
      joined: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isPublic: true,
    maxMembers: 10,
  });

  const categories = ['습관', '학습', '건강', '취미', '업무', '기타'];

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: GoalRoom = {
      id: Date.now().toString(),
      ...formData,
      memberCount: 1,
      createdBy: user.id,
      joined: true,
    };
    setMyRooms([...myRooms, newRoom]);
    setFormData({
      name: '',
      description: '',
      category: '',
      isPublic: true,
      maxMembers: 10,
    });
    setIsCreateDialogOpen(false);
  };

  const handleJoinRoom = (roomId: string) => {
    setPublicRooms(
      publicRooms.map(room =>
        room.id === roomId
          ? { ...room, joined: true, memberCount: room.memberCount + 1 }
          : room
      )
    );
    const joinedRoom = publicRooms.find(r => r.id === roomId);
    if (joinedRoom) {
      setMyRooms([...myRooms, { ...joinedRoom, joined: true }]);
    }
  };

  const handleLeaveRoom = (roomId: string) => {
    if (confirm('정말 이 목표방을 나가시겠습니까?')) {
      setMyRooms(myRooms.filter(room => room.id !== roomId));
    }
  };

  // Filter public rooms based on search and category
  const filteredPublicRooms = publicRooms.filter(room => {
    if (room.joined) return false;
    
    const matchesSearch = searchQuery.trim() === '' || 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Target className="w-8 h-8" />
            목표방
          </h1>
          <p className="text-gray-600">함께 목표를 달성하세요</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              목표방 만들기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 목표방 만들기</DialogTitle>
              <DialogDescription>
                함께 목표를 달성할 팀을 만드세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="space-y-2">
                <Label>목표방 이름</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 아침 6시 기상 챌린지"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>설명</Label>
                <Textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="목표방에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>카테고리</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">선택하세요</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>최대 인원</Label>
                <Input
                  type="number"
                  min="2"
                  max="100"
                  value={formData.maxMembers}
                  onChange={e =>
                    setFormData({ ...formData, maxMembers: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={e =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                  공개 목표방 (누구나 참여 가능)
                </Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit">만들기</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="my">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my">내 목표방</TabsTrigger>
          <TabsTrigger value="public">공개 목표방</TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="space-y-4">
          {myRooms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                참여 중인 목표방이 없습니다. 새로운 목표방을 만들어보세요!
              </CardContent>
            </Card>
          ) : (
            myRooms.map(room => (
              <Card key={room.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{room.name}</CardTitle>
                        {room.isPublic ? (
                          <Globe className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <CardDescription>{room.description}</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <Badge>{room.category}</Badge>
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {room.memberCount}/{room.maxMembers}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLeaveRoom(room.id)}
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">멤버:</span>
                    <div className="flex -space-x-2">
                      {room.members?.slice(0, 5).map(member => (
                        <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.displayName[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {room.memberCount > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                          +{room.memberCount - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="public" className="space-y-4">
          {/* Search and Filter Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="목표방 이름이나 설명으로 검색..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    className={selectedCategory === 'all' ? 'bg-teal-500 hover:bg-teal-600' : ''}
                  >
                    전체
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(cat)}
                      className={selectedCategory === cat ? 'bg-teal-500 hover:bg-teal-600' : ''}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Results Count */}
                <p className="text-sm text-gray-600">
                  {filteredPublicRooms.length}개의 목표방을 찾았습니다
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Room List */}
          {filteredPublicRooms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                {searchQuery || selectedCategory !== 'all' 
                  ? '검색 결과가 없습니다. 다른 검색어를 시도해보세요.'
                  : '참여 가능한 공개 목표방이 없습니다.'
                }
              </CardContent>
            </Card>
          ) : (
            filteredPublicRooms.map(room => (
              <Card key={room.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>{room.description}</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-teal-100 text-teal-800 border-teal-300">
                          {room.category}
                        </Badge>
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {room.memberCount}/{room.maxMembers}
                        </Badge>
                        {room.memberCount >= room.maxMembers && (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                            정원 마감
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={room.memberCount >= room.maxMembers}
                      className={room.memberCount >= room.maxMembers ? '' : 'bg-teal-500 hover:bg-teal-600'}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {room.memberCount >= room.maxMembers ? '정원 마감' : '참여하기'}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
