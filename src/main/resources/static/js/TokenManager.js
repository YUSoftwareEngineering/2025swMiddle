// TokenManager.js
const TokenManager = {
    // 토큰 데이터 저장 (accessToken, refreshToken, nickname, userId, loginId)
    save(data) {
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.nickname) {
            localStorage.setItem('nickname', data.nickname);
        }
        if (data.userId) {
            localStorage.setItem('userId', String(data.userId));
        }
        if (data.loginId) {
            localStorage.setItem('loginId', data.loginId);
        }
    },

    // accessToken 가져오기
    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    // refreshToken 가져오기
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    // 닉네임 가져오기
    getNickname() {
        return localStorage.getItem('nickname');
    },

    // 사용자 ID 가져오기
    getUserId() {
        const id = localStorage.getItem('userId');
        return id ? parseInt(id, 10) : null;
    },

    // 로그인 ID 가져오기 (문자열)
    getLoginId() {
        return localStorage.getItem('loginId');
    },

    // 로그인 여부 확인
    isLoggedIn() {
        return !!localStorage.getItem('accessToken');
    },

    // 모든 토큰 데이터 삭제 (로그아웃)
    clear() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('nickname');
        localStorage.removeItem('userId');
        localStorage.removeItem('loginId');
    },

    // 기존 호환성을 위한 get 메서드 (accessToken 반환)
    get() {
        return localStorage.getItem('accessToken');
    },

    // 새로 추가: getToken() 메서드 (기존 코드 호환)
    getToken() {
        return this.get();
    }
};

// 브라우저 전역에서 접근 가능하게 설정
window.TokenManager = TokenManager;