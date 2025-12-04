const { useState, useEffect, useRef } = React;

// 사이드바 컴포넌트 (포커스 모드 active)
const Sidebar = ({ profile }) => {
    const menuItems = [
        { icon: '📅', label: '캘린더', path: '/home.html' },
        { icon: '👥', label: '친구', path: '/friends.html' },
        { icon: '🎯', label: '목표방', path: '/goalrooms.html' },
        { icon: '📊', label: '실패 분석', path: '/analysis.html' },
        { icon: '🤖', label: 'AI 학습봇', path: '/ai.html' },
        { icon: '⏱️', label: '포커스 모드', path: '/focus.html', active: true },
    ];

    const level = profile?.level || 1;
    const xp = profile?.xp || 0;
    const xpForNextLevel = 1000;
    const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100);

    return (
        <aside className="sidebar">
            <div className="sidebar-profile">
                <div className="profile-avatar">{profile?.nickname?.charAt(0) || '?'}</div>
                <div className="profile-info">
                    <div className="profile-name">{profile?.nickname || '로딩 중...'}</div>
                    <div className="profile-id">@{tokenManager.getLoginId() || 'user'}</div>
                </div>
            </div>
            <div className="sidebar-level">
                <span>Lv.{level}</span>
                <div className="level-bar"><div className="level-progress" style={{width: `${xpProgress}%`}}></div></div>
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

// 세션 저장소 관리 (localStorage 기반, 사용자별로 구분)
const focusStorage = {
    // 사용자별 키 생성
    getKey: (base) => {
        const userId = tokenManager?.getUserId?.() || 'guest';
        return `${base}_${userId}`;
    },

    getSessions: () => {
        try {
            const key = focusStorage.getKey('focusSessions');
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    addSession: (session) => {
        const sessions = focusStorage.getSessions();
        sessions.unshift(session); // 최신 세션을 맨 앞에 추가
        // 최대 50개까지만 저장
        const trimmed = sessions.slice(0, 50);
        const key = focusStorage.getKey('focusSessions');
        localStorage.setItem(key, JSON.stringify(trimmed));
    },

    getCurrentSession: () => {
        try {
            const key = focusStorage.getKey('currentFocusSession');
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },

    setCurrentSession: (session) => {
        const key = focusStorage.getKey('currentFocusSession');
        if (session) {
            localStorage.setItem(key, JSON.stringify(session));
        } else {
            localStorage.removeItem(key);
        }
    }
};

// 포커스 모드 페이지
const FocusPage = () => {
    // 타이머 상태
    const [timerState, setTimerState] = useState('idle'); // idle, running, paused
    const [taskName, setTaskName] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(30);
    const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
    const [totalSeconds, setTotalSeconds] = useState(30 * 60);
    const [currentSessionId, setCurrentSessionId] = useState(null);

    // 세션 데이터
    const [recentSessions, setRecentSessions] = useState([]);
    const [todayStats, setTodayStats] = useState({
        completedSessions: 0,
        totalMinutes: 0,
        weeklyAverage: 68
    });

    // 프로필 데이터
    const [myProfile, setMyProfile] = useState(null);
    const userId = tokenManager.getUserId();

    const timerRef = useRef(null);

    // 시간 포맷
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 날짜 포맷
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    // 내 프로필 로드
    const loadMyProfile = async () => {
        try {
            const data = await profileApi.getMyProfile(userId);
            setMyProfile(data);
        } catch (err) {
            console.error('내 프로필 로드 실패:', err);
            setMyProfile({
                nickname: tokenManager.getNickname() || '사용자',
                userId: userId,
                level: 1,
                xp: 0
            });
        }
    };

    // 저장된 세션 데이터 로드
    const loadSessions = () => {
        const sessions = focusStorage.getSessions();
        setRecentSessions(sessions);

        // 오늘 통계 계산
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = sessions.filter(s =>
            s.endTime && s.endTime.startsWith(today) && s.status === 'COMPLETED'
        );

        const totalMinutes = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

        // 이번 주 통계 계산
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weekSessions = sessions.filter(s => {
            if (!s.endTime || s.status !== 'COMPLETED') return false;
            const sessionDate = new Date(s.endTime);
            return sessionDate >= weekStart;
        });

        const weekTotalMinutes = weekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
        // 하루 목표 2시간(120분) 기준, 7일 = 840분
        const weeklyTarget = 840;
        const weeklyPercent = Math.min(Math.round((weekTotalMinutes / weeklyTarget) * 100), 100);

        setTodayStats({
            completedSessions: todaySessions.length,
            totalMinutes: totalMinutes,
            weeklyAverage: weeklyPercent
        });
    };

    // 진행 중인 세션 복구
    const restoreCurrentSession = () => {
        const current = focusStorage.getCurrentSession();
        if (current && current.status === 'running') {
            // 경과 시간 계산
            const elapsed = Math.floor((Date.now() - current.startedAt) / 1000);
            const remaining = Math.max(0, current.totalSeconds - elapsed);

            if (remaining > 0) {
                setCurrentSessionId(current.sessionId);
                setTaskName(current.taskName);
                setSelectedDuration(current.durationMinutes);
                setTotalSeconds(current.totalSeconds);
                setRemainingSeconds(remaining);
                setTimerState('running');
            } else {
                // 시간이 다 지났으면 완료 처리
                focusStorage.setCurrentSession(null);
            }
        }
    };

    // 초기 로드
    useEffect(() => {
        if (!tokenManager.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }
        loadSessions();
        restoreCurrentSession();
        loadMyProfile();
    }, []);

    // 타이머 로직
    useEffect(() => {
        if (timerState === 'running') {
            timerRef.current = setInterval(() => {
                setRemainingSeconds(prev => {
                    if (prev <= 1) {
                        // 타이머 완료
                        clearInterval(timerRef.current);
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [timerState]);

    // 시간 선택 변경
    const handleDurationChange = (e) => {
        const duration = parseFloat(e.target.value);
        setSelectedDuration(duration);
        setRemainingSeconds(Math.round(duration * 60));
        setTotalSeconds(Math.round(duration * 60));
    };

    // 타이머 시작
    const handleStart = async () => {
        if (!taskName.trim()) {
            alert('작업 내용을 입력해주세요.');
            return;
        }

        let sessionId = null;

        try {
            // 백엔드 API 호출 - 세션 시작
            const response = await focusApi.startSession({
                goal: taskName.trim()
            });
            sessionId = response.sessionId;
            setCurrentSessionId(sessionId);
        } catch (err) {
            console.log('세션 시작 API 호출 실패 (로컬에서 계속 진행):', err);
            // 로컬 ID 생성
            sessionId = Date.now();
            setCurrentSessionId(sessionId);
        }

        // 현재 세션 정보 저장
        focusStorage.setCurrentSession({
            sessionId: sessionId,
            taskName: taskName.trim(),
            durationMinutes: selectedDuration,
            totalSeconds: selectedDuration * 60,
            startedAt: Date.now(),
            status: 'running'
        });

        setTotalSeconds(selectedDuration * 60);
        setRemainingSeconds(selectedDuration * 60);
        setTimerState('running');
    };

    // 타이머 일시정지
    const handlePause = async () => {
        setTimerState('paused');

        // 현재 세션 상태 업데이트
        const current = focusStorage.getCurrentSession();
        if (current) {
            focusStorage.setCurrentSession({
                ...current,
                status: 'paused',
                remainingSeconds: remainingSeconds
            });
        }

        if (currentSessionId) {
            try {
                await focusApi.pauseSession(currentSessionId);
            } catch (err) {
                console.log('세션 일시정지 API 호출 실패:', err);
            }
        }
    };

    // 타이머 재개
    const handleResume = async () => {
        // 현재 세션 상태 업데이트
        focusStorage.setCurrentSession({
            sessionId: currentSessionId,
            taskName: taskName,
            durationMinutes: selectedDuration,
            totalSeconds: totalSeconds,
            startedAt: Date.now() - ((totalSeconds - remainingSeconds) * 1000),
            status: 'running'
        });

        setTimerState('running');

        if (currentSessionId) {
            try {
                await focusApi.resumeSession(currentSessionId);
            } catch (err) {
                console.log('세션 재개 API 호출 실패:', err);
            }
        }
    };

    // 타이머 중지
    const handleStop = async () => {
        setTimerState('idle');
        setRemainingSeconds(selectedDuration * 60);
        focusStorage.setCurrentSession(null);
        setCurrentSessionId(null);
    };

    // 타이머 완료
    const handleTimerComplete = async () => {
        setTimerState('idle');
        focusStorage.setCurrentSession(null);

        // 완료 알림
        if (Notification.permission === 'granted') {
            new Notification('🎉 포커스 세션 완료!', {
                body: `"${taskName}" 작업을 완료했습니다!`
            });
        } else {
            alert(`🎉 "${taskName}" 작업을 완료했습니다!`);
        }

        // 백엔드 세션 완료 처리
        if (currentSessionId) {
            try {
                await focusApi.completeSession(currentSessionId);
            } catch (err) {
                console.log('세션 완료 API 호출 실패:', err);
            }
        }

        // 로컬 스토리지에 완료된 세션 저장
        const completedSession = {
            id: currentSessionId || Date.now(),
            taskName: taskName,
            durationMinutes: selectedDuration,
            totalDurationSeconds: selectedDuration * 60,
            endTime: new Date().toISOString(),
            status: 'COMPLETED'
        };

        focusStorage.addSession(completedSession);

        // 통계 업데이트
        setTodayStats(prev => ({
            ...prev,
            completedSessions: prev.completedSessions + 1,
            totalMinutes: prev.totalMinutes + selectedDuration
        }));

        // 세션 목록 갱신
        setRecentSessions(prev => [completedSession, ...prev.slice(0, 9)]);

        // 폼 초기화
        setTaskName('');
        setRemainingSeconds(selectedDuration * 60);
        setCurrentSessionId(null);
    };

    // 알림 권한 요청
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // 프로그레스 계산
    const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

    return (
        <div className="app-container">
            <Sidebar profile={myProfile} />

            <main className="main-content">
                {/* 헤더 */}
                <div className="focus-header">
                    <div className="focus-title">
                        <span className="title-icon">⏱️</span>
                        <div>
                            <h1>포커스 모드</h1>
                            <p>집중력을 높여 효율적으로 작업하세요</p>
                        </div>
                    </div>
                </div>

                <div className="focus-layout">
                    {/* 메인 영역 */}
                    <div className="focus-main">
                        {/* 타이머 카드 */}
                        <div className="timer-card">
                            <div className="timer-card-header">
                                <h2>작업 시간</h2>
                                <p>포모도로 기법으로 집중력을 높이세요</p>
                            </div>

                            {/* 타이머 디스플레이 */}
                            <div className="timer-display">
                                <div className="timer-time">{formatTime(remainingSeconds)}</div>
                                <div className="timer-progress">
                                    <div
                                        className="timer-progress-bar"
                                        style={{ width: `${progressPercent}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* 타이머 폼 */}
                            {timerState === 'idle' && (
                                <div className="timer-form">
                                    <div className="timer-form-group">
                                        <label>작업 내용</label>
                                        <input
                                            type="text"
                                            className="timer-input"
                                            placeholder="무엇을 하실 건가요?"
                                            value={taskName}
                                            onChange={(e) => setTaskName(e.target.value)}
                                        />
                                    </div>
                                    <div className="timer-form-group">
                                        <label>집중 시간</label>
                                        <select
                                            className="timer-select"
                                            value={selectedDuration}
                                            onChange={handleDurationChange}
                                        >
                                            <option value={0.083}>5초 (테스트)</option>
                                            <option value={10}>10분</option>
                                            <option value={15}>15분</option>
                                            <option value={20}>20분</option>
                                            <option value={25}>25분</option>
                                            <option value={30}>30분 (추천)</option>
                                            <option value={45}>45분</option>
                                            <option value={60}>60분</option>
                                            <option value={90}>90분</option>
                                            <option value={120}>120분</option>
                                        </select>
                                    </div>
                                    <button
                                        className="timer-start-btn"
                                        onClick={handleStart}
                                    >
                                        <span>▶</span>
                                        <span>시작</span>
                                    </button>
                                </div>
                            )}

                            {/* 실행 중 컨트롤 */}
                            {timerState === 'running' && (
                                <div className="timer-controls">
                                    <button
                                        className="timer-control-btn pause"
                                        onClick={handlePause}
                                    >
                                        <span>⏸</span>
                                        <span>일시정지</span>
                                    </button>
                                    <button
                                        className="timer-control-btn stop"
                                        onClick={handleStop}
                                    >
                                        <span>⏹</span>
                                        <span>중지</span>
                                    </button>
                                </div>
                            )}

                            {/* 일시정지 컨트롤 */}
                            {timerState === 'paused' && (
                                <div className="timer-controls">
                                    <button
                                        className="timer-control-btn resume"
                                        onClick={handleResume}
                                    >
                                        <span>▶</span>
                                        <span>계속하기</span>
                                    </button>
                                    <button
                                        className="timer-control-btn stop"
                                        onClick={handleStop}
                                    >
                                        <span>⏹</span>
                                        <span>중지</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 최근 세션 */}
                        <div className="sessions-card">
                            <h2>최근 세션</h2>
                            <p className="sessions-card-subtitle">완료한 포커스 세션 기록</p>

                            <div className="session-list">
                                {recentSessions.length === 0 ? (
                                    <div className="empty-sessions">
                                        <p>아직 완료한 세션이 없습니다.</p>
                                    </div>
                                ) : (
                                    recentSessions.filter(s => s.status === 'COMPLETED').slice(0, 10).map(session => (
                                        <div key={session.id} className="session-item">
                                            <div className="session-check">✓</div>
                                            <div className="session-info">
                                                <div className="session-title">{session.taskName}</div>
                                                <div className="session-duration">{session.durationMinutes}분 집중</div>
                                            </div>
                                            <div className="session-date">
                                                {formatDate(session.endTime)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 사이드바 - 통계 */}
                    <div className="focus-sidebar">
                        <div className="stats-card">
                            <h3 className="stats-title">오늘의 집중</h3>

                            <div className="stat-box sessions">
                                <div className="stat-value">{todayStats.completedSessions}</div>
                                <div className="stat-label">완료한 세션</div>
                            </div>

                            <div className="stat-box minutes">
                                <div className="stat-value">{todayStats.totalMinutes}</div>
                                <div className="stat-label">총 집중 시간 (분)</div>
                            </div>

                            <div className="weekly-stats">
                                <div className="weekly-label">이번 주 평균</div>
                                <div className="weekly-progress">
                                    <div className="weekly-bar">
                                        <div
                                            className="weekly-bar-fill"
                                            style={{ width: `${todayStats.weeklyAverage}%` }}
                                        ></div>
                                    </div>
                                    <span className="weekly-percent">{todayStats.weeklyAverage}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
