// 인증 헤더를 포함한 fetch 헬퍼 함수
const authFetch = async (url, options = {}) => {
    const token = tokenManager?.getAccessToken?.() || localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(url, {
        ...options,
        headers
    });
    
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const error = new Error(errData.message || '요청 실패');
        error.status = res.status;
        throw error;
    }
    
    // 응답이 비어있으면 빈 객체 반환
    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

// 인증 API
const authApi = {
    register: async (data) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            // 백엔드가 문자열 또는 JSON으로 응답할 수 있음
            const text = await res.text();
            let message = '회원가입 실패';
            try {
                const json = JSON.parse(text);
                message = json.message || json.error || text;
            } catch {
                message = text || '회원가입 실패';
            }
            const error = new Error(message);
            error.status = res.status;
            throw error;
        }

        return res.json();
    },

    login: async (data) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const error = new Error(errData.message || '로그인 실패');
            error.status = res.status;
            throw error;
        }

        return res.json();
    }
};

// 캘린더 API
const calendarApi = {
    getWeekly: async (userId, date) => {
        return authFetch(`/api/calendar/weekly?userId=${userId}&date=${date}`);
    },
    
    getMonthly: async (userId, date) => {
        return authFetch(`/api/calendar/monthly?userId=${userId}&date=${date}`);
    },
    
    getDaily: async (userId, date) => {
        return authFetch(`/api/calendar/daily?userId=${userId}&date=${date}`);
    }
};

// 목표 API (백엔드: /api/v1/goals)
const goalApi = {
    create: async (data) => {
        return authFetch('/api/v1/goals', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    update: async (goalId, data) => {
        return authFetch(`/api/v1/goals/${goalId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    updateStatus: async (goalId, data) => {
        return authFetch(`/api/v1/goals/${goalId}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },
    
    updateStatusBulk: async (data) => {
        return authFetch('/api/v1/goals/status/bulk', {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },
    
    delete: async (goalId) => {
        return authFetch(`/api/v1/goals/${goalId}`, {
            method: 'DELETE'
        });
    },
    
    markAsFailed: async (goalId) => {
        return authFetch(`/api/v1/goals/${goalId}/fail`, {
            method: 'POST'
        });
    },
    
    getAchievementColor: async (date) => {
        return authFetch(`/api/v1/goals/achievement?date=${date}`);
    }
};

// 실패 기록 API (백엔드: /api/failures)
const failureApi = {
    getTags: async (userId) => {
        return authFetch(`/api/failures/tags?userId=${userId}`);
    },
    
    createTag: async (data) => {
        return authFetch('/api/failures/tags', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    log: async (data) => {
        return authFetch('/api/failures/log', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// 포커스 세션 API
const focusApi = {
    startSession: async (data) => {
        return authFetch('/api/focus/start', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    pauseSession: async (sessionId) => {
        return authFetch(`/api/focus/${sessionId}/pause`, {
            method: 'POST'
        });
    },
    
    resumeSession: async (sessionId) => {
        return authFetch(`/api/focus/${sessionId}/resume`, {
            method: 'POST'
        });
    },
    
    completeSession: async (sessionId) => {
        return authFetch(`/api/focus/${sessionId}/complete`, {
            method: 'POST'
        });
    }
};
