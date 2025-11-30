import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { UserCircle, Edit, Save, X, Trophy, Target, Flame } from 'lucide-react';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    bio: user.bio || '',
    isPublic: user.isPublic,
  });

  const handleSave = () => {
    // In real app, this would save to backend
    alert('프로필이 저장되었습니다!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      displayName: user.displayName,
      bio: user.bio || '',
      isPublic: user.isPublic,
    });
    setIsEditing(false);
  };

  const stats = [
    { label: '총 목표 달성', value: '127', icon: Target, color: 'text-blue-600' },
    { label: '연속 접속', value: '15일', icon: Flame, color: 'text-orange-600' },
    { label: '획득 배지', value: '8개', icon: Trophy, color: 'text-yellow-600' },
  ];

  const badges = [
    { name: '7일 연속 달성', emoji: '🔥', earned: true },
    { name: '첫 목표 완료', emoji: '🎯', earned: true },
    { name: '30일 연속 접속', emoji: '📅', earned: true },
    { name: '100개 목표 달성', emoji: '💯', earned: true },
    { name: '친구 10명', emoji: '👥', earned: true },
    { name: '포커스 마스터', emoji: '⏱️', earned: false },
    { name: '아침형 인간', emoji: '🌅', earned: false },
    { name: '완벽주의자', emoji: '⭐', earned: false },
  ];

  const recentAchievements = [
    { title: '7일 연속 목표 달성', date: '2024-11-04', xp: 100 },
    { title: '친구 10명 달성', date: '2024-11-02', xp: 50 },
    { title: '포커스 세션 50회', date: '2024-11-01', xp: 75 },
  ];

  const expPercentage = (user.exp % 1000) / 10;
  const nextLevelXp = 1000;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <UserCircle className="w-8 h-8" />
          프로필
        </h1>
        <p className="text-gray-600">내 정보를 관리하세요</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>기본 정보</CardTitle>
            {!isEditing ? (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">
                {formData.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label>닉네임</Label>
                {isEditing ? (
                  <Input
                    value={formData.displayName}
                    onChange={e =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                  />
                ) : (
                  <p>{formData.displayName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>사용자명</Label>
                <p className="text-gray-600">@{user.username}</p>
              </div>

              <div className="space-y-2">
                <Label>이메일</Label>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>소개</Label>
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="자신을 소개해주세요"
                rows={3}
              />
            ) : (
              <p className="text-gray-600">{formData.bio || '소개가 없습니다.'}</p>
            )}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p>프로필 공개</p>
              <p className="text-sm text-gray-600">
                다른 사용자가 내 프로필을 볼 수 있습니다
              </p>
            </div>
            <Switch
              checked={formData.isPublic}
              onCheckedChange={checked =>
                setFormData({ ...formData, isPublic: checked })
              }
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Level & XP */}
      <Card>
        <CardHeader>
          <CardTitle>레벨 & 경험치</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl">Level {user.level}</p>
              <p className="text-sm text-gray-600">
                {user.exp} / {nextLevelXp} XP
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">다음 레벨까지</p>
              <p>{nextLevelXp - user.exp} XP</p>
            </div>
          </div>
          <Progress value={expPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>배지 컬렉션</CardTitle>
          <CardDescription>
            달성한 업적: {badges.filter(b => b.earned).length}/{badges.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border text-center ${
                  badge.earned
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                    : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.emoji}</div>
                <p className="text-sm">{badge.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>최근 업적</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-teal-50 to-emerald-50"
              >
                <div>
                  <p>{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.date}</p>
                </div>
                <Badge className="bg-teal-600">+{achievement.xp} XP</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
