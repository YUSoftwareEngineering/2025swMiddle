const { useState, useEffect } = React;

// 홈 페이지 컴포넌트
const Home = () => {
    const [nickname, setNickname] = useState('사용자');

    useEffect(() => {
        // 인증 확인
        if (!tokenManager.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }
        setNickname(tokenManager.getNickname() || '사용자');
    }, []);

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        tokenManager.clearTokens();
        window.location.href = '/index.html';
    };

    const features = [
        {
            icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
            title: '목표 관리',
            description: '단기/장기 목표를 설정하고 진행 상황을 추적하세요.',
            link: '/goals.html'
        },
        {
            icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
            title: '집중 세션',
            description: '뽀모도로 타이머로 집중력을 높이고 생산성을 향상시키세요.',
            link: '/focus.html'
        },
        {
            icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
            title: '실패 기록',
            description: '실패를 기록하고 분석하여 성장의 발판으로 삼으세요.',
            link: '/failure-log.html'
        },
        {
            icon: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z',
            title: '캘린더',
            description: '일정과 목표를 캘린더에서 한눈에 확인하세요.',
            link: '/calendar.html'
        }
    ];

    return (
        <div className="home-container">
            <Header nickname={nickname} onLogout={handleLogout} />
            
            <main className="main-content">
                <div className="welcome-card">
                    <h1 className="welcome-title">오늘도 함께 성장해요! 🌱</h1>
                    <p className="welcome-subtitle">
                        목표를 설정하고 집중하며, 실패에서 배우는 여정을 시작하세요.
                    </p>
                </div>

                <div className="feature-grid">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="feature-card"
                            onClick={() => window.location.href = feature.link}
                        >
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d={feature.icon} />
                                </svg>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

window.Home = Home;

