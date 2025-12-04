const { useState, useEffect } = React;

/* ================================
   Sidebar 컴포넌트
================================ */
const Sidebar = ({ sidebarUser }) => {
    const menuItems = [
        { icon: '📅', label: '캘린더', path: '/calendar.html' },
        { icon: '👥', label: '친구', path: '/friends.html' },
        { icon: '🎯', label: '목표방', path: '/goals.html' },
        { icon: '💬', label: '메시지', path: '/messages.html' },
        { icon: '📊', label: '실패 분석', path: '/analysis.html' },
        { icon: '🤖', label: 'AI 학습봇', path: '/ai.html' },
        { icon: '⏱️', label: '포커스 모드', path: '/focus.html' },
        { icon: '🎮', label: '캐릭터', path: '/character.html' },
    ];

    if (!sidebarUser)
        return <aside className="sidebar">Loading...</aside>;

    const nickname = sidebarUser.nickname || "로딩 중...";
    const userTag = sidebarUser.userTag || sidebarUser.userId || "user";

    const level = sidebarUser.level ?? 1;
    const xp = sidebarUser.xp ?? 0;
    const xpForNextLevel = 1000;
    const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100);

    return (
        <aside className="sidebar">
            <div className="sidebar-profile">
                <div className="profile-avatar">
                    {sidebarUser.avatarUrl ? (
                        <img
                            src={sidebarUser.avatarUrl}
                            alt={nickname}
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                        />
                    ) : (
                        nickname.charAt(0).toUpperCase()
                    )}
                </div>

                <div className="profile-info">
                    <div className="profile-name">{nickname}</div>
                    <div className="profile-id">@{userTag}</div>
                </div>
            </div>

            <div className="sidebar-level">
                <span>Lv.{level}</span>
                <div className="level-bar">
                    <div className="level-progress" style={{ width: `${xpProgress}%` }} />
                </div>
                <span>{xp} XP</span>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <a
                        key={item.path}
                        href={item.path}
                        className={`menu-item ${
                            window.location.pathname === item.path ? "active" : ""
                        }`}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="sidebar-footer">
                <a href="/profile.html" className="menu-item">
                    <span className="menu-icon">👤</span> 프로필
                </a>
                <a href="/settings.html" className="menu-item">
                    <span className="menu-icon">⚙️</span> 설정
                </a>
            </div>
        </aside>
    );
};

