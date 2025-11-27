import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User } from '../../App';
import { Sparkles } from 'lucide-react';

export function AuthScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  // 🔥 비밀번호 재설정 모달 상태
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // ========================
  // 🔹 로그인
  // ========================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: loginForm.email,
        password: loginForm.password
      });

      const { accessToken, user } = response.data;
      localStorage.setItem("jwt", accessToken);
      onLogin(user);
    } catch (err) {
      alert("로그인 실패! 이메일과 비밀번호를 확인해주세요.");
    }
  };

  // ========================
  // 🔹 회원가입
  // ========================
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        userId: signupForm.username,
        nickname: signupForm.displayName,
        email: signupForm.email,
        password: signupForm.password,
        passwordConfirm: signupForm.confirmPassword,
        birth: "2000-01-01" // 필요 시 폼에 추가
      });

      const { accessToken, user } = response.data;
      localStorage.setItem("jwt", accessToken);
      onLogin(user);
    } catch (err: any) {
      if (err.response && err.response.data) {
        alert(err.response.data.message || "회원가입 실패! 입력 정보를 확인해주세요.");
      } else {
        alert("회원가입 실패! 입력 정보를 확인해주세요.");
      }
    }
  };

  // ========================
  // 🔹 비밀번호 재설정
  // ========================
  const handlePasswordReset = async () => {
    if (!resetEmail) return alert("이메일 입력 필요");

    try {
      setResetLoading(true);
      await axios.post("http://localhost:8080/api/auth/password/reset", { email: resetEmail });
      alert("비밀번호 재설정 이메일이 발송되었습니다.");
      setResetModalOpen(false);
      setResetEmail('');
    } catch (err) {
      alert("해당 이메일로 가입한 사용자를 찾을 수 없습니다.");
    } finally {
      setResetLoading(false);
    }
  };

  // ========================
  // UI
  // ========================
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

            {/* ======================== 로그인 ======================== */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>사용자 ID</Label>
                  <Input
                    type="email"
                    placeholder="사용자ID"
                    value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>비밀번호</Label>
                  <Input
                    type="password"
                    placeholder="****"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  로그인
                </Button>

                {/* 🔥 비밀번호 찾기 버튼 */}
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => setResetModalOpen(true)}
                >
                  아이디, 비밀번호를 잊으셨나요?
                </Button>
              </form>
            </TabsContent>

            {/* ======================== 회원가입 ======================== */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label>이메일</Label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={signupForm.email}
                    onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>사용자명 (ID)</Label>
                  <Input
                    placeholder="username123"
                    value={signupForm.username}
                    onChange={e => setSignupForm({ ...signupForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>닉네임</Label>
                  <Input
                    placeholder="표시될 이름"
                    value={signupForm.displayName}
                    onChange={e => setSignupForm({ ...signupForm, displayName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>비밀번호</Label>
                  <Input
                    type="password"
                    value={signupForm.password}
                    onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>비밀번호 확인</Label>
                  <Input
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
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

      {/* ======================== 비밀번호 재설정 모달 ======================== */}
      {resetModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">비밀번호 재설정</h2>

            <Label>가입한 이메일</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setResetModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handlePasswordReset} disabled={resetLoading}>
                {resetLoading ? "전송 중..." : "전송하기"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
