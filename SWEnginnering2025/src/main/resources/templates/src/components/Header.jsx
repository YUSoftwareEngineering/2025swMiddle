// 헤더 컴포넌트
const Header = ({ nickname, onLogout }) => {
    return (
        <header className="header">
            <div className="header-logo" onClick={() => window.location.href = '/index.html'}>
                <div className="header-logo-circle">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L9 9H2L7.5 13.5L5.5 21L12 16.5L18.5 21L16.5 13.5L22 9H15L12 2Z" />
                    </svg>
                </div>
                <span className="header-title">SelfGrow</span>
            </div>
            <div className="header-user">
                {nickname && (
                    <span className="user-greeting">
                        안녕하세요, <strong>{nickname}</strong>님!
                    </span>
                )}
                {onLogout && (
                    <button className="logout-btn" onClick={onLogout}>
                        로그아웃
                    </button>
                )}
            </div>
        </header>
    );
};

window.Header = Header;

