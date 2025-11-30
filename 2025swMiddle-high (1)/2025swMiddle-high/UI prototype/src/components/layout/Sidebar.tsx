import { User } from '../../App';
import { ViewType } from '../MainApp';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import {
  Calendar,
  Users,
  Target,
  MessageCircle,
  TrendingDown,
  GraduationCap,
  Timer,
  Sparkles,
  UserCircle,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  user: User;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  user,
  currentView,
  onViewChange,
  isOpen,
  onToggle,
}: SidebarProps) {
  const menuItems: { view: ViewType; label: string; icon: any }[] = [
    { view: 'calendar', label: '캘린더', icon: Calendar },
    { view: 'friends', label: '친구', icon: Users },
    { view: 'goalrooms', label: '목표방', icon: Target },
    { view: 'messages', label: '메시지', icon: MessageCircle },
    { view: 'analysis', label: '실패 분석', icon: TrendingDown },
    { view: 'tutor', label: 'AI 학습봇', icon: GraduationCap },
    { view: 'focus', label: '포커스 모드', icon: Timer },
    { view: 'character', label: '캐릭터', icon: Sparkles },
  ];

  const expPercentage = (user.exp % 1000) / 10;

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate">{user.displayName}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Level {user.level}</span>
                <span className="text-gray-600">{user.exp} XP</span>
              </div>
              <Progress value={expPercentage} className="h-2" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.view}
                    variant={currentView === item.view ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      onViewChange(item.view);
                      if (window.innerWidth < 1024) onToggle();
                    }}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Bottom Menu */}
          <div className="p-2 border-t">
            <Button
              variant={currentView === 'profile' ? 'secondary' : 'ghost'}
              className={`w-full justify-start mb-1 ${
                currentView === 'profile' ? 'bg-teal-100 text-teal-900 hover:bg-teal-200' : ''
              }`}
              onClick={() => onViewChange('profile')}
            >
              <UserCircle className="w-4 h-4 mr-3" />
              프로필
            </Button>
            <Button
              variant={currentView === 'settings' ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${
                currentView === 'settings' ? 'bg-teal-100 text-teal-900 hover:bg-teal-200' : ''
              }`}
              onClick={() => onViewChange('settings')}
            >
              <Settings className="w-4 h-4 mr-3" />
              설정
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
