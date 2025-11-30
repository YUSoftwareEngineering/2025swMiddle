import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Timer, Play, Pause, RotateCcw, Coffee, Check } from 'lucide-react';

interface FocusSession {
  id: string;
  task: string;
  duration: number;
  completed: boolean;
  date: string;
}

interface FocusSessionViewProps {
  user: User;
}

export function FocusSessionView({ user }: FocusSessionViewProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [selectedDuration, setSelectedDuration] = useState('25');
  const [currentTask, setCurrentTask] = useState('');
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  
  const [sessions, setSessions] = useState<FocusSession[]>([
    {
      id: '1',
      task: '영어 공부',
      duration: 25,
      completed: true,
      date: '2024-11-04',
    },
    {
      id: '2',
      task: '프로젝트 작업',
      duration: 25,
      completed: true,
      date: '2024-11-04',
    },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    
    if (sessionType === 'work') {
      // Save completed work session
      if (currentTask) {
        const newSession: FocusSession = {
          id: Date.now().toString(),
          task: currentTask,
          duration: parseInt(selectedDuration),
          completed: true,
          date: new Date().toISOString().split('T')[0],
        };
        setSessions([newSession, ...sessions]);
      }
      
      // Switch to break
      alert('잘하셨습니다! 5분 휴식을 취하세요 ☕');
      setSessionType('break');
      setTimeLeft(5 * 60);
    } else {
      // Break complete
      alert('휴식 완료! 다시 집중할 준비가 되셨나요? 💪');
      setSessionType('work');
      setTimeLeft(parseInt(selectedDuration) * 60);
    }
  };

  const handleStart = () => {
    if (!currentTask && sessionType === 'work') {
      alert('작업 내용을 입력해주세요!');
      return;
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    if (sessionType === 'work') {
      setTimeLeft(parseInt(selectedDuration) * 60);
    } else {
      setTimeLeft(5 * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = sessionType === 'work' ? parseInt(selectedDuration) * 60 : 5 * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const todaySessions = sessions.filter(
    s => s.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <Timer className="w-8 h-8" />
          포커스 모드
        </h1>
        <p className="text-gray-600">집중력을 높여 효율적으로 작업하세요</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timer Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {sessionType === 'work' ? '작업 시간' : '휴식 시간'}
              {sessionType === 'break' && <Coffee className="inline-block w-5 h-5 ml-2" />}
            </CardTitle>
            <CardDescription>
              {sessionType === 'work' 
                ? '포모도로 기법으로 집중력을 높이세요'
                : '잠시 쉬면서 에너지를 충전하세요'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-8xl mb-4 font-mono">
                {formatTime(timeLeft)}
              </div>
              <Progress value={getProgress()} className="h-3 mb-6" />
            </div>

            {/* Task Input (only for work sessions) */}
            {sessionType === 'work' && !isActive && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>작업 내용</Label>
                  <Input
                    placeholder="무엇을 하실 건가요?"
                    value={currentTask}
                    onChange={e => setCurrentTask(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>집중 시간</Label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15분</SelectItem>
                      <SelectItem value="25">25분 (추천)</SelectItem>
                      <SelectItem value="30">30분</SelectItem>
                      <SelectItem value="45">45분</SelectItem>
                      <SelectItem value="60">60분</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              {!isActive ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  시작
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handlePause}
                    className="px-8"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        재개
                      </>
                    ) : (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        일시정지
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    초기화
                  </Button>
                </>
              )}
            </div>

            {isActive && currentTask && (
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">현재 작업</p>
                <p>{currentTask}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <Card>
          <CardHeader>
            <CardTitle>오늘의 집중</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg">
              <div className="text-3xl mb-1">{todaySessions.length}</div>
              <p className="text-sm text-gray-600">완료한 세션</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
              <div className="text-3xl mb-1">
                {todaySessions.reduce((sum, s) => sum + s.duration, 0)}
              </div>
              <p className="text-sm text-gray-600">총 집중 시간 (분)</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">이번 주 평균</p>
              <div className="flex items-center gap-2">
                <Progress value={68} className="flex-1" />
                <span className="text-sm">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>최근 세션</CardTitle>
          <CardDescription>완료한 포커스 세션 기록</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              아직 완료한 세션이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0, 10).map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-green-50/50"
                >
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                      <p>{session.task}</p>
                      <p className="text-sm text-gray-500">
                        {session.duration}분 집중
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{session.date}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
