// Axios 인스턴스 설정
const API_BASE_URL = '/api';

// 토큰 가져오기
const getAccessToken = () => localStorage.getItem('accessToken');

// API 요청 함수
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAccessToken();

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
        const error = new Error('API Error');
        error.status = response.status;
        try {
            error.message = await response.text();
        } catch {
            error.message = response.statusText;
        }
        throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

// HTTP 메서드 헬퍼
const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (endpoint, data) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

window.api = api;
