const tokenManager = {
    // 유효한 값인지 검사
    _isValid(value) {
        return value && value !== 'null' && value !== 'undefined' && String(value).trim() !== '';
    },

    // 토큰 데이터 저장 (accessToken, refreshToken, nickname, userId, loginId)
    save(data) {
        if (this._isValid(data.accessToken)) {
            localStorage.setItem('accessToken', String(data.accessToken).trim());
        }
        if (this._isValid(data.refreshToken)) {
            localStorage.setItem('refreshToken', String(data.refreshToken).trim());
        }
        if (this._isValid(data.nickname)) {
            localStorage.setItem('nickname', data.nickname);
        }
        if (this._isValid(data.userId)) {
            localStorage.setItem('userId', String(data.userId));
        }
        if (this._isValid(data.loginId)) {
            localStorage.setItem('loginId', data.loginId);
        }
    },

    // accessToken 가져오기
    getAccessToken() {
        const token = localStorage.getItem('accessToken');
        // 모든 공백/줄바꿈 제거
        return this._isValid(token) ? token.replace(/\s+/g, '') : null;
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
    }
};