/* ================================
   프로필 페이지
================================ */
function ProfilePage() {
    const [sidebarUser, setSidebarUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);

    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState("");
    const [nickname, setNickname] = useState("");
    const [profilePublic, setProfilePublic] = useState(false);
    const [activityPublic, setActivityPublic] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");

    const [goalsCount, setGoalsCount] = useState(0);
    const [recentGoals, setRecentGoals] = useState([]);

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    /* -----------------------------
        공통 유틸
    ----------------------------- */
    const getMyId = () => TokenManager.getUserId();
    const getToken = () => TokenManager.getAccessToken();

    const getTargetUserIdFromQuery = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("userId");
    };

    /* -----------------------------
        1) Sidebar 프로필
    ----------------------------- */
    async function fetchSidebarProfile() {
        try {
            const myId = getMyId();
            const token = getToken();
            if (!myId || !token) return;

            const res = await fetch(`/api/v1/profile/me?userId=${myId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) return;
            const data = await res.json();
            setSidebarUser(data);

        } catch (e) {
            console.error("사이드바 프로필 조회 에러", e);
        }
    }

    /* -----------------------------
        2) 메인 카드 프로필(나 or 친구)
    ----------------------------- */
    async function fetchProfileCard() {
        try {
            const myId = getMyId();
            const token = getToken();

            if (!myId || !token) {
                setMessage("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            const targetUserId = getTargetUserIdFromQuery();
            let url;

            if (targetUserId && Number(targetUserId) !== Number(myId)) {
                url = `/api/v1/profile/public/${encodeURIComponent(targetUserId)}`;
            } else {
                url = `/api/v1/profile/me?userId=${myId}`;
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                if (res.status === 403) setMessage("비공개 프로필입니다.");
                else if (res.status === 404) setMessage("존재하지 않는 사용자입니다.");
                else setMessage("프로필 정보를 불러올 수 없습니다.");
                setLoading(false);
                return;
            }

            const data = await res.json();
            setProfileUser(data);

            setBio(data.bio || "");
            setNickname(data.nickname || "");
            setAvatarUrl(data.avatarUrl || "");
            setProfilePublic(!!data.profilePublic);
            setActivityPublic(!!data.activityPublic);

        } catch (e) {
            console.error("프로필 조회 에러", e);
        } finally {
            setLoading(false);
        }
    }

    /* -----------------------------
        3) 목표 통계
    ----------------------------- */
    async function fetchGoalStats() {
        try {
            const token = getToken();
            if (!token) return;

            const res = await fetch(`/api/v1/goals/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) return;

            const data = await res.json();
            setGoalsCount(data.total_completed || 0);
            setRecentGoals(data.recent_completed || []);

        } catch (e) {
            console.error("목표 통계 에러", e);
        }
    }

    /* -----------------------------
        4) 프로필 저장
    ----------------------------- */
    async function saveProfile() {
        try {
            const myId = getMyId();
            const token = getToken();

            const res = await fetch(`/api/v1/profile/update?userId=${myId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nickname,
                    avatarUrl,
                    bio,
                    profilePublic,
                    activityPublic,
                }),
            });

            if (!res.ok) {
                setMessage("프로필 저장 실패");
                return;
            }

            setMessage("프로필 저장 완료!");
            setEditMode(false);
            fetchSidebarProfile();
            fetchProfileCard();

        } catch (e) {
            console.error("프로필 저장 에러", e);
        }
    }

    /* -----------------------------
        5) 계정 삭제
    ----------------------------- */
    async function handleDelete() {
        if (!password) {
            setMessage("비밀번호를 입력해주세요");
            return;
        }

        try {
            const token = getToken();

            const res = await fetch(`/api/auth/withdraw`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                setMessage("계정 삭제 실패");
                return;
            }

            alert("계정이 삭제되었습니다.");
            TokenManager.clear();
            window.location.href = "/";

        } catch (e) {
            console.error("계정 삭제 에러", e);
        }
    }

    /* -----------------------------
       마운트 시 로딩
    ----------------------------- */
    useEffect(() => {
        fetchSidebarProfile();
        fetchProfileCard();
        fetchGoalStats();
    }, []);

    /* ================================
       렌더링
    ================================= */
    if (loading)
        return <div className="loading">Loading...</div>;

    if (!profileUser)
        return <div className="error-message">{message || "프로필 정보를 불러올 수 없습니다."}</div>;

    const isMyProfile =
        getTargetUserIdFromQuery() == null ||
        Number(getTargetUserIdFromQuery()) === Number(getMyId());

    return (
        <div className="app-container">
            <Sidebar sidebarUser={sidebarUser} />

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

                    {/* ---------------- 프로필 카드 ---------------- */}
                    <div className="profile-card">
                        <div className="profile-header">
                            <h2>기본 정보</h2>

                            {isMyProfile && !editMode && (
                                <button className="edit-btn" onClick={() => setEditMode(true)}>
                                    수정
                                </button>
                            )}
                        </div>

                        {/* 수정 모드 */}
                        {isMyProfile && editMode ? (
                            <div className="profile-form">

                                <label>프로필 이미지 URL</label>
                                <input
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                />

                                <label>닉네임</label>
                                <input
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />

                                <label>소개글</label>
                                <textarea
                                    rows={3}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />

                                <div className="toggle-row">
                                    <label>프로필 공개</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={profilePublic}
                                            onChange={(e) => setProfilePublic(e.target.checked)}
                                        />
                                        <span className="slider" />
                                    </label>
                                </div>

                                <div className="toggle-row">
                                    <label>활동 공개</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={activityPublic}
                                            onChange={(e) => setActivityPublic(e.target.checked)}
                                        />
                                        <span className="slider" />
                                    </label>
                                </div>

                                <button className="save-btn" onClick={saveProfile}>
                                    저장
                                </button>
                            </div>
                        ) : (
                            /* 보기 모드 */
                            <div className="profile-info">
                                <div className="profile-avatar-display">
                                    {profileUser.avatarUrl ? (
                                        <img
                                            src={profileUser.avatarUrl}
                                            alt={profileUser.nickname}
                                        />
                                    ) : (
                                        <div className="avatar-placeholder" />
                                    )}
                                </div>

                                <div><b>닉네임:</b> {profileUser.nickname}</div>
                                <div>
                                    <b>소개글:</b>{" "}
                                    {profileUser.bio && profileUser.bio.length > 0
                                        ? profileUser.bio
                                        : "작성된 소개글이 없습니다."}
                                </div>

                                {isMyProfile && (
                                    <>
                                        <div><b>프로필 공개:</b> {profilePublic ? "공개" : "비공개"}</div>
                                        <div><b>활동 공개:</b> {activityPublic ? "공개" : "비공개"}</div>
                                    </>
                                )}
                            </div>
                        )}

                        {message && (
                            <div
                                className={
                                    message.includes("실패") || message.includes("에러")
                                        ? "error-message"
                                        : "success-message"
                                }
                            >
                                {message}
                            </div>
                        )}

                        {isMyProfile && (
                            <button className="btn-delete" onClick={() => setModalOpen(true)}>
                                계정 삭제
                            </button>
                        )}
                    </div>

                    {/* ---------------- 목표 통계 ---------------- */}
                    <div className="stats-card">
                        <h3>내 목표 통계</h3>
                        <p><b>총 목표 달성 수:</b> {goalsCount}</p>

                        <h4>최근 달성한 목표</h4>
                        <ul className="stats-list">
                            {recentGoals.length === 0 ? (
                                <p>최근 완료한 목표가 없습니다.</p>
                            ) : (
                                recentGoals.map((g) => <li key={g.id}>{g.title}</li>)
                            )}
                        </ul>
                    </div>
                </div>

                {/* ---------------- 삭제 모달 ---------------- */}
                {modalOpen && (
                    <div className="modal-bg">
                        <div className="modal">
                            <h3>비밀번호 확인</h3>

                            <input
                                type="password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button className="btn-delete" onClick={handleDelete}>삭제</button>
                            <button
                                className="btn-cancel"
                                onClick={() => {
                                    setModalOpen(false);
                                    setPassword("");
                                }}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

/* ================================
   React DOM Render
================================ */
ReactDOM.createRoot(document.getElementById("root")).render(<ProfilePage />);
