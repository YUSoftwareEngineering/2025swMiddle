// 인증 API
const authApi = {
    login: async (email, password) => {
        return await api.post('/auth/login', { email, password });
    },
    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },
    logout: async () => {
        return await api.post('/auth/logout');
    },
};

// 토큰 관리
const tokenManager = {
    saveTokens: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('nickname', data.nickname);
    },
    getAccessToken: () => localStorage.getItem('accessToken'),
    getNickname: () => localStorage.getItem('nickname'),
    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('nickname');
    },
    isLoggedIn: () => !!localStorage.getItem('accessToken'),
};

window.authApi = authApi;
window.tokenManager = tokenManager;
