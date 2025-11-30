import { useState } from 'react';
import { User } from '../App';
import { Sidebar } from './layout/Sidebar';
import { CalendarView } from './calendar/CalendarView';
import { FriendsView } from './friends/FriendsView';
import { GoalRoomsView } from './goalrooms/GoalRoomsView';
import { MessagesView } from './messages/MessagesView';
import { FailureAnalysisView } from './analysis/FailureAnalysisView';
import { AITutorView } from './tutor/AITutorView';
import { FocusSessionView } from './focus/FocusSessionView';
import { CharacterView } from './character/CharacterView';
import { ProfileView } from './profile/ProfileView';
import { SettingsView } from './settings/SettingsView';

interface MainAppProps {
  user: User;
  onLogout: () => void;
}

export type ViewType =
  | 'calendar'
  | 'friends'
  | 'goalrooms'
  | 'messages'
  | 'analysis'
  | 'tutor'
  | 'focus'
  | 'character'
  | 'profile'
  | 'settings';

export function MainApp({ user, onLogout }: MainAppProps) {
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView user={user} />;
      case 'friends':
        return <FriendsView user={user} />;
      case 'goalrooms':
        return <GoalRoomsView user={user} />;
      case 'messages':
        return <MessagesView user={user} />;
      case 'analysis':
        return <FailureAnalysisView user={user} />;
      case 'tutor':
        return <AITutorView user={user} />;
      case 'focus':
        return <FocusSessionView user={user} />;
      case 'character':
        return <CharacterView user={user} />;
      case 'profile':
        return <ProfileView user={user} />;
      case 'settings':
        return <SettingsView user={user} onLogout={onLogout} />;
      default:
        return <CalendarView user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
