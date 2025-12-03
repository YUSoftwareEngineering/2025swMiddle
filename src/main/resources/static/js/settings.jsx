const { useState, useEffect } = React;

const Sidebar = ({ profile }) => {
  const menuItems = [
    { icon: '📅', label: '캘린더', path: '/home.html' },
    { icon: '👥', label: '친구', path: '/friends.html' },
    { icon: '🎯', label: '목표방', path: '/goals.html' },
    { icon: '💬', label: '메시지', path: '/messages.html' },
    { icon: '📊', label: '실패 분석', path: '/analysis.html' },
    { icon: '🤖', label: 'AI 학습봇', path: '/ai.html' },
    { icon: '⏱️', label: '포커스 모드', path: '/focus.html' },
    { icon: '🎮', label: '캐릭터', path: '/character.html' },
  ];

  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const xpProgress = Math.min((xp / 1000) * 100, 100);

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-avatar">{profile?.nickname?.charAt(0) || '?'}</div>
        <div className="profile-info">
          <div className="profile-name">{profile?.nickname || '로딩 중...'}</div>
          <div className="profile-id">@{profile?.userId || 'user'}</div>
        </div>
      </div>
      <div className="sidebar-level">
        <span>Lv.{level}</span>
        <div className="level-bar">
          <div className="level-progress" style={{ width: `${xpProgress}%` }}></div>
        </div>
        <span>{xp} XP</span>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item, i) => (
          <a key={i} href={item.path} className="menu-item">
            <span className="menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <a href="/profile.html" className="menu-item"><span className="menu-icon">👤</span><span>프로필</span></a>
        <a href="/settings.html" className="menu-item active"><span className="menu-icon">⚙️</span><span>설정</span></a>
      </div>
    </aside>
  );
};

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    nickname: TokenManager.getNickname(),
    userId: TokenManager.getUserId(),
    level: 1,
    xp: 0
  });
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/settings/${profile.userId}`, {
      headers: {
        "Authorization": "Bearer " + TokenManager.getToken(),
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setIsNotificationEnabled(data.isNotificationEnabled))
      .catch(err => console.error(err));
  }, [profile.userId]);

  const handleNotificationToggle = () => {
    const newValue = !isNotificationEnabled;
    setIsNotificationEnabled(newValue); // UI 즉시 반영

    console.log("PUT 요청 보내기:", newValue);

    fetch(`/api/v1/settings/${profile.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + TokenManager.getToken()
      },
      body: JSON.stringify({ isNotificationEnabled: newValue })
    })
      .then(async (res) => {
        console.log("Response status:", res.status);
        let data;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok) {
          console.error("Response data:", data);
          throw new Error(data?.message || `업데이트 실패 (status ${res.status})`);
        }

        console.log("알림 설정 업데이트 성공:", data);
      })
      .catch((err) => {
        alert('알림 설정 업데이트 실패: ' + err.message);
        setIsNotificationEnabled(!newValue); // UI 상태 원복
        console.error("PUT 요청 에러:", err);
      });
  };

  return (
    <div className="focus-layout">
      <Sidebar profile={profile} />
      <main className="focus-main">
        <div className="focus-header">
          <div className="focus-title">
            <span className="title-icon">⚙️</span>
            <div>
              <h1>설정</h1>
              <p>앱 환경을 편리하게 조정하세요</p>
            </div>
          </div>
        </div>

        <div className="timer-card">
          <div className="timer-card-header">
            <h2>알림 설정</h2>
          </div>
          <div className="timer-controls">
            <label className="switch">
              <input
                type="checkbox"
                checked={isNotificationEnabled}
                onChange={handleNotificationToggle}
              />
              <span className="slider round"></span>
            </label>
            <span style={{ marginLeft: "12px" }}>
              알림 받기 {isNotificationEnabled ? "✅" : "❌"}
            </span>
          </div>
        </div>

        <div className="timer-card">
          <div className="timer-card-header">
            <h2>친구 관리</h2>
          </div>
          <button className="timer-start-btn" onClick={() => window.location.href="/friends.html"}>
            친구 요청 확인
          </button>
        </div>

        <div className="timer-card">
          <div className="timer-card-header">
            <h2>개발자 정보</h2>
          </div>
          <p>이름: 홍길동</p>
          <p>이메일: dev@example.com</p>
        </div>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<SettingsPage />);
