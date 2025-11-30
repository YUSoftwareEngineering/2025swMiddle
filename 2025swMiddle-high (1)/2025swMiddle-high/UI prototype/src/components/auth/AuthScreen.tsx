import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User } from '../../App';
import { Sparkles } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { SiKakaotalk, SiNaver } from 'react-icons/si';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: '1',
      email: loginForm.email,
      username: 'user123',
      displayName: '자기개발왕',
      level: 5,
      exp: 750,
      bio: '매일 성장하는 중입니다!',
      isPublic: true,
    };
    onLogin(mockUser);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    const mockUser: User = {
      id: '1',
      email: signupForm.email,
      username: signupForm.username,
      displayName: signupForm.displayName,
      level: 1,
      exp: 0,
      isPublic: true,
    };
    onLogin(mockUser);
  };

  // ✅ 포털 로그인 클릭 (Mock)
  const handleSocialLogin = (provider: string) => {
    alert(`${provider} 계정으로 로그인 기능은 추후 지원 예정입니다.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle>SelfGrow</CardTitle>
          <CardDescription>함께 성장하는 소셜 자기개발 플랫폼</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>

            {/* ✅ 로그인 탭 */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">사용자 ID</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="사용자ID"
                    value={loginForm.email}
                    onChange={e =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">비밀번호</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="****"
                    value={loginForm.password}
                    onChange={e =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  로그인
                </Button>
                <Button type="button" variant="link" className="w-full">
                  아이디, 비밀번호를 잊으셨나요?
                </Button>
              </form>

              {/* ✅ 추가된 섹션: 소셜 로그인 옵션 */}
              <div className="mt-6 text-center text-sm text-gray-500">
                또는 다른 계정으로 로그인
              </div>
              <div className="flex justify-center gap-3 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('Google')}
                >
                  <FcGoogle className="mr-2 h-5 w-5" /> Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('Kakao')}
                >
                  <SiKakaotalk className="mr-2 h-5 w-5 text-yellow-400" /> Kakao
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('Naver')}
                >
                  <SiNaver className="mr-2 h-5 w-5 text-green-600" /> Naver
                </Button>
              </div>
            </TabsContent>

            {/* 회원가입 탭 */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">이메일</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="example@email.com"
                    value={signupForm.email}
                    onChange={e =>
                      setSignupForm({ ...signupForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-username">사용자명 (ID)</Label>
                  <Input
                    id="signup-username"
                    placeholder="username123"
                    value={signupForm.username}
                    onChange={e =>
                      setSignupForm({ ...signupForm, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-displayname">닉네임</Label>
                  <Input
                    id="signup-displayname"
                    placeholder="표시될 이름"
                    value={signupForm.displayName}
                    onChange={e =>
                      setSignupForm({ ...signupForm, displayName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupForm.password}
                    onChange={e =>
                      setSignupForm({ ...signupForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">비밀번호 확인</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={e =>
                      setSignupForm({
                        ...signupForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  회원가입
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
