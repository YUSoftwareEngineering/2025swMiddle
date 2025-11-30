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
        // 401 Unauthorized - 토큰 만료 또는 인증 실패
        if (res.status === 401) {
            console.warn('인증 만료 - 다시 로그인 필요');
            tokenManager.clear();
            window.location.href = '/index.html';
            return;
        }
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
        return authFetch(`/api/v1/calendar/weekly?userId=${userId}&date=${date}`);
    },
    
    getMonthly: async (userId, date) => {
        return authFetch(`/api/v1/calendar/monthly?userId=${userId}&date=${date}`);
    },
    
    getDaily: async (userId, date) => {
        return authFetch(`/api/v1/calendar/daily?userId=${userId}&date=${date}`);
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

// 프로필 API
const profileApi = {
    // 내 프로필 조회
    getMyProfile: async (userId) => {
        return authFetch(`/api/v1/profile/me?userId=${userId}`);
    },
    
    // 프로필 업데이트
    updateProfile: async (userId, data) => {
        return authFetch(`/api/v1/profile/update?userId=${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // 공개 설정 변경
    updatePrivacy: async (userId, data) => {
        return authFetch(`/api/v1/profile/me/privacy?userId=${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
};

// 친구 API
const friendApi = {
    // 친구/사용자 검색
    search: async (currentUserId, keyword) => {
        return authFetch(`/api/v1/friends/search?currentUserId=${currentUserId}&keyword=${encodeURIComponent(keyword)}`);
    },
    
    // 친구 목록 조회
    getList: async (userId) => {
        return authFetch(`/api/v1/friends?userId=${userId}`);
    },
    
    // 친구 요청 보내기
    sendRequest: async (fromUserId, toUserId) => {
        return authFetch('/api/v1/friends/requests', {
            method: 'POST',
            body: JSON.stringify({ fromUserId, toUserId })
        });
    },
    
    // 받은 친구 요청 목록 조회
    getReceivedRequests: async (userId) => {
        return authFetch(`/api/v1/friends/requests?userId=${userId}`);
    },
    
    // 보낸 친구 요청 목록 조회
    getSentRequests: async (userId) => {
        return authFetch(`/api/v1/friends/requests/sent?userId=${userId}`);
    },
    
    // 보낸 친구 요청 취소
    cancelRequest: async (requestId) => {
        return authFetch(`/api/v1/friends/requests/${requestId}/cancel`, {
            method: 'DELETE'
        });
    },
    
    // 친구 요청 수락
    acceptRequest: async (requestId) => {
        return authFetch(`/api/v1/friends/requests/${requestId}/accept`, {
            method: 'POST'
        });
    },
    
    // 친구 요청 거절
    declineRequest: async (requestId) => {
        return authFetch(`/api/v1/friends/requests/${requestId}/decline`, {
            method: 'POST'
        });
    },
    
    // 친구 삭제
    deleteFriend: async (userId, friendUserId) => {
        return authFetch(`/api/v1/friends/${friendUserId}?userId=${userId}`, {
            method: 'DELETE'
        });
    },
    
    // 친구 차단
    block: async (userId, targetUserId) => {
        return authFetch(`/api/v1/friends/block?userId=${userId}&targetUserId=${targetUserId}`, {
            method: 'POST'
        });
    },
    
    // 차단 해제
    unblock: async (userId, targetUserId) => {
        return authFetch(`/api/v1/friends/unblock?userId=${userId}&targetUserId=${targetUserId}`, {
            method: 'POST'
        });
    },
    
    // 차단 목록 조회
    getBlockedUsers: async (userId) => {
        return authFetch(`/api/v1/friends/blocked?userId=${userId}`);
    }
};
