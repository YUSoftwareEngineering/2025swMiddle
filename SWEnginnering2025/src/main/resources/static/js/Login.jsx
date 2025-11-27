const { useState } = React;

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await authApi.login(form.email, form.password);
            tokenManager.save(result);
            window.location.href = '/home.html';
        } catch (err) {
            setError(err.status === 401 
                ? '아이디 또는 비밀번호가 올바르지 않습니다.' 
                : '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocial = (provider) => alert(`${provider} 로그인은 추후 구현 예정입니다.`);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo-section">
                    <div className="logo-circle">
                        <svg viewBox="0 0 24 24" className="logo-icon">
                            <path d="M12 2L9 9H2L7.5 13.5L5.5 21L12 16.5L18.5 21L16.5 13.5L22 9H15L12 2Z" />
                        </svg>
                    </div>
                    <h1 className="app-title">SelfGrow</h1>
                    <p className="app-subtitle">함께 성장하는 소셜 자기개발 플랫폼</p>
                </div>

                <div className="tab-container">
                    <button className="tab-button active">로그인</button>
                    <button className="tab-button" onClick={() => location.href='/register.html'}>회원가입</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>사용자 ID 또는 이메일</label>
                        <input type="text" name="email" placeholder="ID 또는 이메일" 
                            value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input type="password" name="password" placeholder="••••" 
                            value={form.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? <><span className="spinner"></span>로그인 중...</> : '로그인'}
                    </button>
                </form>

                <div className="forgot-password">
                    <a href="/forgot-password.html">비밀번호를 잊으셨나요?</a>
                </div>

                <div className="social-section">
                    <p className="social-divider">또는 다른 계정으로 로그인</p>
                    <div className="social-buttons">
                        <button className="social-btn google" onClick={() => handleSocial('Google')}>
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Google</span>
                        </button>
                        <button className="social-btn kakao" onClick={() => handleSocial('Kakao')}>
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.87 5.33 4.67 6.77l-.95 3.53c-.08.29.26.52.5.34l4.09-2.74c.55.07 1.11.1 1.69.1 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                            </svg>
                            <span>Kakao</span>
                        </button>
                        <button className="social-btn naver" onClick={() => handleSocial('Naver')}>
                            <span className="naver-icon">N</span>
                            <span>Naver</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

