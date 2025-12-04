const { useState, useEffect } = React;

// 사이드바 컴포넌트
const Sidebar = ({ profile }) => {
    const menuItems = [
        { icon: '📅', label: '캘린더', path: '/home.html' },
        { icon: '👥', label: '친구', path: '/friends.html' },
        { icon: '🎯', label: '목표방', path: '/goalrooms.html' },
        { icon: '📊', label: '실패 분석', path: '/analysis.html', active: true },
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

// 막대 그래프 컴포넌트
const BarChart = ({ data, maxValue }) => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const chartData = data || [0, 0, 0, 0, 0, 0, 0]; // 기본값 설정
    const actualMax = Math.max(...chartData);
    const max = Math.max(actualMax, maxValue || 1, 1); // 최소 1 보장
    
    // Y축 눈금 계산 (5단계로 나눔)
    const step = Math.ceil(max / 4) || 1;
    const adjustedMax = Math.ceil(max / step) * step;
    const yAxisLabels = [];
    for (let i = adjustedMax; i >= 0; i -= step) {
        yAxisLabels.push(i);
    }
    
    return (
        <div className="bar-chart">
            <div className="chart-y-axis-left">
                {yAxisLabels.map((val, i) => (
                    <span key={i}>{val}</span>
                ))}
            </div>
            <div className="chart-area">
                <div className="chart-grid">
                    {yAxisLabels.map((_, i) => (
                        <div key={i} className="grid-line"></div>
                    ))}
                </div>
                <div className="chart-bars">
                    {chartData.map((value, i) => {
                        const heightPercent = adjustedMax > 0 ? (value / adjustedMax) * 100 : 0;
                        return (
                            <div key={i} className="bar-container">
                                <div 
                                    className="bar"
                                    style={{ 
                                        height: `${heightPercent}%`,
                                        background: '#26a69a',
                                        minHeight: value > 0 ? '4px' : '0'
                                    }}
                                    title={`${days[i]}요일: ${value}회 실패`}
                                />
                                <span className="bar-label">{days[i]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// 파이 차트 컴포넌트
const PieChart = ({ data }) => {
    // 더 선명하고 현대적인 색상 팔레트
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#6C5CE7', '#FD79A8', '#00B894', '#0984E3'];
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
    const dayOfWeekStats = analysisData?.dayOfWeekStats || [0, 0, 0, 0, 0, 0, 0];
    const reasonStats = analysisData?.reasonStats || [];
    const successRate = analysisData?.successRate || 0;
    const totalFailures = analysisData?.totalFailures || 0;
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    
    // 1. 가장 취약한 요일 분석
    const maxFailDay = dayOfWeekStats.indexOf(Math.max(...dayOfWeekStats));
    const weekendFailures = (dayOfWeekStats[5] || 0) + (dayOfWeekStats[6] || 0);
    const weekdayFailures = dayOfWeekStats.slice(0, 5).reduce((a, b) => a + b, 0);
    
    if (weekendFailures > weekdayFailures * 0.5 && weekendFailures > 0) {
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
            description: '현재 성공률이 낮습니다. 목표를 더 작은 단위로 쪼개서 설정해보세요.'
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
    const [failureTags, setFailureTags] = useState([]);
    const [analysisData, setAnalysisData] = useState({
        totalFailures: 0,
        successRate: 0,
        weakestDay: '없음',
        dayOfWeekStats: [0, 0, 0, 0, 0, 0, 0],
        reasonStats: [],
        recentFailures: [],
        totalGoals: 0,
        completedGoals: 0,
        lastMonthChange: 0,
        monthlySummary: {}
    });
    
    const userId = tokenManager.getUserId();
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const dayKeyMap = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };
    
    // 프로필 로드
    const loadMyProfile = async () => {
        try {
            const data = await profileApi.getMyProfile(userId);
            setMyProfile(data);
        } catch (err) {
            console.error('프로필 로드 실패:', err);
            setMyProfile({ nickname: tokenManager.getNickname() || '사용자', level: 1, xp: 0 });
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
    
    // 백엔드에서 실패 요약 데이터 로드
    const loadFailureSummary = async () => {
        try {
            const data = await failureApi.getSummary({ userId, weeks: 4 });
            return data;
        } catch (err) {
            console.error('실패 요약 로드 실패:', err);
            return null;
        }
    };
    
    // 실패 태그 로드
    const loadFailureTags = async () => {
        try {
            const tags = await failureApi.getTags(userId);
            setFailureTags(tags || []);
            return tags || [];
        } catch (err) {
            console.error('실패 태그 로드 실패:', err);
            return [];
        }
    };
    
    // 분석 데이터 계산
    const calculateAnalysis = (monthData, summaryData, tags) => {
        // 요일별 실패 횟수 (백엔드 데이터 사용)
        let dayOfWeekStats = [0, 0, 0, 0, 0, 0, 0];
        let totalFailures = 0;
        
        // 백엔드 summary 데이터가 있으면 사용
        if (summaryData?.dowSummary) {
            Object.entries(summaryData.dowSummary).forEach(([key, value]) => {
                const idx = dayKeyMap[key];
                if (idx !== undefined) {
                    dayOfWeekStats[idx] = Number(value) || 0;
                    totalFailures += Number(value) || 0;
                }
            });
        }
        
        // 월간 데이터에서 총 목표 수와 완료된 목표 수 계산
        let totalGoals = 0;
        let completedGoals = 0;
        let failedFromCalendar = 0;
        
        if (monthData?.days) {
            monthData.days.forEach(day => {
                // totalGoals와 doneCount 사용 (백엔드가 반환하는 필드)
                totalGoals += day.totalGoals || 0;
                completedGoals += day.doneCount || 0;
                
                // 실패 목표 수 = 총 목표 - 완료 (대략적인 계산)
                const dayFailed = (day.totalGoals || 0) - (day.doneCount || 0);
                if (dayFailed > 0) {
                    failedFromCalendar += dayFailed;
                    
                    // 요일별 실패 통계 (summary 데이터가 없을 경우에만)
                    if (totalFailures === 0) {
                        const date = new Date(day.date);
                        const dayOfWeek = date.getDay();
                        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                        dayOfWeekStats[adjustedDay] += dayFailed;
                    }
                }
            });
        }
        
        // 백엔드 summary 데이터가 없으면 캘린더 기반 실패 횟수 사용
        if (totalFailures === 0) {
            totalFailures = failedFromCalendar;
        }
        
        // 태그 기반 실패 원인 분석
        let reasonStats = [];
        if (tags && tags.length > 0) {
            // 태그 데이터가 있으면 사용 (useCount가 있으면 사용, 없으면 1로 설정)
            reasonStats = tags
                .filter(tag => tag && tag.name)
                .slice(0, 5)
                .map(tag => ({ 
                    name: tag.name, 
                    count: tag.useCount || tag.count || 1 
                }));
        }
        
        console.log('태그 데이터:', tags);
        console.log('실패 원인 통계:', reasonStats);
        
        // 가장 취약한 요일 찾기
        const maxFailures = Math.max(...dayOfWeekStats);
        const weakestDayIndex = dayOfWeekStats.indexOf(maxFailures);
        const weakestDay = maxFailures > 0 ? days[weakestDayIndex] + '요일' : '없음';
        
        // 성공률 계산 (완료된 목표 / 총 목표)
        // 실패가 있으면 100%가 될 수 없음
        let successRate = 0;
        if (totalGoals > 0) {
            successRate = Math.round((completedGoals / totalGoals) * 100);
        } else if (totalFailures > 0) {
            // 목표는 없지만 실패 기록이 있으면 0%
            successRate = 0;
        } else {
            // 데이터가 없으면 표시하지 않음
            successRate = 0;
        }
        
        // 지난 달 대비 변화 계산
        let lastMonthChange = 0;
        if (summaryData?.monthlySummary) {
            const months = Object.keys(summaryData.monthlySummary).sort();
            if (months.length >= 2) {
                const lastMonth = summaryData.monthlySummary[months[months.length - 2]] || 0;
                const thisMonth = summaryData.monthlySummary[months[months.length - 1]] || 0;
                if (lastMonth > 0) {
                    lastMonthChange = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
                }
            }
        }
        
        return {
            totalFailures,
            successRate,
            weakestDay,
            dayOfWeekStats,
            reasonStats,
            recentFailures: [],
            totalGoals,
            completedGoals,
            lastMonthChange,
            monthlySummary: summaryData?.monthlySummary || {}
        };
    };
    
    // 초기 로드
    useEffect(() => {
        if (!tokenManager.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }
        
        const loadData = async () => {
            setLoading(true);
            
            // 병렬로 데이터 로드
            const [_, monthData, summaryData, tags] = await Promise.all([
                loadMyProfile(),
                loadMonthlyData(),
                loadFailureSummary(),
                loadFailureTags()
            ]);
            
            const analysis = calculateAnalysis(monthData, summaryData, tags);
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
                        <h3>총 실패 횟수 (최근 4주)</h3>
                        <div className="summary-value">{analysisData.totalFailures}회</div>
                        <div className="summary-bar">
                            <div className="summary-progress" style={{ width: '100%', background: '#26a69a' }}></div>
                        </div>
                        <div className={`summary-change ${analysisData.lastMonthChange <= 0 ? 'positive' : 'negative'}`}>
                            지난 달 대비 {analysisData.lastMonthChange > 0 ? '+' : ''}{analysisData.lastMonthChange}%
                        </div>
                    </div>
                    
                    <div className="summary-card">
                        <h3>목표 달성률</h3>
                        <div className="summary-value">
                            {analysisData.totalGoals > 0 
                                ? `${analysisData.successRate}%` 
                                : '-'}
                        </div>
                        <div className="summary-bar">
                            <div className="summary-progress" style={{ 
                                width: `${analysisData.totalGoals > 0 ? analysisData.successRate : 0}%`, 
                                background: analysisData.successRate >= 70 ? '#26a69a' : '#f59e0b'
                            }}></div>
                        </div>
                        <div className="summary-change positive">
                            {analysisData.totalGoals > 0 
                                ? `${analysisData.completedGoals}/${analysisData.totalGoals} 완료` 
                                : '데이터 없음'}
                        </div>
                    </div>
                    
                    <div className="summary-card">
                        <h3>가장 취약한 요일</h3>
                        <div className="summary-value">{analysisData.weakestDay}</div>
                        <div className="summary-badge">
                            {analysisData.weakestDay !== '없음' ? '실패율 높음' : '데이터 없음'}
                        </div>
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
                            data={analysisData.dayOfWeekStats || [0,0,0,0,0,0,0]} 
                            maxValue={Math.max(...(analysisData.dayOfWeekStats || [0,0,0,0,0,0,0]), 1)}
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
                                <p className="empty-chart-sub">실패 기록 시 태그를 선택하면 원인 분석이 표시됩니다.</p>
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
                                            {record.reason && record.reason !== '기록 없음' && (
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

