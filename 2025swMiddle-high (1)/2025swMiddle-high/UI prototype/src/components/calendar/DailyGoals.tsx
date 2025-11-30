import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'partial' | 'failed';
  color: string;
  failureReason?: string;
}

interface DailyGoalsProps {
  selectedDate: Date;
}

export function DailyGoals({ selectedDate }: DailyGoalsProps) {
  const [goals, setGoals] = useState<DailyGoal[]>([
    {
      id: '1',
      title: '영어 공부 30분',
      description: '듀오링고 + 영어 뉴스 읽기',
      status: 'pending',
      color: 'blue',
    },
    {
      id: '2',
      title: '운동 1시간',
      description: '조깅 또는 헬스',
      status: 'pending',
      color: 'green',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [failureDialogOpen, setFailureDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<DailyGoal | null>(null);
  const [failureReason, setFailureReason] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: 'blue',
  });

  const colors = [
    { value: 'blue', label: '파랑', class: 'bg-blue-500' },
    { value: 'green', label: '초록', class: 'bg-green-500' },
    { value: 'purple', label: '보라', class: 'bg-purple-500' },
    { value: 'red', label: '빨강', class: 'bg-red-500' },
    { value: 'yellow', label: '노랑', class: 'bg-yellow-500' },
    { value: 'pink', label: '분홍', class: 'bg-pink-500' },
  ];

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: DailyGoal = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
    };
    setGoals([...goals, newGoal]);
    setFormData({ title: '', description: '', color: 'blue' });
    setIsDialogOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleStatusChange = (id: string, status: DailyGoal['status']) => {
    if (status === 'failed') {
      const goal = goals.find(g => g.id === id);
      if (goal) {
        setSelectedGoal(goal);
        setFailureDialogOpen(true);
      }
    } else {
      setGoals(goals.map(g => (g.id === id ? { ...g, status } : g)));
    }
  };

  const handleFailureSubmit = () => {
    if (selectedGoal) {
      setGoals(
        goals.map(g =>
          g.id === selectedGoal.id
            ? { ...g, status: 'failed', failureReason }
            : g
        )
      );
      setFailureReason('');
      setSelectedGoal(null);
      setFailureDialogOpen(false);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      pink: 'bg-pink-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{formatDate(selectedDate)}의 목표</CardTitle>
            <CardDescription>
              {goals.filter(g => g.status === 'completed').length} / {goals.length} 완료
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                목표 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 목표 추가</DialogTitle>
                <DialogDescription>오늘의 목표를 설정하세요</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label>목표 제목</Label>
                  <Input
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="예: 영어 공부 30분"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="상세 내용을 입력하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>색상</Label>
                  <Select
                    value={formData.color}
                    onValueChange={value =>
                      setFormData({ ...formData, color: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${c.class}`} />
                            {c.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">추가</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            목표를 추가해보세요!
          </p>
        ) : (
          goals.map(goal => (
            <div
              key={goal.id}
              className="p-4 border rounded-lg space-y-3 bg-white"
            >
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${getColorClass(goal.color)}`} />
                <div className="flex-1">
                  <p className={goal.status === 'completed' ? 'line-through text-gray-500' : ''}>
                    {goal.title}
                  </p>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                  {goal.failureReason && (
                    <p className="text-sm text-red-600 mt-1">
                      실패 원인: {goal.failureReason}
                    </p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={goal.status === 'completed' ? 'default' : 'outline'}
                  className={
                    goal.status === 'completed'
                      ? 'bg-green-600 hover:bg-green-700'
                      : ''
                  }
                  onClick={() => handleStatusChange(goal.id, 'completed')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  완료
                </Button>
                <Button
                  size="sm"
                  variant={goal.status === 'partial' ? 'default' : 'outline'}
                  className={
                    goal.status === 'partial'
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : ''
                  }
                  onClick={() => handleStatusChange(goal.id, 'partial')}
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  부분완료
                </Button>
                <Button
                  size="sm"
                  variant={goal.status === 'failed' ? 'default' : 'outline'}
                  className={
                    goal.status === 'failed'
                      ? 'bg-red-600 hover:bg-red-700'
                      : ''
                  }
                  onClick={() => handleStatusChange(goal.id, 'failed')}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  실패
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      {/* Failure Reason Dialog */}
      <Dialog open={failureDialogOpen} onOpenChange={setFailureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>실패 원인 기록</DialogTitle>
            <DialogDescription>
              다음에 개선할 수 있도록 실패 원인을 기록해보세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={failureReason}
              onChange={e => setFailureReason(e.target.value)}
              placeholder="예: 시간 부족, 동기 부여 부족, 예상치 못한 일정 등"
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFailureDialogOpen(false);
                  setFailureReason('');
                  setSelectedGoal(null);
                }}
              >
                취소
              </Button>
              <Button onClick={handleFailureSubmit}>기록</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
