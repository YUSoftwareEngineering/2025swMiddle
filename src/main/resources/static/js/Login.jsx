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
            const result = await authApi.login(form);
            TokenManager.save(result);
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
                        <button className="social-btn google" onClick={() => handleSocial('Google')}>Google</button>
                        <button className="social-btn kakao" onClick={() => handleSocial('Kakao')}>Kakao</button>
                        <button className="social-btn naver" onClick={() => handleSocial('Naver')}>Naver</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
