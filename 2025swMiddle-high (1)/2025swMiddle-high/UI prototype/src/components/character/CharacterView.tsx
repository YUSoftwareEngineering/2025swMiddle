import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sparkles, Star, Trophy, Lock, Gift } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  exp: number;
  image: string;
  unlocked: boolean;
  description: string;
  skills: string[];
}

interface CharacterViewProps {
  user: User;
}

export function CharacterView({ user }: CharacterViewProps) {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: '코스모 새싹',
      rarity: 'common',
      level: 5,
      exp: 750,
      image: '👾',
      unlocked: true,
      description: '귀여운 외계 식물 생명체',
      skills: ['기본 동기부여', '꾸준함'],
    },
    {
      id: '2',
      name: '스타 펭귄',
      rarity: 'rare',
      level: 3,
      exp: 300,
      image: '🐧',
      unlocked: true,
      description: '우주에서 온 아침형 펭귄',
      skills: ['조기 기상', '아침 루틴'],
    },
    {
      id: '3',
      name: '갤럭시 올빼미',
      rarity: 'epic',
      level: 1,
      exp: 0,
      image: '🦉',
      unlocked: true,
      description: '지혜로운 우주 올빼미',
      skills: ['속독', '집중력 +20%'],
    },
    {
      id: '4',
      name: '네뷸라 토끼',
      rarity: 'rare',
      level: 0,
      exp: 0,
      image: '🐰',
      unlocked: false,
      description: '활기찬 우주 토끼',
      skills: ['체력 +30%', '회복력'],
    },
    {
      id: '5',
      name: '오로라 고양이',
      rarity: 'epic',
      level: 0,
      exp: 0,
      image: '🐱',
      unlocked: false,
      description: '고요한 우주 고양이',
      skills: ['스트레스 저항', '집중력 +40%'],
    },
    {
      id: '6',
      name: '코스믹 드래곤',
      rarity: 'legendary',
      level: 0,
      exp: 0,
      image: '🐲',
      unlocked: false,
      description: '우주를 수호하는 전설의 드래곤',
      skills: ['카리스마', '모든 능력 +50%', '멘토십'],
    },
    {
      id: '7',
      name: '문라이트 여우',
      rarity: 'epic',
      level: 0,
      exp: 0,
      image: '🦊',
      unlocked: false,
      description: '신비로운 달빛 여우',
      skills: ['영리함', '적응력 +35%'],
    },
    {
      id: '8',
      name: '스페이스 팬더',
      rarity: 'rare',
      level: 0,
      exp: 0,
      image: '🐼',
      unlocked: false,
      description: '느긋한 우주 팬더',
      skills: ['평온함', '인내심'],
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'rare':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'epic':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '일반';
      case 'rare':
        return '희귀';
      case 'epic':
        return '영웅';
      case 'legendary':
        return '전설';
      default:
        return rarity;
    }
  };

  const unlockedCharacters = characters.filter(c => c.unlocked);
  const lockedCharacters = characters.filter(c => !c.unlocked);

  const totalLevel = unlockedCharacters.reduce((sum, c) => sum + c.level, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <Sparkles className="w-8 h-8" />
          캐릭터 컬렉션
        </h1>
        <p className="text-gray-600">목표를 달성하고 캐릭터를 성장시키세요</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              총 레벨
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-2">{totalLevel}</div>
            <p className="text-xs text-gray-500">
              모든 캐릭터 레벨의 합
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4" />
              보유 캐릭터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-2">
              {unlockedCharacters.length}/{characters.length}
            </div>
            <Progress
              value={(unlockedCharacters.length / characters.length) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Gift className="w-4 h-4" />
              다음 보상
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-2">250 XP</div>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">65% 진행</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="unlocked">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unlocked">보유 캐릭터</TabsTrigger>
          <TabsTrigger value="locked">잠긴 캐릭터</TabsTrigger>
        </TabsList>

        <TabsContent value="unlocked" className="space-y-4">
          {unlockedCharacters.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                아직 보유한 캐릭터가 없습니다.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {unlockedCharacters.map(character => (
                <Card key={character.id} className="overflow-hidden">
                  <CardHeader className={`${getRarityColor(character.rarity)} border-b-2`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{character.name}</CardTitle>
                        <CardDescription className="text-gray-700">
                          {character.description}
                        </CardDescription>
                      </div>
                      <Badge className={getRarityColor(character.rarity)}>
                        {getRarityLabel(character.rarity)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">{character.image}</div>
                      <p className="text-sm text-gray-600">Level {character.level}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>EXP</span>
                        <span>{character.exp}/1000</span>
                      </div>
                      <Progress value={(character.exp / 1000) * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm">스킬:</p>
                      <div className="flex flex-wrap gap-2">
                        {character.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          {lockedCharacters.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                모든 캐릭터를 잠금 해제했습니다! 🎉
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lockedCharacters.map(character => (
                <Card key={character.id} className="overflow-hidden opacity-75">
                  <CardHeader className="bg-gray-100 border-b-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          {character.name}
                        </CardTitle>
                        <CardDescription>{character.description}</CardDescription>
                      </div>
                      <Badge className={getRarityColor(character.rarity)}>
                        {getRarityLabel(character.rarity)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2 filter grayscale">
                        {character.image}
                      </div>
                      <p className="text-sm text-gray-600">잠김</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-center text-gray-600">
                        특정 목표 달성 시 잠금 해제
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm">스킬:</p>
                      <div className="flex flex-wrap gap-2">
                        {character.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs opacity-50"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Character Status Info */}
      <Card>
        <CardHeader>
          <CardTitle>캐릭터 상태 시스템</CardTitle>
          <CardDescription>미접속 시 캐릭터가 변화합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl mb-2">😊</div>
              <p className="mb-1">활발한 상태</p>
              <p className="text-sm text-gray-600">
                매일 접속하고 목표를 달성 중
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="text-2xl mb-2">😐</div>
              <p className="mb-1">보통 상태</p>
              <p className="text-sm text-gray-600">
                1-3일 미접속
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="text-2xl mb-2">😢</div>
              <p className="mb-1">슬픈 상태</p>
              <p className="text-sm text-gray-600">
                3일 이상 미접속
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            꾸준히 접속하고 목표를 달성하여 캐릭터를 행복하게 만드세요!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
