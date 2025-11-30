import { useState } from 'react';
import { AuthScreen } from './components/auth/AuthScreen';
import { MainApp } from './components/MainApp';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  exp: number;
  bio?: string;
  isPublic: boolean;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return <MainApp user={currentUser} onLogout={handleLogout} />;
}
