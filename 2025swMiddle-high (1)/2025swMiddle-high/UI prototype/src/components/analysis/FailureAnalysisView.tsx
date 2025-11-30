import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, AlertTriangle, Lightbulb, Calendar } from 'lucide-react';

interface FailureAnalysisViewProps {
  user: User;
}

export function FailureAnalysisView({ user }: FailureAnalysisViewProps) {
  // Mock data for failure analysis
  const weekdayData = [
    { day: '월', failures: 2 },
    { day: '화', failures: 1 },
    { day: '수', failures: 3 },
    { day: '목', failures: 1 },
    { day: '금', failures: 4 },
    { day: '토', failures: 2 },
    { day: '일', failures: 5 },
  ];

  const reasonsData = [
    { name: '시간 부족', value: 35, color: '#EF4444' },
    { name: '동기 부여 부족', value: 25, color: '#F59E0B' },
    { name: '피로', value: 20, color: '#10B981' },
    { name: '예상치 못한 일정', value: 15, color: '#3B82F6' },
    { name: '기타', value: 5, color: '#6B7280' },
  ];

  const recentFailures = [
    {
      id: '1',
      goal: '영어 공부 30분',
      date: '2024-11-03',
      reason: '시간 부족',
      category: '학습',
    },
    {
      id: '2',
      goal: '운동 1시간',
      date: '2024-11-02',
      reason: '피로',
      category: '건강',
    },
    {
      id: '3',
      goal: '독서 30분',
      date: '2024-11-01',
      reason: '동기 부여 부족',
      category: '취미',
    },
  ];

  const insights = [
    {
      title: '주말에 실패율이 높습니다',
      description: '주말에는 일정이 불규칙해지는 경향이 있습니다. 주말 목표를 좀 더 유연하게 설정해보세요.',
      type: 'warning',
    },
    {
      title: '시간 부족이 가장 큰 원인입니다',
      description: '목표를 달성할 시간을 미리 캘린더에 블록해두는 것을 추천합니다.',
      type: 'tip',
    },
    {
      title: '학습 목표의 성공률이 낮습니다',
      description: '학습 목표를 더 작은 단위로 쪼개서 설정해보세요. 예: 30분 → 15분',
      type: 'tip',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <TrendingDown className="w-8 h-8" />
          실패 분석
        </h1>
        <p className="text-gray-600">실패에서 배우고 개선하세요</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">총 실패 횟수 (이번 달)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">18회</div>
            <Progress value={60} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">지난 달 대비 -20%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">평균 성공률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">73%</div>
            <Progress value={73} className="h-2" />
            <p className="text-xs text-green-600 mt-2">개선 중 📈</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">가장 취약한 요일</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">일요일</div>
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
              실패율 높음
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>요일별 실패 패턴</CardTitle>
            <CardDescription>어떤 요일에 실패가 많은지 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="failures" fill="#14B8A6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>실패 원인 분석</CardTitle>
            <CardDescription>가장 자주 발생하는 실패 원인</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reasonsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => `${entry.name} (${entry.value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reasonsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI 개선 조언
          </CardTitle>
          <CardDescription>데이터 기반 맞춤형 조언</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'warning'
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                {insight.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                )}
                <div>
                  <p className="mb-1">{insight.title}</p>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Failures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            최근 실패 기록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFailures.map(failure => (
              <div
                key={failure.id}
                className="p-4 rounded-lg border bg-red-50/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p>{failure.goal}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{failure.category}</Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-600">
                        {failure.reason}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{failure.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
