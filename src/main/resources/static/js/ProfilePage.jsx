const { useState, useEffect } = React;

<<<<<<< HEAD
// Sidebar 컴포넌트 (친구 페이지 스타일을 반영하여 구조 정리)
const Sidebar = ({ profile }) => {
=======
const Sidebar = ({ sidebarUser }) => {
>>>>>>> origin/YHW2
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

    const nickname = sidebarUser?.nickname || '로딩 중...';
    const userTag = sidebarUser?.userTag || sidebarUser?.userId || 'user';

    const level = sidebarUser?.level ?? 1;
    const xp    = sidebarUser?.xp ?? 0;
    const xpForNextLevel = 1000;
    const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100);

    // 현재 경로가 프로필 페이지이므로, 프로필 메뉴를 'active'로 설정합니다.
    const isProfileActive = window.location.pathname === '/profile.html' || window.location.pathname === '/profile';

    return (
        <aside className="sidebar">
            <div className="sidebar-profile">
                <div className="profile-avatar">
                    {sidebarUser?.avatarUrl ? (
                        <img
                            src={sidebarUser.avatarUrl}
                            alt={nickname}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '12px',
                            }}
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
<<<<<<< HEAD
            {/* 레벨 바 구조 변경: CSS에 맞게 조정 */}
=======

>>>>>>> origin/YHW2
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
                            window.location.pathname === item.path ? 'active' : ''
                        }`}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="sidebar-footer">
<<<<<<< HEAD
                <a href="/profile.html" className={`menu-item ${isProfileActive ? 'active' : ''}`}><span className="menu-icon">👤</span><span>프로필</span></a>
                <a href="/settings.html" className="menu-item"><span className="menu-icon">⚙️</span><span>설정</span></a>
=======
                <a href="/profile.html" className="menu-item">
                    <span className="menu-icon">👤</span>
                    <span>프로필</span>
                </a>
                <a href="/settings.html" className="menu-item">
                    <span className="menu-icon">⚙️</span>
                    <span>설정</span>
                </a>
>>>>>>> origin/YHW2
            </div>
        </aside>
    );
};


function ProfilePage() {
<<<<<<< HEAD
    // ... (모든 useState와 useEffect 로직은 그대로 유지) ...
    const [user, setUser] = useState(null);
=======
    //  왼쪽 사이드바용 (항상 로그인한 나)
    const [sidebarUser, setSidebarUser] = useState(null);

    // 메인 프로필 카드용 (나 or 친구)
    const [profileUser, setProfileUser] = useState(null);

>>>>>>> origin/YHW2
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState('');
    const [nickname, setNickname] = useState('');
    const [profilePublic, setProfilePublic] = useState(false);
    const [activityPublic, setActivityPublic] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [goalsCount, setGoalsCount] = useState(0);
    const [recentGoals, setRecentGoals] = useState([]);
    const [message, setMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

<<<<<<< HEAD
    useEffect(() => {
        fetchProfile();
        fetchGoalStats();
    }, []);
    // ... (fetchProfile, fetchGoalStats, saveProfile, handleDelete 함수 로직은 그대로 유지) ...
    async function fetchProfile() {
=======
    // -----------------------------
    // 공통 유틸
    // -----------------------------
    const getMyId  = () => TokenManager.getUserId();
    const getToken = () => TokenManager.getAccessToken();

    const getTargetUserIdFromQuery = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('userId'); // 문자열 or null
    };

    // -----------------------------
    // 1) 사이드바용: 항상 내(me) 프로필만 로딩
    // -----------------------------
    async function fetchSidebarProfile() {
>>>>>>> origin/YHW2
        try {
            const myId  = getMyId();
            const token = getToken();
            if (!myId || !token) return;

            const res = await fetch(`/api/v1/profile/me?userId=${myId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;

<<<<<<< HEAD
            setUser(data);
            setBio(data.bio || "");
            setNickname(data.nickname || "");

            const pPublic =
                data.profilePublic !== undefined ? data.profilePublic :
                data.profile_public !== undefined ? data.profile_public :
                false;

            const aPublic =
                data.activityPublic !== undefined ? data.activityPublic :
                data.activity_public !== undefined ? data.activity_public :
                false;

            setProfilePublic(Boolean(pPublic));
            setActivityPublic(Boolean(aPublic));

            setAvatarUrl(data.avatarUrl || "");
=======
            const data = await res.json();
            setSidebarUser(data);
>>>>>>> origin/YHW2
        } catch (e) {
            console.error('사이드바 프로필 조회 에러', e);
        }
    }

    // -----------------------------
    // 2) 메인 카드용: 나 or 친구
    // -----------------------------
    async function fetchProfileCard() {
        try {
            const myId  = getMyId();
            const token = getToken();
            if (!myId || !token) {
                setMessage('로그인이 필요합니다.');
                setLoading(false);
                return;
            }

            const targetUserId = getTargetUserIdFromQuery();

            let url;
            if (targetUserId && Number(targetUserId) !== Number(myId)) {
                // 친구(타인) 프로필
                url = `/api/v1/profile/public/${encodeURIComponent(targetUserId)}`;
            } else {
                // 내 프로필
                url = `/api/v1/profile/me?userId=${myId}`;
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                if (res.status === 403) {
                    setMessage('비공개 프로필입니다.');
                } else if (res.status === 404) {
                    setMessage('존재하지 않는 사용자입니다.');
                } else {
                    setMessage('프로필 정보를 불러올 수 없습니다.');
                }
                setProfileUser(null);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setProfileUser(data);

            // 메인 카드용 폼 상태 세팅(내 프로필일 때만 의미 있음)
            setBio(data.bio || '');
            setNickname(data.nickname || '');
            setProfilePublic(!!data.profilePublic);
            setActivityPublic(!!data.activityPublic);
            setAvatarUrl(data.avatarUrl || '');
        } catch (e) {
            console.error('프로필 조회 에러', e);
            setMessage('프로필 정보를 불러올 수 없습니다.');
        } finally {
            setLoading(false);
        }
    }

    // -----------------------------
    // 3) 내 목표 통계
    // -----------------------------
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
            console.error('목표 통계 조회 에러', e);
        }
    }

    // -----------------------------
    // 4) 프로필 저장 (항상 내 프로필 수정)
    // -----------------------------
    async function saveProfile() {
        try {
<<<<<<< HEAD
            const userId = TokenManager.getUserId();
            const token = TokenManager.getAccessToken();

            const requestBody = {
                nickname,
                avatarUrl,
                bio,
                // [FIX] 명시적으로 Boolean()으로 변환하여 null/undefined가 전송되는 것을 방지합니다.
                profilePublic: Boolean(profilePublic),
                activityPublic: Boolean(activityPublic)
            };

            // [디버그 1] 클라이언트가 실제로 보내는 JSON을 콘솔에 출력
            console.log("-----------------------------------------");
            console.log("[DEBUG-FRONT] Outgoing Profile Update JSON:", JSON.stringify(requestBody));
            console.log("[DEBUG-FRONT] Type check (profilePublic):", typeof profilePublic);
            console.log("[DEBUG-FRONT] Type check (activityPublic):", typeof activityPublic);
            console.log("-----------------------------------------");

            const res = await fetch(`/api/v1/profile/update?userId=${userId}`, {
                method: "PUT",
=======
            const myId  = getMyId();
            const token = getToken();
            if (!myId || !token) return;

            const res = await fetch(`/api/v1/profile/update?userId=${myId}`, {
                method: 'PUT',
>>>>>>> origin/YHW2
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
<<<<<<< HEAD
                body: JSON.stringify(requestBody)
            });

            if (!res.ok) {
                // [디버그 2] 백엔드에서 받은 오류 응답 본문을 읽어서 정확한 예외 메시지를 확인
                const errorText = await res.text();
                setMessage(`프로필 저장 실패: ${errorText.substring(0, 100)}...`);
                console.error("API Error Response Status:", res.status);
                console.error("API Error Response Body:", errorText);
                return;
            }

            // 저장이 성공하면, UI를 업데이트합니다.
            setMessage("프로필 저장 완료!");
            setEditMode(false);
            fetchProfile();

=======
                body: JSON.stringify({
                    nickname,
                    avatarUrl,
                    bio,
                    profilePublic,
                    activityPublic,
                }),
            });

            if (!res.ok) {
                setMessage('프로필 저장 실패');
                return;
            }

            setMessage('프로필 저장 완료!');
            setEditMode(false);

            // 저장 후 내 프로필과 카드 정보 둘 다 갱신
            fetchSidebarProfile();
            fetchProfileCard();
>>>>>>> origin/YHW2
        } catch (e) {
            console.error('프로필 저장 에러', e);
            setMessage('프로필 저장 중 에러');
        }
    }

    // -----------------------------
    // 5) 계정 삭제
    // -----------------------------
    async function handleDelete() {
        if (!password) {
            setMessage('비밀번호를 입력해주세요');
            return;
        }
        try {
            const token = getToken();
            if (!token) return;

            const res = await fetch(`/api/auth/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                setMessage('계정 삭제 실패');
                return;
            }

            alert('계정이 삭제되었습니다.');
            TokenManager.clear();
            window.location.href = '/';
        } catch (e) {
            console.error('계정 삭제 에러', e);
            setMessage('계정 삭제 중 에러');
        }
    }

<<<<<<< HEAD
=======
    // -----------------------------
    // 마운트 시 호출
    // -----------------------------
    useEffect(() => {
        fetchSidebarProfile(); // 항상 dnd 정보
        fetchProfileCard();    // me or friend
        fetchGoalStats();
    }, []);
>>>>>>> origin/YHW2

    if (loading) return <div className="loading">Loading...</div>;
    if (!profileUser) return <div className="error-message">{message || '프로필 정보를 불러올 수 없습니다.'}</div>;

    const isMyProfile =
        getTargetUserIdFromQuery() == null ||
        Number(getTargetUserIdFromQuery()) === Number(getMyId());

    return (
        <div className="app-container">
            {/* 왼쪽: 항상 로그인한 나(dnd) */}
            <Sidebar sidebarUser={sidebarUser || profileUser} />

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
                            {isMyProfile && !editMode && (
                                <button className="edit-btn" onClick={() => setEditMode(true)}>
                                    수정
                                </button>
                            )}
                        </div>

                        {isMyProfile && editMode ? (
                            // 내 프로필 수정 모드
                            <div className="profile-form">
<<<<<<< HEAD
                                <label>프로필 이미지 URL</label>
                                <input placeholder="프로필 이미지 URL" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} />
=======
                                <div className="profile-avatar-edit">
                                    <input
                                        placeholder="프로필 이미지 URL"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                    />
                                </div>
>>>>>>> origin/YHW2

                                <label>닉네임</label>
                                <input
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />

                                <label>소개글</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                />

                                {/* 토글 스위치 영역 (CSS에 맞게 인라인 스타일 정리) */}
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: '20px', padding: '10px 0', borderBottom: '1px solid var(--border-color)'}}>
                                    <label htmlFor="profilePublicToggle" style={{margin: '0', fontWeight: '600', color: 'var(--text-dark)'}}>프로필 공개</label>
                                    <label className="switch">
                                        <input
<<<<<<< HEAD
                                            id="profilePublicToggle"
                                            type="checkbox"
                                            checked={profilePublic}
                                            onChange={e=>setProfilePublic(e.target.checked)}
                                        />
                                        <span className="slider"></span>
=======
                                            type="checkbox"
                                            checked={profilePublic}
                                            onChange={(e) => setProfilePublic(e.target.checked)}
                                        />
                                        <span className="slider" />
>>>>>>> origin/YHW2
                                    </label>
                                </div>

                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: '10px', padding: '10px 0'}}>
                                    <label htmlFor="activityPublicToggle" style={{margin: '0', fontWeight: '600', color: 'var(--text-dark)'}}>활동 공개</label>
                                    <label className="switch">
                                        <input
<<<<<<< HEAD
                                            id="activityPublicToggle"
                                            type="checkbox"
                                            checked={activityPublic}
                                            onChange={e=>setActivityPublic(e.target.checked)}
                                        />
                                        <span className="slider"></span>
=======
                                            type="checkbox"
                                            checked={activityPublic}
                                            onChange={(e) => setActivityPublic(e.target.checked)}
                                        />
                                        <span className="slider" />
>>>>>>> origin/YHW2
                                    </label>
                                </div>

                                <button className="save-btn" onClick={saveProfile}>
                                    저장
                                </button>
                            </div>
                        ) : (
                            // 보기 모드 (나 or 친구)
                            <div className="profile-info">
<<<<<<< HEAD
                                <div className="profile-avatar-display">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={nickname} />
                                    ) : (
                                        // 아바타 없을 때 배경색 조정 (CSS 변수 사용)
                                        <div style={{width:'100%', height:'100%', background:'var(--border-color)', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'30px', color:'var(--text-medium)'}}>?</div>
                                    )}
                                </div>

                                <div><b>닉네임:</b> {nickname}</div>
                                <div><b>아이디:</b> @{user.userId}</div>
                                <div><b>소개글:</b> {bio || "작성된 소개글이 없습니다."}</div>
                                <div><b>프로필 공개:</b> {profilePublic ? "공개" : "비공개"}</div>
                                <div><b>활동 공개:</b> {activityPublic ? "공개" : "비공개"}</div>
=======
                                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                    {profileUser.avatarUrl ? (
                                        <img
                                            src={profileUser.avatarUrl}
                                            alt={profileUser.nickname}
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '12px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                background: '#ccc',
                                                borderRadius: '12px',
                                                display: 'inline-block',
                                            }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <b>닉네임:</b> {profileUser.nickname}
                                </div>
                                <div>
                                    <b>소개글:</b>{' '}
                                    {profileUser.bio && profileUser.bio.length > 0
                                        ? profileUser.bio
                                        : '작성된 소개글이 없습니다.'}
                                </div>
                                {isMyProfile && (
                                    <>
                                        <div>
                                            <b>프로필 공개:</b>{' '}
                                            {profilePublic ? '공개' : '비공개'}
                                        </div>
                                        <div>
                                            <b>활동 공개:</b>{' '}
                                            {activityPublic ? '공개' : '비공개'}
                                        </div>
                                    </>
                                )}
>>>>>>> origin/YHW2
                            </div>
                        )}

                        {message && (
                            <div
                                className={
                                    message.includes('실패') || message.includes('에러')
                                        ? 'error-message'
                                        : 'success-message'
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

                    <div className="stats-card">
                        <h3>내 목표 통계</h3>
                        <p>
                            <b>총 목표 달성 수:</b> {goalsCount}
                        </p>

                        <h4>최근 달성한 목표</h4>
                        <ul className="stats-list">
<<<<<<< HEAD
                            {recentGoals.length===0 ? <p style={{background:'none', border:'none', padding:'0'}}>최근 완료한 목표가 없습니다.</p> :
                              recentGoals.map(g=><li key={g.id}>{g.title}</li>)}
=======
                            {recentGoals.length === 0 ? (
                                <p>최근 완료한 목표가 없습니다.</p>
                            ) : (
                                recentGoals.map((g) => <li key={g.id}>{g.title}</li>)
                            )}
>>>>>>> origin/YHW2
                        </ul>
                    </div>
                </div>

                {modalOpen && (
                    <div className="modal-bg">
                        <div className="modal">
                            <h3>비밀번호 확인</h3>
<<<<<<< HEAD
                            <input type="password" placeholder="비밀번호 입력" value={password} onChange={e=>setPassword(e.target.value)} />
                            <div style={{display:'flex', justifyContent:'space-between', gap:'12px'}}>
                                <button className="btn-cancel" onClick={()=>{setModalOpen(false); setPassword("");}}>취소</button>
                                <button className="btn-delete" onClick={handleDelete}>삭제</button>
                            </div>
=======
                            <input
                                type="password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className="btn-delete" onClick={handleDelete}>
                                삭제
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={() => {
                                    setModalOpen(false);
                                    setPassword('');
                                }}
                            >
                                취소
                            </button>
>>>>>>> origin/YHW2
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
<<<<<<< HEAD
}
=======
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProfilePage />);
>>>>>>> origin/YHW2
