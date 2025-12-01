const { useState } = React;

const Register = () => {
    const [form, setForm] = useState({
        email: '',
        userId: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
        birth: ''
    });
    const [loading, setLoading] = useState(false);
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

        setLoading(true);
        setError('');

        try {
            const result = await authApi.register({
                userId: form.userId,
                nickname: form.nickname,
                email: form.email,
                password: form.password,
                passwordConfirm: form.passwordConfirm,
                birth: form.birth
            });

            // 서버에서 JWT 받으면 저장
            TokenManager.save(result);

            // 홈 페이지 이동
            window.location.href = '/home.html';
        } catch (err) {
            console.log('회원가입 에러:', err.status, err.message);
            if (err.status === 409) {
                setError(err.message || '이미 가입된 이메일입니다.');
            } else if (err.status === 400) {
                setError(err.message || '입력 정보를 확인해주세요.');
            } else {
                setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

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
                    <button className="tab-button" onClick={() => location.href='/index.html'}>로그인</button>
                    <button className="tab-button active">회원가입</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>이메일</label>
                        <input type="email" name="email" placeholder="example@email.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>사용자명 (ID)</label>
                        <input type="text" name="userId" placeholder="username123" value={form.userId} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>닉네임</label>
                        <input type="text" name="nickname" placeholder="표시될 이름" value={form.nickname} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>비밀번호 확인</label>
                        <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>생년월일</label>
                        <input type="date" name="birth" value={form.birth} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? <><span className="spinner"></span>가입 중...</> : '회원가입'}
                    </button>
                </form>

                <div className="forgot-password">
                    <span>이미 계정이 있으신가요? </span>
                    <a href="/index.html">로그인</a>
                </div>
            </div>
        </div>
    );
};

window.Register = Register;