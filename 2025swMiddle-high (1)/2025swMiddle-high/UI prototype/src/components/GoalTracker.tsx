import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Goal } from '../App';
import { Plus, Trash2, Edit } from 'lucide-react';

interface GoalTrackerProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
}

export function GoalTracker({ goals, setGoals }: GoalTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    targetDate: '',
    progress: 0,
    description: '',
  });

  const categories = ['학습', '건강', '재정', '관계', '취미', '커리어', '기타'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      setGoals(
        goals.map(g =>
          g.id === editingGoal.id ? { ...formData, id: editingGoal.id } : g
        )
      );
    } else {
      const newGoal: Goal = {
        ...formData,
        id: Date.now().toString(),
      };
      setGoals([...goals, newGoal]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      targetDate: '',
      progress: 0,
      description: '',
    });
    setEditingGoal(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      category: goal.category,
      targetDate: goal.targetDate,
      progress: goal.progress,
      description: goal.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(goals.map(g => (g.id === id ? { ...g, progress } : g)));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>목표 관리</h2>
          <p className="text-gray-600">장기적인 목표를 설정하고 진행 상황을 추적하세요</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGoal(null)}>
              <Plus className="w-4 h-4 mr-2" />
              새 목표 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingGoal ? '목표 수정' : '새 목표 추가'}</DialogTitle>
              <DialogDescription>
                달성하고 싶은 목표를 설정해보세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">목표 제목</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 영어 회화 능력 향상"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">목표 달성 날짜</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="목표에 대한 상세 설명을 작성하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>진행률: {formData.progress}%</Label>
                <Slider
                  value={[formData.progress]}
                  onValueChange={([value]) => setFormData({ ...formData, progress: value })}
                  max={100}
                  step={5}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  취소
                </Button>
                <Button type="submit">
                  {editingGoal ? '수정' : '추가'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center text-gray-500">
              아직 설정된 목표가 없습니다. 새로운 목표를 추가해보세요!
            </CardContent>
          </Card>
        ) : (
          goals.map(goal => {
            const daysRemaining = Math.ceil(
              (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{goal.title}</CardTitle>
                      <CardDescription>{goal.category}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(goal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>진행률</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <Slider
                      value={[goal.progress]}
                      onValueChange={([value]) => updateProgress(goal.id, value)}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">목표 날짜</span>
                    <span>
                      {new Date(goal.targetDate).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  {daysRemaining > 0 && (
                    <div className="text-sm text-center py-2 bg-blue-50 rounded-lg">
                      <span className="text-blue-600">
                        D-{daysRemaining}
                      </span>
                    </div>
                  )}
                  {daysRemaining < 0 && (
                    <div className="text-sm text-center py-2 bg-red-50 rounded-lg">
                      <span className="text-red-600">
                        목표 날짜가 지났습니다
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
