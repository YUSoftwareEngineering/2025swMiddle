const { useState, useEffect } = React;

// 사이드바 컴포넌트
const Sidebar = ({ user }) => {
    const menuItems = [
        { icon: '📅', label: '캘린더', path: '/home.html', active: true },
        { icon: '👥', label: '친구', path: '/friends.html' },
        { icon: '🎯', label: '목표방', path: '/goals.html' },
        { icon: '💬', label: '메시지', path: '/messages.html' },
        { icon: '📊', label: '실패 분석', path: '/analysis.html' },
        { icon: '🤖', label: 'AI 학습봇', path: '/ai.html' },
        { icon: '⏱️', label: '포커스 모드', path: '/focus.html' },
        { icon: '🎮', label: '캐릭터', path: '/character.html' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-profile">
                <div className="profile-avatar">{user?.nickname?.charAt(0) || '자'}</div>
                <div className="profile-info">
                    <div className="profile-name">{user?.nickname || '자기개발왕'}</div>
                    <div className="profile-id">@{user?.userId || 'user123'}</div>
                </div>
            </div>
            <div className="sidebar-level">
                <span>Level 5</span>
                <div className="level-bar"><div className="level-progress" style={{width: '75%'}}></div></div>
                <span>750 XP</span>
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
                <a href="/profile" className="menu-item"><span className="menu-icon">👤</span><span>프로필</span></a>
                <a href="/settings" className="menu-item"><span className="menu-icon">⚙️</span><span>설정</span></a>
            </div>
        </aside>
    );
};

// 주간 캘린더 컴포넌트
const WeeklyCalendar = ({ weekData, selectedDate, onSelectDate, dailyGoals }) => {
    if (!weekData) return <div className="loading">로딩 중...</div>;

    // 선택된 날짜의 상태별 개수 계산
    const getStatusCounts = (date) => {
        if (date !== selectedDate || !dailyGoals) return null;
        return {
            completed: dailyGoals.filter(g => g.status === 'COMPLETED').length,
            partial: dailyGoals.filter(g => g.status === 'PARTIAL_SUCCESS').length,
            failed: dailyGoals.filter(g => g.status === 'FAILED').length,
            pending: dailyGoals.filter(g => g.status === 'PENDING' || g.status === 'IN_PROGRESS' || !g.status).length
        };
    };

    const renderDots = (day) => {
        const statusCounts = getStatusCounts(day.date);
        
        if (statusCounts) {
            // 선택된 날짜: 실제 상태별 색상 표시
            const dots = [];
            for (let i = 0; i < Math.min(statusCounts.completed, 5); i++) dots.push(<span key={`c${i}`} className="dot completed"></span>);
            for (let i = 0; i < Math.min(statusCounts.partial, 5 - dots.length); i++) dots.push(<span key={`p${i}`} className="dot partial"></span>);
            for (let i = 0; i < Math.min(statusCounts.failed, 5 - dots.length); i++) dots.push(<span key={`f${i}`} className="dot failed"></span>);
            for (let i = 0; i < Math.min(statusCounts.pending, 5 - dots.length); i++) dots.push(<span key={`pe${i}`} className="dot pending"></span>);
            return dots;
        } else {
            // 다른 날짜: doneCount 기반 표시
            return Array(Math.min(day.totalGoals, 5)).fill(0).map((_, j) => (
                <span key={j} className={`dot ${j < day.doneCount ? 'completed' : 'pending'}`}></span>
            ));
        }
    };

    return (
        <div className="week-grid">
            {weekData.days?.map((day, i) => (
                <div 
                    key={i} 
                    className={`day-card ${day.date === selectedDate ? 'selected' : ''}`}
                    onClick={() => onSelectDate(day.date)}
                >
                    <div className="day-label">{day.dayOfWeek}</div>
                    <div className="day-number">{new Date(day.date).getDate()}</div>
                    <div className="day-dots">
                        {renderDots(day)}
                    </div>
                </div>
            ))}
        </div>
    );
};

// 월간 캘린더 컴포넌트
const MonthlyCalendar = ({ monthData, selectedDate, onSelectDate, dailyGoals }) => {
    if (!monthData) return <div className="loading">로딩 중...</div>;

    // 선택된 날짜의 상태별 개수 계산
    const getStatusCounts = (date) => {
        if (date !== selectedDate || !dailyGoals) return null;
        return {
            completed: dailyGoals.filter(g => g.status === 'COMPLETED').length,
            partial: dailyGoals.filter(g => g.status === 'PARTIAL_SUCCESS').length,
            failed: dailyGoals.filter(g => g.status === 'FAILED').length,
            pending: dailyGoals.filter(g => g.status === 'PENDING' || g.status === 'IN_PROGRESS' || !g.status).length
        };
    };

    const renderDots = (day) => {
        const statusCounts = getStatusCounts(day.date);
        
        if (statusCounts) {
            // 선택된 날짜: 실제 상태별 색상 표시
            const dots = [];
            if (statusCounts.completed > 0) dots.push(<span key="c" className="dot completed"></span>);
            if (statusCounts.partial > 0) dots.push(<span key="p" className="dot partial"></span>);
            if (statusCounts.failed > 0) dots.push(<span key="f" className="dot failed"></span>);
            if (statusCounts.pending > 0) dots.push(<span key="pe" className="dot pending"></span>);
            return dots;
        } else {
            // 다른 날짜: doneCount 기반 표시
            const dots = [];
            if (day.doneCount > 0) dots.push(<span key="done" className="dot completed"></span>);
            if (day.totalGoals - day.doneCount > 0) dots.push(<span key="pending" className="dot pending"></span>);
            return dots;
        }
    };

    const weeks = [];
    let currentWeek = [];
    
    // 첫 주 빈 칸 채우기
    const firstDay = new Date(monthData.days?.[0]?.date).getDay();
    for (let i = 0; i < firstDay; i++) {
        currentWeek.push(null);
    }

    monthData.days?.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push(currentWeek);
    }

    return (
        <div className="month-grid">
            <div className="month-header">
                {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                    <div key={d} className="month-day-label">{d}</div>
                ))}
            </div>
            {weeks.map((week, wi) => (
                <div key={wi} className="month-week">
                    {week.map((day, di) => (
                        <div 
                            key={di} 
                            className={`month-day ${day?.date === selectedDate ? 'selected' : ''} ${!day ? 'empty' : ''}`}
                            onClick={() => day && onSelectDate(day.date)}
                        >
                            {day && (
                                <>
                                    <span className="month-day-num">{new Date(day.date).getDate()}</span>
                                    {day.totalGoals > 0 && (
                                        <div className="month-day-dots">
                                            {renderDots(day)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

// 목표 아이템 컴포넌트
const GoalItem = ({ goal, onStatusChange, onDelete, onFailure }) => {
    const statusColors = {
        'PENDING': '#9ca3af',        // 회색 (대기)
        'IN_PROGRESS': '#3b82f6',    // 파랑 (진행중)
        'PARTIAL_SUCCESS': '#f59e0b', // 노랑 (부분완료)
        'COMPLETED': '#22c55e',       // 초록 (완료)
        'FAILED': '#ef4444'           // 빨강 (실패)
    };

    return (
        <div className="goal-item">
            <div className="goal-header">
                <span className="goal-dot" style={{backgroundColor: statusColors[goal.status] || '#3b82f6'}}></span>
                <div className="goal-content">
                    <div className="goal-title">{goal.title}</div>
                    <div className="goal-desc">{goal.description}</div>
                </div>
                <button className="goal-delete" onClick={() => onDelete(goal.id)}>🗑️</button>
            </div>
            <div className="goal-actions">
                <button 
                    className={`action-btn ${goal.status === 'COMPLETED' ? 'active' : ''}`}
                    onClick={() => onStatusChange(goal.id, 'COMPLETED')}
                >
                    ✓ 완료
                </button>
                <button 
                    className={`action-btn ${goal.status === 'PARTIAL_SUCCESS' ? 'active' : ''}`}
                    onClick={() => onStatusChange(goal.id, 'PARTIAL_SUCCESS')}
                >
                    ◐ 부분완료
                </button>
                <button 
                    className={`action-btn fail ${goal.status === 'FAILED' ? 'active' : ''}`}
                    onClick={() => onFailure(goal)}
                >
                    ✕ 실패
                </button>
            </div>
        </div>
    );
};

// 목표 추가 모달
const AddGoalModal = ({ isOpen, onClose, onAdd, selectedDate }) => {
    const [form, setForm] = useState({ title: '', description: '' });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ ...form, targetDate: selectedDate });
        setForm({ title: '', description: '' });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>목표 추가</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>제목</label>
                        <input 
                            type="text" 
                            value={form.title} 
                            onChange={e => setForm({...form, title: e.target.value})}
                            placeholder="목표 제목"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>설명</label>
                        <input 
                            type="text" 
                            value={form.description} 
                            onChange={e => setForm({...form, description: e.target.value})}
                            placeholder="목표 설명 (선택)"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>취소</button>
                        <button type="submit" className="btn-submit">추가</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 실패 기록 모달
const FailureModal = ({ isOpen, onClose, goal, onSubmit, tags }) => {
    const [selectedTagNames, setSelectedTagNames] = useState([]);
    const [memo, setMemo] = useState('');

    if (!isOpen || !goal) return null;

    const toggleTag = (tagName) => {
        setSelectedTagNames(prev => 
            prev.includes(tagName) ? prev.filter(n => n !== tagName) : [...prev, tagName]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedTagNames.length === 0) {
            alert('최소 1개 이상의 태그를 선택해주세요.');
            return;
        }
        
        // 선택한 태그 이름을 메모에 추가
        const tagText = `[${selectedTagNames.join(', ')}] `;
        const fullMemo = tagText + memo;
        
        // 실제 서버 태그 ID만 전송 (없으면 빈 배열)
        const validTagIds = tags
            .filter(t => t.id && selectedTagNames.includes(t.name))
            .map(t => t.id);
        
        onSubmit({ 
            goalId: goal.id, 
            tagIds: validTagIds, 
            memo: fullMemo,
            selectedTagNames: selectedTagNames // 태그 이름도 전달
        });
        setSelectedTagNames([]);
        setMemo('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>실패 원인 기록</h3>
                <p className="modal-subtitle">"{goal.title}" 목표가 실패한 이유를 기록해주세요.</p>
                <form onSubmit={handleSubmit}>
                    {tags.length > 0 && (
                        <div className="form-group">
                            <label>실패 원인 태그 (선택)</label>
                            <div className="tag-list">
                                {tags.map((tag, idx) => (
                                    <button 
                                        key={idx} 
                                        type="button"
                                        className={`tag-btn ${selectedTagNames.includes(tag.name) ? 'selected' : ''}`}
                                        onClick={() => toggleTag(tag.name)}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="form-group">
                        <label>메모</label>
                        <textarea 
                            value={memo} 
                            onChange={e => setMemo(e.target.value)}
                            placeholder="실패 원인에 대해 더 자세히 적어주세요..."
                            rows={3}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>취소</button>
                        <button type="submit" className="btn-submit">기록하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 메인 캘린더 페이지
const CalendarPage = () => {
    const [viewMode, setViewMode] = useState('weekly'); // weekly or monthly
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [weekData, setWeekData] = useState(null);
    const [monthData, setMonthData] = useState(null);
    const [dailyGoals, setDailyGoals] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [failureGoal, setFailureGoal] = useState(null);
    // 기본 태그 (서버에 태그가 없을 때 사용)
    const defaultTags = [
        // 시간 관련
        { id: null, name: '시간 부족' },
        { id: null, name: '일정 충돌' },
        { id: null, name: '예상보다 오래 걸림' },
        { id: null, name: '마감 시간 놓침' },
        // 신체/정신 상태
        { id: null, name: '피로/컨디션 저하' },
        { id: null, name: '수면 부족' },
        { id: null, name: '건강 문제' },
        { id: null, name: '스트레스' },
        { id: null, name: '번아웃' },
        // 의지/동기
        { id: null, name: '의지력 부족' },
        { id: null, name: '동기 부족' },
        { id: null, name: '흥미 저하' },
        { id: null, name: '미루는 습관' },
        { id: null, name: '귀찮음' },
        // 계획/목표
        { id: null, name: '계획 미흡' },
        { id: null, name: '과도한 목표 설정' },
        { id: null, name: '우선순위 변경' },
        { id: null, name: '목표 불명확' },
        // 환경/외부
        { id: null, name: '외부 요인' },
        { id: null, name: '예상치 못한 일정' },
        { id: null, name: '환경적 방해' },
        { id: null, name: '사회적 약속' },
        { id: null, name: '가족/친구 일' },
        // 집중/생산성
        { id: null, name: '집중력 저하' },
        { id: null, name: '산만함' },
        { id: null, name: 'SNS/인터넷' },
        { id: null, name: '멀티태스킹' },
        // 기술/자원
        { id: null, name: '기술적 문제' },
        { id: null, name: '자료/도구 부족' },
        { id: null, name: '정보 부족' },
        // 기타
        { id: null, name: '날씨' },
        { id: null, name: '갑작스러운 변수' },
        { id: null, name: '잊어버림' },
        { id: null, name: '기타' }
    ];
    const [failureTags, setFailureTags] = useState(defaultTags);
    const userId = 1; // TODO: 실제 사용자 ID로 교체

    // 실패 태그 로드 (서버 태그 + 기본 태그 합치기)
    const loadFailureTags = async () => {
        try {
            const serverTags = await failureApi.getTags(userId);
            if (serverTags && serverTags.length > 0) {
                // 서버 태그 이름 목록
                const serverTagNames = serverTags.map(t => t.name);
                // 기본 태그 중 서버에 없는 것들만 필터링
                const additionalTags = defaultTags.filter(t => !serverTagNames.includes(t.name));
                // 서버 태그 + 추가 기본 태그 합치기
                setFailureTags([...serverTags, ...additionalTags]);
            }
            // 서버 태그가 없으면 기본 태그 유지 (이미 초기값으로 설정됨)
        } catch (err) {
            console.error('태그 로드 실패:', err);
            // 서버에서 못 불러오면 기본 태그 유지
        }
    };

    // 주간 데이터 로드
    const loadWeekData = async (date) => {
        try {
            const data = await calendarApi.getWeekly(userId, date);
            setWeekData(data);
        } catch (err) {
            console.error('주간 데이터 로드 실패:', err);
        }
    };

    // 월간 데이터 로드
    const loadMonthData = async (date) => {
        try {
            const data = await calendarApi.getMonthly(userId, date);
            setMonthData(data);
        } catch (err) {
            console.error('월간 데이터 로드 실패:', err);
        }
    };

    // 일일 목표 로드
    const loadDailyGoals = async (date) => {
        try {
            const data = await calendarApi.getDaily(userId, date);
            setDailyGoals(data?.items || []);
        } catch (err) {
            console.error('일일 목표 로드 실패:', err);
        }
    };

    // 초기 로드
    useEffect(() => {
        if (!tokenManager.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }
        loadWeekData(currentDate);
        loadMonthData(currentDate);
        loadDailyGoals(selectedDate);
        loadFailureTags();
    }, []);

    // 날짜 변경 시 데이터 로드
    useEffect(() => {
        loadDailyGoals(selectedDate);
    }, [selectedDate]);

    // 뷰 모드 변경 시 데이터 로드
    useEffect(() => {
        if (viewMode === 'weekly') {
            loadWeekData(currentDate);
        } else {
            loadMonthData(currentDate);
        }
    }, [viewMode, currentDate]);

    // 이전/다음 이동
    const navigate = (direction) => {
        const date = new Date(currentDate);
        if (viewMode === 'weekly') {
            date.setDate(date.getDate() + (direction * 7));
        } else {
            date.setMonth(date.getMonth() + direction);
        }
        setCurrentDate(date.toISOString().split('T')[0]);
    };

    // 오늘로 이동
    const goToToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);
        setSelectedDate(today);
    };

    // 목표 추가
    const handleAddGoal = async (goalData) => {
        try {
            await goalApi.create(goalData);
            loadDailyGoals(selectedDate);
            loadWeekData(currentDate);
        } catch (err) {
            alert('목표 추가 실패: ' + err.message);
        }
    };

    // 목표 상태 변경
    const handleStatusChange = async (goalId, status) => {
        try {
            await goalApi.updateStatus(goalId, { status });
            loadDailyGoals(selectedDate);
            loadWeekData(currentDate);
        } catch (err) {
            alert('상태 변경 실패: ' + err.message);
        }
    };

    // 목표 삭제
    const handleDeleteGoal = async (goalId) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            await goalApi.delete(goalId);
            loadDailyGoals(selectedDate);
            loadWeekData(currentDate);
        } catch (err) {
            alert('삭제 실패: ' + err.message);
        }
    };

    // 실패 기록
    const handleFailure = (goal) => {
        setFailureGoal(goal);
        setShowFailureModal(true);
    };

    const handleFailureSubmit = async (data) => {
        try {
            // 선택한 태그가 없으면 기본 태그 하나 생성해서 사용
            let tagIds = data.tagIds;
            
            if (!tagIds || tagIds.length === 0) {
                // 선택한 태그 이름들로 새 태그 생성
                const tagNames = data.selectedTagNames || ['기타'];
                const createdTagIds = [];
                
                for (const tagName of tagNames) {
                    try {
                        const createdTag = await failureApi.createTag({ 
                            userId, 
                            name: tagName 
                        });
                        if (createdTag && createdTag.id) {
                            createdTagIds.push(createdTag.id);
                        }
                    } catch (e) {
                        console.log('태그 생성 실패 (이미 존재할 수 있음):', e);
                    }
                }
                
                // 생성된 태그가 없으면 기존 태그 다시 조회
                if (createdTagIds.length === 0) {
                    const existingTags = await failureApi.getTags(userId);
                    if (existingTags && existingTags.length > 0) {
                        createdTagIds.push(existingTags[0].id);
                    }
                }
                
                tagIds = createdTagIds;
            }

            if (tagIds.length === 0) {
                alert('태그를 선택해주세요.');
                return;
            }

            await failureApi.log({ 
                userId, 
                goalId: data.goalId, 
                date: selectedDate,
                tagIds: tagIds, 
                memo: data.memo 
            });
            await goalApi.updateStatus(data.goalId, { status: 'FAILED' });
            loadDailyGoals(selectedDate);
            loadWeekData(currentDate);
            loadFailureTags(); // 새로 생성된 태그 반영
        } catch (err) {
            alert('실패 기록 실패: ' + err.message);
        }
    };

    // 날짜 포맷
    const formatDateRange = () => {
        if (viewMode === 'weekly' && weekData) {
            const start = new Date(weekData.weekStart);
            const end = new Date(weekData.weekEnd);
            return `${start.getMonth()+1}월 ${start.getDate()}일 - ${end.getMonth()+1}월 ${end.getDate()}일`;
        } else {
            const date = new Date(currentDate);
            return `${date.getFullYear()}년 ${date.getMonth()+1}월`;
        }
    };

    const formatSelectedDate = () => {
        const date = new Date(selectedDate);
        return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일의 목표`;
    };

    const doneCount = dailyGoals.filter(g => g.status === 'COMPLETED').length;

    return (
        <div className="app-container">
            <Sidebar user={{ nickname: tokenManager.getNickname() }} />
            
            <main className="main-content">
                <div className="calendar-header">
                    <div className="calendar-title">
                        <span className="title-icon">📅</span>
                        <div>
                            <h1>나의 캘린더</h1>
                            <p>매일의 목표를 기록하고 추적하세요</p>
                        </div>
                    </div>
                </div>

                <div className="calendar-card">
                    <div className="calendar-nav">
                        <span className="date-range">{formatDateRange()}</span>
                        <div className="nav-buttons">
                            <button className="nav-btn" onClick={goToToday}>오늘</button>
                            <button className="nav-btn" onClick={() => navigate(-1)}>‹</button>
                            <button className="nav-btn" onClick={() => navigate(1)}>›</button>
                        </div>
                    </div>

                    <div className="view-tabs">
                        <button 
                            className={`view-tab ${viewMode === 'weekly' ? 'active' : ''}`}
                            onClick={() => setViewMode('weekly')}
                        >
                            주간
                        </button>
                        <button 
                            className={`view-tab ${viewMode === 'monthly' ? 'active' : ''}`}
                            onClick={() => setViewMode('monthly')}
                        >
                            월간
                        </button>
                    </div>

                    {viewMode === 'weekly' ? (
                        <WeeklyCalendar 
                            weekData={weekData} 
                            selectedDate={selectedDate} 
                            onSelectDate={setSelectedDate}
                            dailyGoals={dailyGoals}
                        />
                    ) : (
                        <MonthlyCalendar 
                            monthData={monthData} 
                            selectedDate={selectedDate} 
                            onSelectDate={setSelectedDate}
                            dailyGoals={dailyGoals}
                        />
                    )}
                </div>

                <div className="goals-card">
                    <div className="goals-header">
                        <div>
                            <h2>{formatSelectedDate()}</h2>
                            <span className="goals-count">{doneCount} / {dailyGoals.length} 완료</span>
                        </div>
                        <button className="add-goal-btn" onClick={() => setShowAddModal(true)}>
                            + 목표 추가
                        </button>
                    </div>

                    <div className="goals-list">
                        {dailyGoals.length === 0 ? (
                            <div className="empty-goals">
                                <p>이 날짜에 등록된 목표가 없습니다.</p>
                                <button onClick={() => setShowAddModal(true)}>첫 목표 추가하기</button>
                            </div>
                        ) : (
                            dailyGoals.map(goal => (
                                <GoalItem 
                                    key={goal.id} 
                                    goal={goal}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDeleteGoal}
                                    onFailure={handleFailure}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>

            <AddGoalModal 
                isOpen={showAddModal} 
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddGoal}
                selectedDate={selectedDate}
            />

            <FailureModal 
                isOpen={showFailureModal}
                onClose={() => setShowFailureModal(false)}
                goal={failureGoal}
                onSubmit={handleFailureSubmit}
                tags={failureTags}
            />
        </div>
    );
};

