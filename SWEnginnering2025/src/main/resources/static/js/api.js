// API 요청 함수
const api = {
    get: async (url) => {
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
            const err = new Error();
            err.status = res.status;
            err.message = await res.text();
            throw err;
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    },
    post: async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = new Error();
            err.status = res.status;
            err.message = await res.text();
            throw err;
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    },
    put: async (url, data) => {
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = new Error();
            err.status = res.status;
            err.message = await res.text();
            throw err;
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    },
    patch: async (url, data) => {
        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = new Error();
            err.status = res.status;
            err.message = await res.text();
            throw err;
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    },
    delete: async (url) => {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
            const err = new Error();
            err.status = res.status;
            err.message = await res.text();
            throw err;
        }
        return null;
    }
};

// 인증 API
const authApi = {
    login: (email, password) => api.post('/api/auth/login', { email, password }),
    register: (data) => api.post('/api/auth/register', data)
};

// 캘린더 API
const calendarApi = {
    getWeekly: (userId, date) => api.get(`/api/calendar/weekly?userId=${userId}&date=${date}`),
    getMonthly: (userId, date) => api.get(`/api/calendar/monthly?userId=${userId}&date=${date}`),
    getDaily: (userId, date) => api.get(`/api/calendar/daily?userId=${userId}&date=${date}`)
};

// 목표 API
const goalApi = {
    create: (data) => api.post('/api/v1/goals', data),
    update: (id, data) => api.put(`/api/v1/goals/${id}`, data),
    delete: (id) => api.delete(`/api/v1/goals/${id}`),
    updateStatus: (id, data) => api.patch(`/api/v1/goals/${id}/status`, data),
    markFailed: (id) => api.post(`/api/v1/goals/${id}/fail`)
};

// 실패 기록 API
const failureApi = {
    getTags: (userId) => api.get(`/api/failures/tags?userId=${userId}`),
    createTag: (data) => api.post('/api/failures/tags', data),
    log: (data) => api.post('/api/failures/log', data)
};

// 토큰 관리
const tokenManager = {
    save: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('nickname', data.nickname);
    },
    clear: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('nickname');
    },
    isLoggedIn: () => !!localStorage.getItem('accessToken'),
    getNickname: () => localStorage.getItem('nickname'),
    getAccessToken: () => localStorage.getItem('accessToken')
};

