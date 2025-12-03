const { useState, useEffect, useRef } = React;

// 사이드바 컴포넌트
const Sidebar = ({ profile }) => {
    const menuItems = [
        { icon: '🏠', label: '홈', path: '/home.html' },
        { icon: '📅', label: '캘린더', path: '/calendar.html' },
        { icon: '👥', label: '친구', path: '/friends.html' },
        { icon: '🎯', label: '목표방', path: '/goalrooms.html', active: true },
        { icon: '📊', label: '실패 분석', path: '/analysis.html' },
        { icon: '🤖', label: 'AI 학습봇', path: '/ai.html' },
        { icon: '⏱️', label: '포커스 모드', path: '/focus.html' },
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
                    <div className="profile-id">@{tokenManager.getLoginId() || 'user'}</div>
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

// 채팅 모달 컴포넌트
const ChatModal = ({ isOpen, onClose, room, currentUserId, currentUserNickname }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 메시지 로드
    const loadMessages = async () => {
        if (!room) return;
        try {
            setLoading(true);
            const data = await goalRoomApi.getMessages(room.id, 0, 50);
            // Page 객체에서 content 배열 추출
            const messageList = data.content || data || [];
            setMessages(messageList.reverse()); // 최신 메시지가 아래로
        } catch (err) {
            console.error('메시지 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && room) {
            loadMessages();
        }
    }, [isOpen, room]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 메시지 전송
    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || sending) return;

        const content = inputValue.trim();
        setInputValue('');
        setSending(true);

        try {
            const newMsg = await goalRoomApi.sendMessage(room.id, content);
            setMessages(prev => [...prev, newMsg]);
        } catch (err) {
            alert('메시지 전송 실패: ' + err.message);
            setInputValue(content); // 실패 시 복구
        } finally {
            setSending(false);
        }
    };

    // 시간 포맷
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        const hour12 = hours % 12 || 12;
        return `${ampm} ${hour12}:${minutes}`;
    };

    // 날짜 포맷
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                {/* 채팅 헤더 */}
                <div className="chat-modal-header">
                    <div className="chat-room-info">
                        <h2>💬 {room?.roomName}</h2>
                        <span className="chat-member-count">👥 {room?.currentMembers}명 참여 중</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {/* 메시지 영역 */}
                <div className="chat-messages">
                    {loading ? (
                        <div className="chat-loading">메시지를 불러오는 중...</div>
                    ) : messages.length === 0 ? (
                        <div className="chat-empty">
                            <div className="chat-empty-icon">💬</div>
                            <p>아직 메시지가 없습니다.</p>
                            <p className="chat-empty-sub">첫 번째 응원 메시지를 보내보세요!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMine = msg.senderId === currentUserId;
                            const showDate = index === 0 || 
                                formatDate(messages[index - 1]?.createdAt) !== formatDate(msg.createdAt);
                            
                            return (
                                <React.Fragment key={msg.id || index}>
                                    {showDate && (
                                        <div className="chat-date-divider">
                                            <span>{formatDate(msg.createdAt)}</span>
                                        </div>
                                    )}
                                    <div className={`chat-message ${isMine ? 'mine' : 'others'}`}>
                                        {!isMine && (
                                            <div className="chat-sender-avatar">
                                                {String(msg.senderId).charAt(0)}
                                            </div>
                                        )}
                                        <div className="chat-message-content">
                                            {!isMine && (
                                                <div className="chat-sender-name">멤버 {msg.senderId}</div>
                                            )}
                                            <div className={`chat-bubble ${isMine ? 'mine' : 'others'}`}>
                                                {msg.content}
                                            </div>
                                            <div className="chat-time">{formatTime(msg.createdAt)}</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 */}
                <form className="chat-input-form" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="응원 메시지를 입력하세요..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={sending}
                    />
                    <button type="submit" className="chat-send-btn" disabled={!inputValue.trim() || sending}>
                        {sending ? '...' : '전송'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// 목표방 생성 모달
const CreateRoomModal = ({ isOpen, onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        roomName: '',
        goal: '',
        description: '',
        startDate: '',
        endDate: '',
        maxMembers: 10,
        visibility: 'PUBLIC'
    });
    const [loading, setLoading] = useState(false);

    const categories = ['습관', '학습', '건강', '취미', '업무', '기타'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.roomName.trim()) {
            alert('목표방 이름을 입력해주세요.');
            return;
        }
        
        try {
            setLoading(true);
            await goalRoomApi.create(formData);
            alert('목표방이 생성되었습니다!');
            setFormData({
                roomName: '',
                goal: '',
                description: '',
                startDate: '',
                endDate: '',
                maxMembers: 10,
                visibility: 'PUBLIC'
            });
            onClose();
            onCreated();
        } catch (err) {
            alert('목표방 생성 실패: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🎯 새 목표방 만들기</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>목표방 이름 *</label>
                        <input
                            type="text"
                            placeholder="예: 아침 6시 기상 챌린지"
                            value={formData.roomName}
                            onChange={(e) => setFormData({...formData, roomName: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>목표 카테고리</label>
                        <select
                            value={formData.goal}
                            onChange={(e) => setFormData({...formData, goal: e.target.value})}
                        >
                            <option value="">선택하세요</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>설명</label>
                        <textarea
                            placeholder="목표방에 대한 설명을 입력하세요"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>시작일</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                        <div className="form-group half">
                            <label>종료일</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>최대 인원</label>
                        <input
                            type="number"
                            min="2"
                            max="100"
                            value={formData.maxMembers}
                            onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value) || 10})}
                        />
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.visibility === 'PUBLIC'}
                                onChange={(e) => setFormData({...formData, visibility: e.target.checked ? 'PUBLIC' : 'PRIVATE'})}
                            />
                            공개 목표방 (누구나 참여 가능)
                        </label>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>취소</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? '생성 중...' : '만들기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 내 목표방 탭
const MyRooms = ({ rooms, loading, onLeave, onOpenChat, currentUserId }) => {
    if (loading) return <div className="loading">로딩 중...</div>;

    if (!rooms || rooms.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <p>참여 중인 목표방이 없습니다.</p>
                <p className="empty-sub">새로운 목표방을 만들거나 공개 목표방에 참여해보세요!</p>
            </div>
        );
    }

    return (
        <div className="rooms-list">
            {rooms.map(room => {
                const isOwner = room.ownerId === currentUserId;
                return (
                    <div key={room.id} className="room-card">
                        <div className="room-header">
                            <div className="room-title-row">
                                <h3 className="room-name">{room.roomName}</h3>
                                {isOwner && <span className="owner-badge">👑 방장</span>}
                                <span className={`visibility-badge ${room.visibility?.toLowerCase()}`}>
                                    {room.visibility === 'PUBLIC' ? '🌐' : '🔒'}
                                </span>
                            </div>
                            <p className="room-goal">{room.goal}</p>
                        </div>
                        <div className="room-meta">
                            {room.goal && (
                                <span className="room-category">{room.goal}</span>
                            )}
                            <span className="room-members">
                                👥 {room.currentMembers}/{room.maxMembers}
                            </span>
                        </div>
                        <div className="room-actions">
                            <button className="btn-chat" title="채팅" onClick={() => onOpenChat(room)}>💬</button>
                            {isOwner && room.currentMembers > 1 ? (
                                <button 
                                    className="btn-owner-leave-disabled" 
                                    title="방장은 방을 나갈 수 없습니다"
                                    onClick={() => alert(`방장은 방을 나갈 수 없습니다.\n다른 멤버 ${room.currentMembers - 1}명이 모두 나간 후 나갈 수 있습니다.`)}
                                >
                                    🚫
                                </button>
                            ) : (
                                <button className="btn-leave" onClick={() => onLeave(room.id)} title="나가기">🚪</button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// 공개 목표방 탭
const PublicRooms = ({ rooms, loading, onJoin, myRoomIds }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);

    const categories = ['습관', '학습', '건강', '취미', '업무', '기타'];

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            setSearchResults(null);
            return;
        }
        
        try {
            setSearching(true);
            const data = await goalRoomApi.search(searchKeyword.trim());
            setSearchResults(data || []);
        } catch (err) {
            console.error('검색 실패:', err);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearSearch = () => {
        setSearchKeyword('');
        setSearchResults(null);
    };

    const displayRooms = searchResults !== null ? searchResults : (rooms || []);
    
    const filteredRooms = displayRooms.filter(room => {
        if (myRoomIds.includes(room.id)) return false;
        if (selectedCategory !== 'all' && room.goal !== selectedCategory) return false;
        return true;
    });

    if (loading && !searchResults) return <div className="loading">로딩 중...</div>;

    return (
        <div className="public-rooms">
            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="목표방 이름이나 설명으로 검색..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    {searchKeyword && (
                        <button className="btn-clear" onClick={clearSearch}>×</button>
                    )}
                    <button className="btn-search" onClick={handleSearch} disabled={searching}>
                        🔍 검색
                    </button>
                </div>

                <div className="category-filter">
                    <button
                        className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        전체
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <p className="result-count">{filteredRooms.length}개의 목표방을 찾았습니다</p>
            </div>

            {searching && <div className="loading">검색 중...</div>}
            
            {!searching && filteredRooms.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <p>{searchResults !== null ? '검색 결과가 없습니다.' : '참여 가능한 공개 목표방이 없습니다.'}</p>
                </div>
            )}

            {!searching && filteredRooms.length > 0 && (
                <div className="rooms-list public">
                    {filteredRooms.map(room => (
                        <div key={room.id} className="room-card public">
                            <div className="room-header">
                                <h3 className="room-name">{room.roomName}</h3>
                                <p className="room-goal">{room.goal}</p>
                            </div>
                            <div className="room-meta">
                                {room.goal && <span className="room-category">{room.goal}</span>}
                                <span className="room-members">👥 {room.currentMembers}/{room.maxMembers}</span>
                                {room.currentMembers >= room.maxMembers && (
                                    <span className="room-full">정원 마감</span>
                                )}
                            </div>
                            <button
                                className="btn-join"
                                onClick={() => onJoin(room.id)}
                                disabled={room.currentMembers >= room.maxMembers}
                            >
                                👥 {room.currentMembers >= room.maxMembers ? '정원 마감' : '참여하기'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// 메인 목표방 페이지
const GoalRoomsPage = () => {
    const [activeTab, setActiveTab] = useState('my');
    const [myRooms, setMyRooms] = useState([]);
    const [publicRooms, setPublicRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myProfile, setMyProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chatRoom, setChatRoom] = useState(null); // 채팅 모달용
    
    const userId = tokenManager.getUserId();

    const loadRooms = async () => {
        try {
            setLoading(true);
            const data = await goalRoomApi.getRooms();
            setMyRooms(data.myRooms || []);
            setPublicRooms(data.publicRooms || []);
        } catch (err) {
            console.error('목표방 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadMyProfile = async () => {
        try {
            const data = await profileApi.getMyProfile(userId);
            setMyProfile(data);
        } catch (err) {
            console.error('프로필 로드 실패:', err);
            setMyProfile({ nickname: tokenManager.getNickname() || '사용자', level: 1, xp: 0 });
        }
    };

    useEffect(() => {
        if (!tokenManager.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }
        loadRooms();
        loadMyProfile();
    }, []);

    const handleJoin = async (roomId) => {
        try {
            await goalRoomApi.join(roomId);
            alert('목표방에 참여했습니다!');
            loadRooms();
        } catch (err) {
            alert('참여 실패: ' + err.message);
        }
    };

    const handleLeave = async (roomId) => {
        if (!confirm('정말 이 목표방을 나가시겠습니까?')) return;
        try {
            await goalRoomApi.leave(roomId);
            alert('목표방을 나갔습니다.');
            loadRooms();
        } catch (err) {
            alert('나가기 실패: ' + err.message);
        }
    };

    const handleOpenChat = (room) => {
        setChatRoom(room);
    };

    const handleCloseChat = () => {
        setChatRoom(null);
    };

    const tabs = [
        { id: 'my', label: '내 목표방' },
        { id: 'public', label: '공개 목표방' }
    ];

    const myRoomIds = myRooms.map(r => r.id);

    return (
        <div className="app-container">
            <Sidebar profile={myProfile} />
            
            <main className="main-content">
                <div className="page-header">
                    <div className="page-title">
                        <span className="title-icon">🎯</span>
                        <div>
                            <h1>목표방</h1>
                            <p>함께 목표를 달성하세요</p>
                        </div>
                    </div>
                    <button className="btn-create" onClick={() => setIsModalOpen(true)}>
                        + 목표방 만들기
                    </button>
                </div>

                <div className="goalrooms-card">
                    <div className="tabs-container">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                                {tab.id === 'my' && myRooms.length > 0 && (
                                    <span className="tab-count">{myRooms.length}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="tab-content">
                        {activeTab === 'my' && (
                            <MyRooms 
                                rooms={myRooms} 
                                loading={loading} 
                                onLeave={handleLeave}
                                onOpenChat={handleOpenChat}
                                currentUserId={userId}
                            />
                        )}
                        {activeTab === 'public' && (
                            <PublicRooms rooms={publicRooms} loading={loading} onJoin={handleJoin} myRoomIds={myRoomIds} />
                        )}
                    </div>
                </div>
            </main>

            <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={loadRooms} />
            
            <ChatModal 
                isOpen={!!chatRoom}
                onClose={handleCloseChat}
                room={chatRoom}
                currentUserId={userId}
                currentUserNickname={myProfile?.nickname}
            />
        </div>
    );
};
