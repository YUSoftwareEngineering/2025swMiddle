const { useState, useEffect } = React;

// 사이드바 컴포넌트
const Sidebar = ({ profile }) => {
    const menuItems = [
        { icon: '📅', label: '캘린더', path: '/home.html' },
        { icon: '👥', label: '친구', path: '/friends.html', active: true },
        { icon: '🎯', label: '목표방', path: '/goals.html' },
        { icon: '💬', label: '메시지', path: '/messages.html' },
        { icon: '📊', label: '실패 분석', path: '/analysis.html' },
        { icon: '🤖', label: 'AI 학습봇', path: '/ai.html' },
        { icon: '⏱️', label: '포커스 모드', path: '/focus.html' },
        { icon: '🎮', label: '캐릭터', path: '/character.html' },
    ];

    // TODO: 백엔드에 레벨/경험치 API가 추가되면 여기서 사용
    const level = profile?.level || 1;
    const xp = profile?.xp || 0;
    const xpForNextLevel = 1000; // 다음 레벨까지 필요한 XP
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
                    <div className="profile-id">@{TokenManager.getLoginId() || 'user'}</div>
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
                    <a key={i} href={item.path} className={`menu-item ${item.active ? 'active' : ''}`}>
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

// 친구 목록 탭
const FriendsList = ({ userId, onRefresh }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFriends = async () => {
        try {
            setLoading(true);
            const data = await friendApi.getList(userId);
            setFriends(data || []);
        } catch (err) {
            console.error('친구 목록 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFriends();
    }, [userId]);

    const handleDelete = async (friendUserId) => {
        if (!confirm('정말 이 친구를 삭제하시겠습니까?')) return;
        try {
            await friendApi.deleteFriend(userId, friendUserId);
            loadFriends();
        } catch (err) {
            alert('친구 삭제 실패: ' + err.message);
        }
    };

    const handleBlock = async (friendUserId) => {
        if (!confirm('이 사용자를 차단하시겠습니까?')) return;
        try {
            await friendApi.block(userId, friendUserId);
            loadFriends();
        } catch (err) {
            alert('차단 실패: ' + err.message);
        }
    };

    // 프로필 버튼 클릭 시 프로필 페이지로 이동
    const handleProfile = (friendUserId) => {
        window.location.href = `/profile.html?userId=${friendUserId}`;
    };

    if (loading) return <div className="loading">로딩 중...</div>;

    if (friends.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p>아직 친구가 없습니다.</p>
                <p className="empty-sub">친구 찾기 탭에서 친구를 검색해보세요!</p>
            </div>
        );
    }

    return (
        <div className="friends-list">
            {friends.map(friend => (
                <div key={friend.id} className="friend-item">
                    <div className="friend-avatar">
                        {friend.name?.charAt(0) || '?'}
                    </div>
                    <div className="friend-info">
                        <div className="friend-name">
                            {friend.name}
                        </div>
                        <div className="friend-id">@{friend.userId}</div>
                    </div>
                    <div className="friend-actions">
                         {/* 프로필 공개일 때만 버튼 생성 */}
                         {friend.profileOpen && ( <button className="btn-action btn-profile" onClick={() => handleProfile(friend.id)}>프로필</button>)}
                        <button className="btn-action btn-delete" onClick={() => handleDelete(friend.id)}>
                            삭제
                        </button>
                        <button className="btn-action btn-block" onClick={() => handleBlock(friend.id)}>
                            차단
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// 친구 찾기 탭
const FriendSearch = ({ userId }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!keyword.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }
        
        try {
            setLoading(true);
            setSearched(true);
            const data = await friendApi.search(userId, keyword.trim());
            setResults(data || []);
        } catch (err) {
            console.error('검색 실패:', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSendRequest = async (toUserId) => {
        try {
            await friendApi.sendRequest(userId, toUserId);
            alert('친구 요청을 보냈습니다!');
            // 검색 결과 업데이트
            setResults(prev => prev.map(user => 
                user.id === toUserId 
                    ? { ...user, requestSent: true }
                    : user
            ));
        } catch (err) {
            alert('친구 요청 실패: ' + err.message);
        }
    };

    const getStatusButton = (user) => {
        // 백엔드: isFriend (boolean), requestSent (boolean)
        if (user.isFriend) {
            return <span className="status-badge friend">친구</span>;
        }
        if (user.requestSent) {
            return <span className="status-badge pending">요청됨</span>;
        }
        return (
            <button 
                className="btn-request"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSendRequest(user.id);
                }}
            >
                👋 친구 요청
            </button>
        );
    };

    return (
        <div className="friend-search">
            <h3 className="section-title">친구 찾기</h3>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="사용자명 또는 닉네임 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="btn-search" onClick={handleSearch} disabled={loading}>
                    🔍 검색
                </button>
            </div>

            {loading && <div className="loading">검색 중...</div>}

            {!loading && searched && results.length === 0 && (
                <div className="empty-state">
                    <p>검색 결과가 없습니다.</p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="search-results">
                    {results.map(user => (
                        <div key={user.id} className="search-result-item">
                            <div className="friend-avatar">
                                {user.name?.charAt(0) || '?'}
                            </div>
                            <div className="friend-info">
                                <div className="friend-name">
                                    {user.name}
                                </div>
                                <div className="friend-id">@{user.userId}</div>
                            </div>
                            {getStatusButton(user)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// 친구 요청 탭 (받은 요청 + 보낸 요청)
const FriendRequests = ({ userId, requestCount, onRefresh }) => {
    const [activeSubTab, setActiveSubTab] = useState('received');
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const [received, sent] = await Promise.all([
                friendApi.getReceivedRequests(userId),
                friendApi.getSentRequests(userId)
            ]);
            setReceivedRequests(received || []);
            setSentRequests(sent || []);
        } catch (err) {
            console.error('요청 목록 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [userId]);

    const handleAccept = async (requestId) => {
        try {
            await friendApi.acceptRequest(requestId);
            alert('친구 요청을 수락했습니다!');
            loadRequests();
            onRefresh();
        } catch (err) {
            alert('수락 실패: ' + err.message);
        }
    };

    const handleDecline = async (requestId) => {
        try {
            await friendApi.declineRequest(requestId);
            loadRequests();
            onRefresh();
        } catch (err) {
            alert('거절 실패: ' + err.message);
        }
    };

    const handleCancel = async (requestId) => {
        if (!confirm('이 친구 요청을 취소하시겠습니까?')) return;
        try {
            await friendApi.cancelRequest(requestId);
            loadRequests();
            onRefresh();
        } catch (err) {
            alert('취소 실패: ' + err.message);
        }
    };

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="requests-container">
            <div className="sub-tabs">
                <button 
                    className={`sub-tab ${activeSubTab === 'received' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('received')}
                >
                    받은 요청 
                    {receivedRequests.length > 0 && (
                        <span className="sub-tab-count">{receivedRequests.length}</span>
                    )}
                </button>
                <button 
                    className={`sub-tab ${activeSubTab === 'sent' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('sent')}
                >
                    보낸 요청
                    {sentRequests.length > 0 && (
                        <span className="sub-tab-count">{sentRequests.length}</span>
                    )}
                </button>
            </div>

            {activeSubTab === 'received' && (
                <>
                    {receivedRequests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📬</div>
                            <p>받은 친구 요청이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="requests-list">
                            {receivedRequests.map(request => (
                                <div key={request.id} className="request-item">
                                    <div className="friend-avatar">
                                        {request.fromUserName?.charAt(0) || '?'}
                                    </div>
                                    <div className="friend-info">
                                        <div className="friend-name">{request.fromUserName}</div>
                                        <div className="request-date">
                                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('ko-KR') + '에 요청함' : ''}
                                        </div>
                                    </div>
                                    <div className="request-actions">
                                        <button 
                                            className="btn-accept"
                                            onClick={() => handleAccept(request.id)}
                                        >
                                            ✓ 수락
                                        </button>
                                        <button 
                                            className="btn-decline"
                                            onClick={() => handleDecline(request.id)}
                                        >
                                            ✕ 거절
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeSubTab === 'sent' && (
                <>
                    {sentRequests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📤</div>
                            <p>보낸 친구 요청이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="requests-list">
                            {sentRequests.map(request => (
                                <div key={request.id} className="request-item sent">
                                    <div className="friend-avatar">
                                        {request.toUserName?.charAt(0) || '?'}
                                    </div>
                                    <div className="friend-info">
                                        <div className="friend-name">{request.toUserName}</div>
                                        <div className="request-date">
                                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('ko-KR') + '에 요청 보냄' : ''}
                                        </div>
                                    </div>
                                    <div className="request-actions">
                                        <button 
                                            className="btn-cancel"
                                            onClick={() => handleCancel(request.id)}
                                        >
                                            요청 취소
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// 차단 목록 탭
const BlockedUsers = ({ userId }) => {
    const [blocked, setBlocked] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBlocked = async () => {
        try {
            setLoading(true);
            const data = await friendApi.getBlockedUsers(userId);
            setBlocked(data || []);
        } catch (err) {
            console.error('차단 목록 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBlocked();
    }, [userId]);

    const handleUnblock = async (targetUserId) => {
        try {
            await friendApi.unblock(userId, targetUserId);
            alert('차단을 해제했습니다.');
            loadBlocked();
        } catch (err) {
            alert('차단 해제 실패: ' + err.message);
        }
    };

    if (loading) return <div className="loading">로딩 중...</div>;

    if (blocked.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🚫</div>
                <p>차단한 사용자가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="blocked-list">
            {blocked.map(user => (
                <div key={user.id} className="blocked-item">
                    <div className="friend-avatar blocked">{user.blockedUserName?.charAt(0) || '?'}</div>
                    <div className="friend-info">
                        <div className="friend-name">{user.blockedUserName}</div>
                        <div className="request-date">
                            {user.blockedAt ? new Date(user.blockedAt).toLocaleDateString('ko-KR') + '에 차단함' : ''}
                        </div>
                    </div>
                    <button 
                        className="btn-unblock"
                        onClick={() => handleUnblock(user.blockedUserId)}
                    >
                        차단 해제
                    </button>
                </div>
            ))}
        </div>
    );
};

// 메인 친구 페이지
const FriendsPage = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [requestCount, setRequestCount] = useState(0);
    const [myProfile, setMyProfile] = useState(null);
    const userId = TokenManager.getUserId(); // 실제 로그인한 사용자 ID

    const loadRequestCount = async () => {
        try {
            const requests = await friendApi.getReceivedRequests(userId);
            setRequestCount(requests?.length || 0);
        } catch (err) {
            console.error('요청 수 로드 실패:', err);
        }
    };

    const loadMyProfile = async () => {
        try {
            const data = await profileApi.getMyProfile(userId);
            setMyProfile(data);
        } catch (err) {
            console.error('내 프로필 로드 실패:', err);
            // 프로필 로드 실패 시 기본값 사용
            setMyProfile({
                nickname: TokenManager.getNickname() || '사용자',
                userId: userId,
                level: 1,
                xp: 0
            });
        }
    };

    useEffect(() => {
        if (!TokenManager.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }
        loadRequestCount();
        loadMyProfile();
    }, []);

    const tabs = [
        { id: 'list', label: '친구 목록' },
        { id: 'search', label: '친구 찾기' },
        { id: 'requests', label: '요청', badge: requestCount },
        { id: 'blocked', label: '차단' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'list':
                return <FriendsList userId={userId} onRefresh={loadRequestCount} />;
            case 'search':
                return <FriendSearch userId={userId} />;
            case 'requests':
                return <FriendRequests userId={userId} requestCount={requestCount} onRefresh={loadRequestCount} />;
            case 'blocked':
                return <BlockedUsers userId={userId} />;
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            <Sidebar profile={myProfile} />
            
            <main className="main-content">
                <div className="page-header">
                    <div className="page-title">
                        <span className="title-icon">👥</span>
                        <div>
                            <h1>친구</h1>
                            <p>친구들과 함께 성장하세요</p>
                        </div>
                    </div>
                </div>

                <div className="friends-card">
                    <div className="tabs-container">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                                {tab.badge > 0 && (
                                    <span className="tab-badge">{tab.badge}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="tab-content">
                        {renderTabContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

