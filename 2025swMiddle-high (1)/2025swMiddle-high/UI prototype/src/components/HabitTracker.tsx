import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Habit } from '../App';
import { Plus, Trash2, CheckCircle2, Circle, Flame } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

export function HabitTracker({ habits, setHabits }: HabitTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    frequency: '매일',
  });

  const frequencies = ['매일', '주 5회', '주 3회', '주 1회'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHabit: Habit = {
      ...formData,
      id: Date.now().toString(),
      completedDates: [],
      streak: 0,
    };
    setHabits([...habits, newHabit]);
    setFormData({ name: '', frequency: '매일' });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(
      habits.map(habit => {
        if (habit.id !== id) return habit;

        const isCompletedToday = habit.completedDates.includes(today);
        let newCompletedDates: string[];
        let newStreak = habit.streak;

        if (isCompletedToday) {
          // Uncheck - remove today
          newCompletedDates = habit.completedDates.filter(date => date !== today);
          newStreak = calculateStreak(newCompletedDates);
        } else {
          // Check - add today
          newCompletedDates = [...habit.completedDates, today].sort();
          newStreak = calculateStreak(newCompletedDates);
        }

        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: newStreak,
        };
      })
    );
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;

    const sortedDates = [...dates].sort().reverse();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < sortedDates.length; i++) {
      const habitDate = new Date(sortedDates[i]);
      habitDate.setHours(0, 0, 0, 0);

      if (habitDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const last7Days = getLast7Days();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>습관 추적</h2>
          <p className="text-gray-600">매일 반복하는 좋은 습관을 만들어보세요</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              새 습관 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 습관 추가</DialogTitle>
              <DialogDescription>
                지속하고 싶은 좋은 습관을 추가하세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">습관 이름</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 아침 운동"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">빈도</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={value => setFormData({ ...formData, frequency: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="빈도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(freq => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
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

      <div className="space-y-4">
        {habits.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              아직 설정된 습관이 없습니다. 새로운 습관을 추가해보세요!
            </CardContent>
          </Card>
        ) : (
          habits.map(habit => {
            const today = new Date().toISOString().split('T')[0];
            const completedToday = habit.completedDates.includes(today);

            return (
              <Card key={habit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant={completedToday ? 'default' : 'outline'}
                        onClick={() => toggleHabit(habit.id)}
                        className={
                          completedToday
                            ? 'bg-green-600 hover:bg-green-700'
                            : ''
                        }
                      >
                        {completedToday ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </Button>
                      <div>
                        <CardTitle>{habit.name}</CardTitle>
                        <CardDescription>{habit.frequency}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full">
                        <Flame className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-600">
                          {habit.streak}일
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(habit.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {last7Days.map((date, index) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isCompleted = habit.completedDates.includes(dateStr);
                      const dayName = ['일', '월', '화', '수', '목', '금', '토'][
                        date.getDay()
                      ];

                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-1"
                        >
                          <span className="text-xs text-gray-500">{dayName}</span>
                          <div
                            className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100'
                            }`}
                          >
                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {date.getDate()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
