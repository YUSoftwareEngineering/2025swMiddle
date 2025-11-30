import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Goal, Habit, Todo } from '../App';
import { Target, Flame, CheckCircle2, TrendingUp } from 'lucide-react';

interface ProgressDashboardProps {
  goals: Goal[];
  habits: Habit[];
  todos: Todo[];
}

export function ProgressDashboard({ goals, habits, todos }: ProgressDashboardProps) {
  const completedTodos = todos.filter(t => t.completed).length;
  const todoCompletionRate = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;
  
  const averageGoalProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length 
    : 0;

  const maxStreak = habits.length > 0
    ? Math.max(...habits.map(h => h.streak), 0)
    : 0;

  const motivationalQuotes = [
    "작은 진보도 진보입니다.",
    "매일 조금씩 성장하는 것이 중요합니다.",
    "당신의 노력은 결코 배신하지 않습니다.",
    "오늘의 당신은 어제의 당신보다 나은 사람입니다.",
    "꾸준함이 재능을 이깁니다.",
  ];

  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <div className="space-y-6">
      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            오늘의 동기부여
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg italic">"{todayQuote}"</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>목표 진행률</CardTitle>
            <Target className="w-4 h-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="mb-2">{averageGoalProgress.toFixed(0)}%</div>
            <Progress value={averageGoalProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">
              {goals.length}개의 목표 진행 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>최고 연속 기록</CardTitle>
            <Flame className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="mb-2">{maxStreak}일</div>
            <p className="text-xs text-gray-500">
              {habits.length}개의 습관 추적 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>오늘의 할 일</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="mb-2">{completedTodos}/{todos.length}</div>
            <Progress value={todoCompletionRate} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">
              {todoCompletionRate.toFixed(0)}% 완료
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle>진행 중인 목표</CardTitle>
          <CardDescription>현재 집중하고 있는 목표들입니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              아직 설정된 목표가 없습니다. 새로운 목표를 추가해보세요!
            </p>
          ) : (
            goals.map(goal => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p>{goal.title}</p>
                    <p className="text-xs text-gray-500">{goal.category}</p>
                  </div>
                  <span className="text-sm">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Today's Habits */}
      <Card>
        <CardHeader>
          <CardTitle>오늘의 습관 체크</CardTitle>
          <CardDescription>매일 반복하는 좋은 습관들</CardDescription>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              아직 설정된 습관이 없습니다. 새로운 습관을 추가해보세요!
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {habits.map(habit => {
                const today = new Date().toISOString().split('T')[0];
                const completedToday = habit.completedDates.includes(today);
                return (
                  <div
                    key={habit.id}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      completedToday
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p>{habit.name}</p>
                        <p className="text-xs text-gray-500">
                          🔥 {habit.streak}일 연속
                        </p>
                      </div>
                      {completedToday && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
