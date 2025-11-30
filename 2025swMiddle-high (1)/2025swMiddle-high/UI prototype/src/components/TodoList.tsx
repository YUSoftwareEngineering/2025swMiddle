import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Todo } from '../App';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export function TodoList({ todos, setTodos }: TodoListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    task: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: '',
  });

  const categories = ['업무', '학습', '건강', '개인', '쇼핑', '기타'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: Todo = {
      ...formData,
      id: Date.now().toString(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setFormData({ task: '', priority: 'medium', category: '' });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return priority;
    }
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>할 일 목록</h2>
          <p className="text-gray-600">오늘 해야 할 일들을 관리하세요</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              새 할 일 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 할 일 추가</DialogTitle>
              <DialogDescription>
                오늘 해야 할 일을 추가하세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task">할 일</Label>
                <Input
                  id="task"
                  value={formData.task}
                  onChange={e => setFormData({ ...formData, task: e.target.value })}
                  placeholder="예: 프로젝트 기획서 작성"
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
                <Label htmlFor="priority">우선순위</Label>
                <Select
                  value={formData.priority}
                  onValueChange={value =>
                    setFormData({
                      ...formData,
                      priority: value as 'high' | 'medium' | 'low',
                    })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="우선순위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="low">낮음</SelectItem>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Todos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              진행 중 ({activeTodos.length})
            </CardTitle>
            <CardDescription>완료되지 않은 할 일</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTodos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                모든 할 일을 완료했습니다! 🎉
              </p>
            ) : (
              activeTodos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={todo.completed ? 'line-through text-gray-500' : ''}>
                      {todo.task}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {todo.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(todo.priority)}`}
                      >
                        {getPriorityLabel(todo.priority)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Completed Todos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              완료됨 ({completedTodos.length})
            </CardTitle>
            <CardDescription>완료한 할 일</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTodos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                완료한 항목이 없습니다
              </p>
            ) : (
              completedTodos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-green-50/50 hover:shadow-md transition-shadow"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="line-through text-gray-500">{todo.task}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {todo.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(todo.priority)}`}
                      >
                        {getPriorityLabel(todo.priority)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
