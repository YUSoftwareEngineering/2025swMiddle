// 캘린더 관련 API
const calendarApi = {
    // 일별 캘린더 조회
    getDaily: async (date) => {
        return await api.get(`/calendar/daily?date=${date}`);
    },

    // 주별 캘린더 조회
    getWeekly: async (startDate) => {
        return await api.get(`/calendar/weekly?startDate=${startDate}`);
    },

    // 월별 캘린더 조회
    getMonthly: async (year, month) => {
        return await api.get(`/calendar/monthly?year=${year}&month=${month}`);
    },
};

window.calendarApi = calendarApi;

