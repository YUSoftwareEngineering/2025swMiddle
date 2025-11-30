import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Settings, Bell, Users, Shield, Trash2, LogOut, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onLogout: () => void;
}

export function SettingsView({ user, onLogout }: SettingsViewProps) {
  const [notifications, setNotifications] = useState({
    goalReminders: true,
    friendRequests: true,
    messages: true,
    achievements: true,
    weeklyReport: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    allowFriendRequests: true,
    showOnlineStatus: true,
    allowMessages: 'friends',
  });

  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleSaveNotifications = () => {
    alert('알림 설정이 저장되었습니다!');
  };

  const handleSavePrivacy = () => {
    alert('개인정보 설정이 저장되었습니다!');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm === user.username) {
      alert('계정이 삭제되었습니다.');
      onLogout();
    } else {
      alert('사용자명이 일치하지 않습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <Settings className="w-8 h-8" />
          설정
        </h1>
        <p className="text-gray-600">계정 및 앱 설정을 관리하세요</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            알림 설정
          </CardTitle>
          <CardDescription>받고 싶은 알림을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>목표 리마인더</Label>
              <p className="text-sm text-gray-600">
                설정한 목표를 상기시켜 드립니다
              </p>
            </div>
            <Switch
              checked={notifications.goalReminders}
              onCheckedChange={checked =>
                setNotifications({ ...notifications, goalReminders: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>친구 요청</Label>
              <p className="text-sm text-gray-600">새 친구 요청 알림</p>
            </div>
            <Switch
              checked={notifications.friendRequests}
              onCheckedChange={checked =>
                setNotifications({ ...notifications, friendRequests: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>메시지</Label>
              <p className="text-sm text-gray-600">새 메시지 알림</p>
            </div>
            <Switch
              checked={notifications.messages}
              onCheckedChange={checked =>
                setNotifications({ ...notifications, messages: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>업적 달성</Label>
              <p className="text-sm text-gray-600">새로운 업적 달성 시 알림</p>
            </div>
            <Switch
              checked={notifications.achievements}
              onCheckedChange={checked =>
                setNotifications({ ...notifications, achievements: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>주간 리포트</Label>
              <p className="text-sm text-gray-600">매주 진행 상황 요약</p>
            </div>
            <Switch
              checked={notifications.weeklyReport}
              onCheckedChange={checked =>
                setNotifications({ ...notifications, weeklyReport: checked })
              }
            />
          </div>

          <Button onClick={handleSaveNotifications} className="w-full">
            알림 설정 저장
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Social */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            개인정보 및 소셜
          </CardTitle>
          <CardDescription>프로필 공개 범위 및 소셜 설정</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>프로필 공개 범위</Label>
            <Select
              value={privacy.profileVisibility}
              onValueChange={value =>
                setPrivacy({ ...privacy, profileVisibility: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">전체 공개</SelectItem>
                <SelectItem value="friends">친구에게만</SelectItem>
                <SelectItem value="private">비공개</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>친구 요청 허용</Label>
              <p className="text-sm text-gray-600">
                다른 사용자가 친구 요청을 보낼 수 있습니다
              </p>
            </div>
            <Switch
              checked={privacy.allowFriendRequests}
              onCheckedChange={checked =>
                setPrivacy({ ...privacy, allowFriendRequests: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>온라인 상태 표시</Label>
              <p className="text-sm text-gray-600">
                친구들에게 온라인 상태를 표시합니다
              </p>
            </div>
            <Switch
              checked={privacy.showOnlineStatus}
              onCheckedChange={checked =>
                setPrivacy({ ...privacy, showOnlineStatus: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>메시지 수신 허용</Label>
            <Select
              value={privacy.allowMessages}
              onValueChange={value =>
                setPrivacy({ ...privacy, allowMessages: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">모든 사용자</SelectItem>
                <SelectItem value="friends">친구만</SelectItem>
                <SelectItem value="none">받지 않음</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSavePrivacy} className="w-full">
            개인정보 설정 저장
          </Button>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            계정 관리
          </CardTitle>
          <CardDescription>비밀번호 변경 및 계정 관리</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            비밀번호 변경
          </Button>

          <Separator />

          <Button
            variant="outline"
            className="w-full"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>

          <Separator />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                계정 삭제
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  계정 삭제
                </DialogTitle>
                <DialogDescription>
                  이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    삭제되는 데이터:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside mt-2">
                    <li>모든 목표 및 습관 기록</li>
                    <li>친구 관계 및 메시지</li>
                    <li>캐릭터 및 업적</li>
                    <li>프로필 정보</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label>
                    계속하려면 사용자명 <strong>@{user.username}</strong>을 입력하세요
                  </Label>
                  <Input
                    placeholder={user.username}
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                  />
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== user.username}
                >
                  영구적으로 계정 삭제
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle>앱 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">버전</span>
            <span>1.0.0</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">마지막 업데이트</span>
            <span>2024-11-04</span>
          </div>
          <Separator />
          <Button variant="link" className="w-full">
            이용약관
          </Button>
          <Button variant="link" className="w-full">
            개인정보처리방침
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
