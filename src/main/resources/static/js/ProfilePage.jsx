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
        { icon: '🎮', label: '캐릭터', path: '/character.html' }
    ];

    const level = profile?.level || 1;
    const xp = profile?.xp || 0;
    const xpForNextLevel = 1000;
    const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100);

    return (
        <aside className="sidebar">
            <div className="sidebar-profile">
                <div className="profile-avatar">
                    {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile.nickname} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
                    ) : (
                        profile?.nickname?.charAt(0) || '?'
                    )}
                </div>
                <div className="profile-info">
                    <div className="profile-name">{profile?.nickname || '로딩 중...'}</div>
                    <div className="profile-id">@{profile?.userId || 'user'}</div>
                </div>
            </div>
            <div className="sidebar-level">
                <span>Lv.{level}</span>
                <div className="level-bar">
                    <div className="level-progress" style={{width: `${xpProgress}%`}}></div>
                </div>
                <span>{xp} XP</span>
            </div>
            <nav className="sidebar-menu">
                {menuItems.map((item, i) => (
                    <a key={i} href={item.path} className={`menu-item ${window.location.pathname===item.path ? 'active' : ''}`}>
                        <span className="menu-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
            <div className="sidebar-footer">
                <a href="/profile.html" className="menu-item"><span className="menu-icon">👤</span><span>프로필</span></a>
                <a href="/settings.html" className="menu-item"><span className="menu-icon">⚙️</span><span>설정</span></a>
            </div>
        </aside>
    );
};

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState("");
    const [nickname, setNickname] = useState("");
    const [profilePublic, setProfilePublic] = useState(false);
    const [activityPublic, setActivityPublic] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [goalsCount, setGoalsCount] = useState(0);
    const [recentGoals, setRecentGoals] = useState([]);
    const [message, setMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
        fetchGoalStats();
    }, []);

    async function fetchProfile() {
        try {
            const userId = TokenManager.getUserId();
            const token = TokenManager.getAccessToken();
            if (!token || !userId) return;

            const res = await fetch(`/api/v1/profile/me?userId=${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) { setMessage("프로필 조회 실패"); return; }
            const data = await res.json();

            setUser(data);
            setBio(data.bio || "");
            setNickname(data.nickname || "");
            setProfilePublic(data.profile_public);
            setActivityPublic(data.activity_public);
            setAvatarUrl(data.avatarUrl || "");
        } catch (e) {
            console.error(e);
            setMessage("프로필 조회 중 에러");
        } finally {
            setLoading(false);
        }
    }

    async function fetchGoalStats() {
        try {
            const token = TokenManager.getAccessToken();
            const res = await fetch(`/api/v1/goals/stats`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            setGoalsCount(data.total_completed);
            setRecentGoals(data.recent_completed || []);
        } catch (e) {
            console.error(e);
        }
    }

    async function saveProfile() {
        try {
            const userId = TokenManager.getUserId();
            const token = TokenManager.getAccessToken();
            const res = await fetch(`/api/v1/profile/update?userId=${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nickname, avatarUrl, bio, profilePublic, activityPublic })
            });
            if (!res.ok) { setMessage("프로필 저장 실패"); return; }
            setMessage("프로필 저장 완료!");
            setEditMode(false);
            fetchProfile();
        } catch (e) {
            console.error(e);
            setMessage("프로필 저장 중 에러");
        }
    }

    async function handleDelete() {
        if (!password) { setMessage("비밀번호를 입력해주세요"); return; }
        try {
            const token = TokenManager.getAccessToken();
            const res = await fetch(`/api/auth/withdraw`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ password })
            });
            if (!res.ok) { setMessage("계정 삭제 실패"); return; }
            alert("계정이 삭제되었습니다.");
            TokenManager.clear();
            window.location.href = "/";
        } catch (e) {
            console.error(e);
            setMessage("계정 삭제 중 에러");
        }
    }

    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <div className="error-message">프로필 정보를 불러올 수 없습니다.</div>;

    return (
        <div className="app-container">
            <Sidebar profile={user} />

            <main className="main-content">
                <div className="page-header">
                    <div className="page-title">
                        <span className="title-icon">👤</span>
                        <div>
                            <h1>프로필</h1>
                            <p>나의 정보와 목표 현황을 확인하세요</p>
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="profile-card">
                        <div className="profile-header">
                            <h2>기본 정보</h2>
                            {!editMode && <button className="edit-btn" onClick={()=>setEditMode(true)}>수정</button>}
                        </div>

                        {editMode ? (
                            <div className="profile-form">
                                <div className="profile-avatar-edit">
                                    <input placeholder="프로필 이미지 URL" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} />
                                </div>

                                <label>닉네임</label>
                                <input value={nickname} onChange={e=>setNickname(e.target.value)} />

                                <label>소개글</label>
                                <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} />

                                <label>
                                    프로필 공개
                                    <label className="switch">
                                        <input type="checkbox" checked={profilePublic} onChange={e=>setProfilePublic(e.target.checked)} />
                                        <span className="slider"></span>
                                    </label>
                                </label>

                                <label>
                                    활동 공개
                                    <label className="switch">
                                        <input type="checkbox" checked={activityPublic} onChange={e=>setActivityPublic(e.target.checked)} />
                                        <span className="slider"></span>
                                    </label>
                                </label>

                                <button className="save-btn" onClick={saveProfile}>저장</button>
                            </div>
                        ) : (
                            <div className="profile-info">
                                <div style={{textAlign:'center', marginBottom:'12px'}}>
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={nickname} style={{width:'120px', height:'120px', borderRadius:'12px', objectFit:'cover'}} />
                                    ) : (
                                        <div style={{width:'120px', height:'120px', background:'#ccc', borderRadius:'12px', display:'inline-block'}}></div>
                                    )}
                                </div>
                                <div><b>닉네임:</b> {nickname}</div>
                                <div><b>소개글:</b> {bio || "작성된 소개글이 없습니다."}</div>
                                <div><b>프로필 공개:</b> {profilePublic ? "공개" : "비공개"}</div>
                                <div><b>활동 공개:</b> {activityPublic ? "공개" : "비공개"}</div>
                            </div>
                        )}

                        {message && <div className={message.includes("실패")?"error-message":"success-message"}>{message}</div>}

                        <button className="btn-delete" onClick={()=>setModalOpen(true)}>계정 삭제</button>
                    </div>

                    <div className="stats-card">
                        <h3>내 목표 통계</h3>
                        <p><b>총 목표 달성 수:</b> {goalsCount}</p>

                        <h4>최근 달성한 목표</h4>
                        <ul className="stats-list">
                            {recentGoals.length===0 ? <p>최근 완료한 목표가 없습니다.</p> :
                              recentGoals.map(g=><li key={g.id}>{g.title}</li>)}
                        </ul>
                    </div>
                </div>

                {modalOpen && (
                    <div className="modal-bg">
                        <div className="modal">
                            <h3>비밀번호 확인</h3>
                            <input type="password" placeholder="비밀번호 입력" value={password} onChange={e=>setPassword(e.target.value)} />
                            <button className="btn-delete" onClick={handleDelete}>삭제</button>
                            <button className="btn-cancel" onClick={()=>{setModalOpen(false); setPassword("");}}>취소</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProfilePage />);