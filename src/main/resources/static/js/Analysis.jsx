const { useState, useEffect } = React;

// 로컬 스토리지 기반 실패 기록 관리 (백엔드 API가 없으므로 프론트에서 관리)
const failureStorage = {
    getKey: () => {
        const userId = TokenManager?.getUserId?.() || 'guest';
        return `failureAnalysis_${userId}`;
    },
    
    getRecords: () => {
        try {
            const key = failureStorage.getKey();
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },
    
    addRecord: (record) => {
        const records = failureStorage.getRecords();
        records.unshift({ ...record, id: Date.now() });
        const trimmed = records.slice(0, 100);
        localStorage.setItem(failureStorage.getKey(), JSON.stringify(trimmed));
    }
};

// 사이드바 컴포넌트
const Sidebar = ({ profile }) => {
    const menuItems = [
        { icon: '📅', label: '캘린더', path: '/home.html' },
        { icon: '👥', label: '친구', path: '/friends.html' },
        { icon: '🎯', label: '목표방', path: '/goals.html' },
        { icon: '💬', label: '메시지', path: '/messages.html' },
        { icon: '📊', label: '실패 분석', path: '/analysis.html', active: true },
        { icon: '🤖', label: 'AI 학습봇', path: '/ai.html' },
        { icon: '⏱️', label: '포커스 모드', path: '/focus.html' },
        { icon: '🎮', label: '캐릭터', path: '/character.html' },
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
                    <div className="profile-id">@{TokenManager.getLoginId() || 'user'}</div>
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

// 막대 그래프 컴포넌트
const BarChart = ({ data, maxValue }) => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const max = maxValue || Math.max(...data, 1);
    
    return (
        <div className="bar-chart">
            <div className="chart-bars">
                {data.map((value, i) => (
                    <div key={i} className="bar-container">
                        <div 
                            className="bar" 
                            style={{ height: `${(value / max) * 100}%` }}
                            title={`${days[i]}: ${value}회`}
                        >
                            <span className="bar-value">{value}</span>
                        </div>
                        <span className="bar-label">{days[i]}</span>
                    </div>
                ))}
            </div>
            <div className="chart-y-axis">
                <span>{max}</span>
                <span>{Math.round(max / 2)}</span>
                <span>0</span>
            </div>
        </div>
    );
};

// 파이 차트 컴포넌트
const PieChart = ({ data }) => {
    const colors = ['#ef5350', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0'];
    const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
    
    let currentAngle = 0;
    const segments = data.map((item, i) => {
        const percentage = (item.count / total) * 100;
        const angle = (item.count / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;
        
        return {
            ...item,
            percentage: Math.round(percentage),
            color: colors[i % colors.length],
            startAngle,
            angle
        };
    });
    
    // CSS conic-gradient 생성
    const gradientParts = segments.map((seg, i) => {
        const start = segments.slice(0, i).reduce((sum, s) => sum + s.percentage, 0);
        const end = start + seg.percentage;
        return `${seg.color} ${start}% ${end}%`;
    });
    
    return (
        <div className="pie-chart-container">
            <div 
                className="pie-chart"
                style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}
            />
            <div className="pie-legend">
                {segments.map((seg, i) => (
                    <div key={i} className="legend-item">
                        <span className="legend-color" style={{ background: seg.color }}></span>
                        <span className="legend-label">{seg.name} ({seg.percentage}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// AI 조언 생성 함수
const generateAdvice = (analysisData) => {
    const advice = [];
    
    const { dayOfWeekStats, reasonStats, successRate, totalFailures } = analysisData;
    
    // 1. 가장 취약한 요일 분석
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const maxFailDay = dayOfWeekStats.indexOf(Math.max(...dayOfWeekStats));
    const weekendFailures = dayOfWeekStats[5] + dayOfWeekStats[6];
    const weekdayFailures = dayOfWeekStats.slice(0, 5).reduce((a, b) => a + b, 0);
    
    if (weekendFailures > weekdayFailures * 0.5) {
        advice.push({
            type: 'warning',
            icon: '⚠️',
            title: '주말에 실패율이 높습니다',
            description: '주말에는 일정이 불규칙해지는 경향이 있습니다. 주말 목표를 좀 더 유연하게 설정해보세요.'
        });
    }
    
    // 2. 가장 많은 실패 원인 분석
    if (reasonStats.length > 0) {
        const topReason = reasonStats[0];
        if (topReason.name === '시간 부족' || topReason.name.includes('시간')) {
            advice.push({
                type: 'tip',
                icon: '💡',
                title: '시간 부족이 가장 큰 원인입니다',
                description: '목표를 달성할 시간을 미리 캘린더에 블록해두는 것을 추천합니다.'
            });
        } else if (topReason.name === '피로' || topReason.name.includes('피로')) {
            advice.push({
                type: 'tip',
                icon: '💡',
                title: '피로가 주요 원인입니다',
                description: '충분한 수면과 휴식을 취하고, 목표량을 조금 줄여보세요.'
            });
        } else if (topReason.name.includes('동기') || topReason.name.includes('의지')) {
            advice.push({
                type: 'tip',
                icon: '💡',
                title: '동기 부여가 필요합니다',
                description: '작은 목표부터 시작해서 성취감을 느껴보세요. 달성 시 보상을 설정하는 것도 좋습니다.'
            });
        }
    }
    
    // 3. 성공률 기반 조언
    if (successRate < 50) {
        advice.push({
            type: 'tip',
            icon: '💡',
            title: '목표 난이도를 조정해보세요',
            description: '현재 성공률이 낮습니다. 목표를 더 작은 단위로 쪼개서 설정해보세요. 예: 30분 → 15분'
        });
    } else if (successRate >= 80) {
        advice.push({
            type: 'success',
            icon: '🎉',
            title: '훌륭한 성과입니다!',
            description: '높은 성공률을 유지하고 있어요. 조금씩 목표를 높여봐도 좋을 것 같습니다.'
        });
    }
    
    // 기본 조언 추가
    if (advice.length === 0) {
        advice.push({
            type: 'tip',
            icon: '💡',
            title: '꾸준한 기록이 중요합니다',
            description: '실패를 기록하고 분석하는 것만으로도 큰 발전입니다. 계속 노력해주세요!'
        });
    }
    
    return advice;
};

// 메인 분석 페이지 컴포넌트
const AnalysisPage = () => {
    const [myProfile, setMyProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState(null);
    const [failureRecords, setFailureRecords] = useState([]);
    const [analysisData, setAnalysisData] = useState({
        totalFailures: 0,
        successRate: 0,
        weakestDay: '없음',
        dayOfWeekStats: [0, 0, 0, 0, 0, 0, 0],
        reasonStats: [],
        recentFailures: []
    });
    
    const userId = TokenManager.getUserId();
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    
    // 프로필 로드
    const loadMyProfile = async () => {
        try {
            const data = await profileApi.getMyProfile(userId);
            setMyProfile(data);
        } catch (err) {
            console.error('프로필 로드 실패:', err);
            setMyProfile({
                nickname: TokenManager.getNickname() || '사용자',
                level: 1,
                xp: 0
            });
        }
    };
    
    // 월간 데이터 로드
    const loadMonthlyData = async () => {
        try {
            const today = new Date();
            const data = await calendarApi.getMonthly(userId, today.toISOString().split('T')[0]);
            setMonthlyData(data);
            return data;
        } catch (err) {
            console.error('월간 데이터 로드 실패:', err);
            return null;
        }
    };
    
    // 분석 데이터 계산
    const calculateAnalysis = (monthData, records) => {
        // 요일별 실패 횟수 계산
        const dayOfWeekStats = [0, 0, 0, 0, 0, 0, 0];
        let totalGoals = 0;
        let failedGoals = 0;
        const recentFailures = [];
        
        // 월간 데이터에서 실패 목표 분석
        if (monthData?.days) {
            monthData.days.forEach(day => {
                if (day.goals) {
                    day.goals.forEach(goal => {
                        totalGoals++;
                        if (goal.status === 'FAILED') {
                            failedGoals++;
                            // 요일 계산 (0=일요일이므로 조정)
                            const date = new Date(day.date);
                            const dayOfWeek = date.getDay();
                            const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                            dayOfWeekStats[adjustedDay]++;
                            
                            recentFailures.push({
                                title: goal.title,
                                category: goal.category || '기타',
                                date: day.date,
                                reason: '기록 없음'
                            });
                        }
                    });
                }
            });
        }
        
        // 로컬 저장소의 실패 기록 분석 (태그 정보 포함)
        const reasonCount = {};
        records.forEach(record => {
            if (record.tags) {
                record.tags.forEach(tag => {
                    const tagName = typeof tag === 'string' ? tag : tag.name;
                    reasonCount[tagName] = (reasonCount[tagName] || 0) + 1;
                });
            }
            if (record.reason) {
                reasonCount[record.reason] = (reasonCount[record.reason] || 0) + 1;
            }
            
            // 요일 통계 업데이트
            if (record.date) {
                const date = new Date(record.date);
                const dayOfWeek = date.getDay();
                const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                if (!monthData?.days) {
                    dayOfWeekStats[adjustedDay]++;
                }
            }
        });
        
        // 실패 원인 통계 정렬
        const reasonStats = Object.entries(reasonCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        
        // 기본 원인 추가 (데이터가 없을 경우)
        if (reasonStats.length === 0 && failedGoals > 0) {
            reasonStats.push(
                { name: '시간 부족', count: Math.ceil(failedGoals * 0.35) },
                { name: '동기 부여 부족', count: Math.ceil(failedGoals * 0.25) },
                { name: '피로', count: Math.ceil(failedGoals * 0.20) },
                { name: '예상치 못한 일정', count: Math.ceil(failedGoals * 0.15) },
                { name: '기타', count: Math.ceil(failedGoals * 0.05) }
            );
        }
        
        // 가장 취약한 요일 찾기
        const maxFailures = Math.max(...dayOfWeekStats);
        const weakestDayIndex = dayOfWeekStats.indexOf(maxFailures);
        const weakestDay = maxFailures > 0 ? days[weakestDayIndex] + '요일' : '없음';
        
        // 성공률 계산
        const successRate = totalGoals > 0 ? Math.round(((totalGoals - failedGoals) / totalGoals) * 100) : 100;
        
        // 최근 실패 기록 합치기
        const allRecentFailures = [...recentFailures, ...records.slice(0, 5)].slice(0, 10);
        
        return {
            totalFailures: failedGoals + records.length,
            successRate,
            weakestDay,
            dayOfWeekStats,
            reasonStats,
            recentFailures: allRecentFailures,
            lastMonthChange: -20 // 더미 데이터 (지난 달 대비)
        };
    };
    
    // 초기 로드
    useEffect(() => {
        if (!TokenManager.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }
        
        const loadData = async () => {
            setLoading(true);
            await loadMyProfile();
            const monthData = await loadMonthlyData();
            const records = failureStorage.getRecords();
            setFailureRecords(records);
            
            const analysis = calculateAnalysis(monthData, records);
            setAnalysisData(analysis);
            setLoading(false);
        };
        
        loadData();
    }, []);
    
    // AI 조언 생성
    const advice = generateAdvice(analysisData);
    
    if (loading) {
        return (
            <div className="app-container">
                <Sidebar profile={myProfile} />
                <main className="main-content">
                    <div className="loading-container">
                        <div className="loading">데이터를 분석하고 있습니다...</div>
                    </div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="app-container">
            <Sidebar profile={myProfile} />
            
            <main className="main-content">
                {/* 헤더 */}
                <div className="page-header">
                    <div className="page-title">
                        <span className="title-icon">📊</span>
                        <div>
                            <h1>실패 분석</h1>
                            <p>실패에서 배우고 개선하세요</p>
                        </div>
                    </div>
                </div>
                
                {/* 요약 카드 */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <h3>총 실패 횟수 (이번 달)</h3>
                        <div className="summary-value">{analysisData.totalFailures}회</div>
                        <div className="summary-bar">
                            <div className="summary-progress" style={{ width: '100%', background: '#26a69a' }}></div>
                        </div>
                        <div className="summary-change negative">
                            지난 달 대비 {analysisData.lastMonthChange}%
                        </div>
                    </div>
                    
                    <div className="summary-card">
                        <h3>평균 성공률</h3>
                        <div className="summary-value">{analysisData.successRate}%</div>
                        <div className="summary-bar">
                            <div className="summary-progress" style={{ width: `${analysisData.successRate}%`, background: '#26a69a' }}></div>
                        </div>
                        <div className="summary-change positive">
                            개선 중 📈
                        </div>
                    </div>
                    
                    <div className="summary-card">
                        <h3>가장 취약한 요일</h3>
                        <div className="summary-value">{analysisData.weakestDay}</div>
                        <div className="summary-badge">실패율 높음</div>
                    </div>
                </div>
                
                {/* 차트 영역 */}
                <div className="charts-container">
                    {/* 요일별 실패 패턴 */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h2>요일별 실패 패턴</h2>
                            <p>어떤 요일에 실패가 많은지 확인하세요</p>
                        </div>
                        <BarChart 
                            data={analysisData.dayOfWeekStats} 
                            maxValue={Math.max(...analysisData.dayOfWeekStats, 8)}
                        />
                    </div>
                    
                    {/* 실패 원인 분석 */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h2>실패 원인 분석</h2>
                            <p>가장 자주 발생하는 실패 원인</p>
                        </div>
                        {analysisData.reasonStats.length > 0 ? (
                            <PieChart data={analysisData.reasonStats} />
                        ) : (
                            <div className="empty-chart">
                                <p>아직 실패 원인 데이터가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* AI 개선 조언 */}
                <div className="advice-card">
                    <div className="advice-header">
                        <span className="advice-icon">💡</span>
                        <div>
                            <h2>AI 개선 조언</h2>
                            <p>데이터 기반 맞춤형 조언</p>
                        </div>
                    </div>
                    <div className="advice-list">
                        {advice.map((item, i) => (
                            <div key={i} className={`advice-item ${item.type}`}>
                                <span className="advice-item-icon">{item.icon}</span>
                                <div className="advice-content">
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* 최근 실패 기록 */}
                <div className="history-card">
                    <div className="history-header">
                        <span className="history-icon">📅</span>
                        <h2>최근 실패 기록</h2>
                    </div>
                    <div className="history-list">
                        {analysisData.recentFailures.length > 0 ? (
                            analysisData.recentFailures.slice(0, 5).map((record, i) => (
                                <div key={i} className="history-item">
                                    <div className="history-info">
                                        <div className="history-title">{record.title || record.goalTitle || '목표'}</div>
                                        <div className="history-tags">
                                            <span className="category-tag">{record.category || '기타'}</span>
                                            {record.tags?.map((tag, j) => (
                                                <span key={j} className="reason-tag">
                                                    {typeof tag === 'string' ? tag : tag.name}
                                                </span>
                                            ))}
                                            {record.reason && (
                                                <span className="reason-tag">{record.reason}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="history-date">
                                        {record.date ? new Date(record.date).toLocaleDateString('ko-KR') : '날짜 없음'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-history">
                                <p>아직 실패 기록이 없습니다. 🎉</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// React 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AnalysisPage />);

