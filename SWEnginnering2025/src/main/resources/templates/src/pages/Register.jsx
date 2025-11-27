const { useState } = React;

// 회원가입 페이지 컴포넌트
const Register = () => {
    const [form, setForm] = useState({
        userId: '',
        nickname: '',
        email: '',
        password: '',
        passwordConfirm: '',
        birth: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (form.password !== form.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await authApi.register(form);
            tokenManager.saveTokens(result);
            window.location.href = '/home.html';
        } catch (err) {
            if (err.status === 409) {
                setError('이미 가입된 이메일입니다.');
            } else if (err.status === 400) {
                setError(err.message || '입력 정보를 확인해주세요.');
            } else {
                setError('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* 로고 */}
                <div className="logo-section">
                    <div className="logo-circle">
                        <svg viewBox="0 0 24 24" className="logo-icon">
                            <path d="M12 2L9 9H2L7.5 13.5L5.5 21L12 16.5L18.5 21L16.5 13.5L22 9H15L12 2Z" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                    </div>
                    <h1 className="app-title">SelfGrow</h1>
                    <p className="app-subtitle">함께 성장하는 소셜 자기개발 플랫폼</p>
                </div>

                {/* 탭 */}
                <div className="tab-container">
                    <button className="tab-button" onClick={() => window.location.href = '/index.html'}>
                        로그인
                    </button>
                    <button className="tab-button active">회원가입</button>
                </div>

                {/* 에러 메시지 */}
                {error && <div className="error-message">{error}</div>}

                {/* 회원가입 폼 */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>사용자 ID</label>
                        <input
                            type="text"
                            name="userId"
                            placeholder="사용자ID"
                            value={form.userId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>닉네임</label>
                        <input
                            type="text"
                            name="nickname"
                            placeholder="닉네임"
                            value={form.nickname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            name="passwordConfirm"
                            placeholder="••••••••"
                            value={form.passwordConfirm}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>생년월일</label>
                        <input
                            type="date"
                            name="birth"
                            value={form.birth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? <><span className="spinner"></span>가입 중...</> : '회원가입'}
                    </button>
                </form>

                {/* 로그인 링크 */}
                <div className="forgot-password">
                    <span>이미 계정이 있으신가요? </span>
                    <a href="/index.html">로그인</a>
                </div>
            </div>
        </div>
    );
};

window.Register = Register;

