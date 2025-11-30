interface MonthlyCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function MonthlyCalendar({
  currentDate,
  selectedDate,
  onSelectDate,
}: MonthlyCalendarProps) {
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const monthDays = getMonthDays();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((name, index) => (
          <div
            key={index}
            className={`text-center text-sm ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day, index) => {
          if (!day) {
            return <div key={index} />;
          }

          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              className={`
                aspect-square p-2 rounded-lg cursor-pointer transition-all
                flex items-center justify-center
                ${isSelected ? 'bg-teal-500 text-white' : 'hover:bg-gray-100'}
                ${isToday && !isSelected ? 'ring-2 ring-teal-500' : ''}
              `}
              onClick={() => onSelectDate(day)}
            >
              <span className="text-sm">{day.getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
