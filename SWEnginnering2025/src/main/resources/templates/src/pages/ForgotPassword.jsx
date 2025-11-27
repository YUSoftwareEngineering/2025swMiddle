const { useState } = React;

// 비밀번호 찾기 페이지 컴포넌트
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await authApi.requestPasswordReset(email);
            setSuccess('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
        } catch (err) {
            setError('이메일 전송에 실패했습니다. 이메일 주소를 확인해주세요.');
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
                    <p className="app-subtitle">비밀번호 찾기</p>
                </div>

                {/* 설명 */}
                <p className="auth-description">
                    가입하신 이메일 주소를 입력하시면<br />
                    비밀번호 재설정 링크를 보내드립니다.
                </p>

                {/* 에러/성공 메시지 */}
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {/* 폼 */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? <><span className="spinner"></span>전송 중...</> : '재설정 링크 받기'}
                    </button>
                </form>

                {/* 로그인 링크 */}
                <div className="forgot-password">
                    <a href="/index.html">← 로그인으로 돌아가기</a>
                </div>
            </div>
        </div>
    );
};

window.ForgotPassword = ForgotPassword;

