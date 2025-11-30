import { Card } from '../ui/card';

interface WeeklyCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeeklyCalendar({
  currentDate,
  selectedDate,
  onSelectDate,
}: WeeklyCalendarProps) {
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // Mock goal completion data
  const getGoalStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const mockData: { [key: string]: { total: number; completed: number; partial: number; failed: number } } = {
      [new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
        total: 5,
        completed: 3,
        partial: 1,
        failed: 1,
      },
      [new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
        total: 5,
        completed: 4,
        partial: 1,
        failed: 0,
      },
      [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
        total: 5,
        completed: 2,
        partial: 2,
        failed: 1,
      },
    };
    return mockData[dateStr];
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day, index) => {
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const status = getGoalStatus(day);

        return (
          <Card
            key={index}
            className={`cursor-pointer transition-all ${
              isSelected
                ? 'ring-2 ring-teal-500 shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => onSelectDate(day)}
          >
            <div className="p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">
                {dayNames[index]}
              </div>
              <div
                className={`mb-2 ${
                  isToday ? 'text-teal-600' : ''
                }`}
              >
                {day.getDate()}
              </div>

              {status && (
                <div className="flex gap-1 justify-center">
                  {Array.from({ length: status.completed }).map((_, i) => (
                    <div
                      key={`completed-${i}`}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                  ))}
                  {Array.from({ length: status.partial }).map((_, i) => (
                    <div
                      key={`partial-${i}`}
                      className="w-2 h-2 rounded-full bg-yellow-500"
                    />
                  ))}
                  {Array.from({ length: status.failed }).map((_, i) => (
                    <div
                      key={`failed-${i}`}
                      className="w-2 h-2 rounded-full bg-red-500"
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
