import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Search, UserPlus } from 'lucide-react';

interface SearchResult {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  bio: string;
  isFriend: boolean;
  requestSent: boolean;
}

interface FriendSearchProps {
  user: User;
}

export function FriendSearch({ user }: FriendSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const mockResults: SearchResult[] = [
    {
      id: '5',
      username: 'coding_ninja',
      displayName: '코딩닌자',
      level: 7,
      bio: '프로그래밍과 자기계발',
      isFriend: false,
      requestSent: false,
    },
    {
      id: '6',
      username: 'early_bird',
      displayName: '얼리버드',
      level: 9,
      bio: '아침형 인간 되기 프로젝트',
      isFriend: false,
      requestSent: false,
    },
    {
      id: '7',
      username: 'fitness_king',
      displayName: '피트니스킹',
      level: 12,
      bio: '운동은 최고의 자기계발',
      isFriend: false,
      requestSent: false,
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchResults(mockResults);
      setHasSearched(true);
    }
  };

  const handleSendRequest = (userId: string) => {
    setSearchResults(
      searchResults.map(r =>
        r.id === userId ? { ...r, requestSent: true } : r
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>친구 찾기</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="사용자명 또는 닉네임 검색"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            검색
          </Button>
        </div>

        {hasSearched && (
          <div className="space-y-3">
            {searchResults.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                검색 결과가 없습니다.
              </p>
            ) : (
              searchResults.map(result => (
                <div
                  key={result.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={result.avatar} />
                    <AvatarFallback>{result.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p>{result.displayName}</p>
                      <Badge variant="outline">Lv.{result.level}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">@{result.username}</p>
                    <p className="text-sm text-gray-600 truncate">{result.bio}</p>
                  </div>
                  <div>
                    {result.isFriend ? (
                      <Badge>친구</Badge>
                    ) : result.requestSent ? (
                      <Badge variant="outline">요청됨</Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(result.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        친구 요청
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
