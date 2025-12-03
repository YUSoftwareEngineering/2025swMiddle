const { useState, useEffect, useRef, useMemo } = React;

const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '');
};

const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

const parseAnswer = (rawAnswerText) => {
    const defaultResult = {
        answer: rawAnswerText,
        source: '',
        followUpQuestions: [],
        isError: rawAnswerText.includes("죄송합니다. 해당 질문에 답변드릴 수 없습니다.")
    };

    if (defaultResult.isError) {
        return defaultResult;
    }

    try {
        const sourceDelimiter = '---출처---';
        const followUpDelimiter = '---꼬리 질문---';

        const [part1, part2 = ''] = rawAnswerText.split(sourceDelimiter);
        const [sourcePart, followUpPart = ''] = part2.split(followUpDelimiter);

        const answer = part1.trim();
        const source = sourcePart.trim().replace(/\*/g, '').replace('핵심 출처:', '출처:').replace('핵심 출처 :', '출처:').trim();

        let followUpQuestions = followUpPart.trim().split('\n').filter(q => q.trim().length > 0);

        followUpQuestions.push('새 질문 시작하기');
        followUpQuestions.push('대화 종료');

        return {
            answer: answer,
            source: source,
            followUpQuestions: followUpQuestions,
            isError: false
        };
    } catch (e) {
        return defaultResult;
    }
};

const MAX_QUESTION_LENGTH = 200;

// === Sidebar 컴포넌트 ===
const Sidebar = ({ profile }) => {
    const menuItems = [
        { icon: '📅', label: '캘린더', path: '/calendar.html' },
        { icon: '👥', label: '친구', path: '/friends.html' },
        { icon: '🎯', label: '목표방', path: '/goals.html' },
        { icon: '💬', label: '메시지', path: '/messages.html' },
        { icon: '📊', label: '실패 분석', path: '/analysis.html' },
        { icon: '🧠', label: 'AI 학습봇', path: '/ai.html', active: true },
        { icon: '💡', label: '포커스 모드', path: '/focus.html' },
        { icon: '🐱', label: '캐릭터', path: '/character.html' },
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
                <button className="menu-item logout-btn" onClick={() => { tokenManager.clear(); window.location.href = '/index.html'; }}>
                    <span className="menu-icon">🚪</span><span>로그아웃</span>
                </button>
            </div>
        </aside>
    );
};

// === HistoryPanel 컴포넌트 ===
const HistoryPanel = ({ userId, onSelectHistory, selectedHistoryId, refreshTrigger }) => {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cleanupAlert, setCleanupAlert] = useState(false);

    useEffect(() => {
        loadHistory();
    }, [userId, refreshTrigger]);

    const loadHistory = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const params = { page: 0, size: 10 };
            const response = await studentBotApi.getHistoryList(params);

            setHistoryList(response.items || []);
            setCleanupAlert(response.shouldCleanup || false);
        } catch (err) {
            console.error('히스토리 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMore = () => {
        window.location.href = '/history.html';
    };

    if (loading && historyList.length === 0) return <div className="history-panel-loading">로딩 중...</div>;

    return (
        <div className="history-panel">
            <div className="panel-header">
                <span className="panel-icon">⏱️</span>
                <h2>대화 기록</h2>
                <button className="btn-view-more" onClick={handleViewMore}>
                    더보기
                </button>
            </div>

            <div className="history-list-compact">
                {historyList.length === 0 ? (
                    <p className="empty-history">기록이 없습니다.</p>
                ) : (
                    historyList.map(item => (
                        <div
                            key={item.id}
                            className={`history-item-compact ${item.id === selectedHistoryId ? 'active' : ''}`}
                            onClick={() => onSelectHistory(item)}
                        >
                            <h4 className="item-title">{item.title}</h4>
                            <div className="item-meta">
                                <span className="item-date">{formatDate(item.startedAt)}</span>
                                <span className="item-count">{item.messageCount}개</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cleanupAlert && (
                <div className="cleanup-alert-compact">
                    ⚠️ 기록 정리가 필요합니다!
                    <button onClick={handleViewMore}>관리</button>
                </div>
            )}
        </div>
    );
};

// === ChatPanel 컴포넌트 ===
const ChatPanel = ({ userId, onNewSessionStart, selectedHistory, setCurrentQuestionFromTopic }) => {
    const [historyId, setHistoryId] = useState(null);
    const [difficulty, setDifficulty] = useState('INTERMEDIATE');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [systemError, setSystemError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages, isLoading]);

    useEffect(() => {
        if (selectedHistory) {
            loadHistoryDetail(selectedHistory.id);
        } else {
            setHistoryId(null);
            setMessages([
                 { role: 'bot', content: "안녕하세요! 저는 여러분의 학습을 도와주는 AI 학습봇입니다. 무엇을 도와드릴까요?", createdAt: new Date() }
            ]);
        }
    }, [selectedHistory]);

    useEffect(() => {
        if (setCurrentQuestionFromTopic) {
             setCurrentQuestion(setCurrentQuestionFromTopic);
        }
    }, [setCurrentQuestionFromTopic]);

    const loadHistoryDetail = async (id) => {
        try {
            setIsLoading(true);
            const response = await studentBotApi.getHistoryDetail(id);

            const loadedMessages = response.messages.map(msg => ({
                role: msg.role === 'USER' ? 'user' : 'bot',
                content: msg.content,
                createdAt: new Date(msg.createdAt),
            }));

            setHistoryId(response.id);
            setMessages(loadedMessages);

        } catch (err) {
            console.error('히스토리 상세 로드 실패:', err);
            setSystemError('과거 대화 기록을 불러오는 데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const startNewSession = () => {
        setHistoryId(null);
        setMessages([
             { role: 'bot', content: "새 질문을 시작합니다. 궁금한 것을 말씀해주세요.", createdAt: new Date() }
        ]);
        setCurrentQuestion('');
        setSystemError(null);
        onNewSessionStart();
    };

    const handleAsk = async (questionText, isFollowUp = false) => {
        if (!questionText.trim()) return;

        if (questionText === '대화 종료') {
            alert('대화가 종료되고 Q&A 히스토리에 저장됩니다.');
            startNewSession();
            return;
        }
        if (questionText === '새 질문 시작하기') {
            startNewSession();
            return;
        }

        setIsLoading(true);
        setSystemError(null);

        const newUserMessage = { role: 'user', content: questionText, createdAt: new Date() };
        setMessages(prev => [...prev, newUserMessage]);

        if (!isFollowUp) {
            setCurrentQuestion('');
        }

        try {
            const request = {
                historyId: historyId,
                questionText: questionText,
                difficulty: difficulty
            };

            const response = await studentBotApi.ask(request);

            const parsed = parseAnswer(response.answerText);
            const newBotMessage = {
                role: 'bot',
                content: parsed.answer,
                createdAt: new Date(),
                isError: parsed.isError
            };

            setMessages(prev => [...prev, newBotMessage]);
            setHistoryId(response.historyId);

        } catch (error) {
            console.error("AI 학습봇 오류:", error);
            setSystemError(`시스템 문제 발생: ${error.message}`);
        } finally {
            setIsLoading(false);
            if (historyId === null) onNewSessionStart();
        }
    };

    const handleFollowUpSelect = (followUpQuestion) => {
        handleAsk(followUpQuestion, true);
    };

    const MessageItem = ({ message }) => {
        const isBot = message.role === 'bot';

        const isLatestBotMessage = isBot && message === messages[messages.length - 1];
        const answerData = isLatestBotMessage ? parseAnswer(message.content) : null;

        return (
            <div className={`message-item ${isBot ? 'bot-message' : 'user-message'}`}>
                <div className="message-content-wrapper">
                    <div className="message-header">
                        <span className="message-role">{isBot ? 'AI' : '나'}</span>
                        <span className="message-time">
                            {formatTime(message.createdAt)}
                        </span>
                    </div>

                    <div className="message-bubble">
                        <div className="message-text">
                            {message.content}
                        </div>

                        {isLatestBotMessage && answerData && answerData.followUpQuestions.length > 0 && !answerData.isError && (
                            <div className="follow-up-questions">
                                <div className="follow-up-list">
                                    {answerData.followUpQuestions
                                        .filter(q => q !== '새 질문 시작하기' && q !== '대화 종료')
                                        .map((q, index) => (
                                        <button
                                            key={index}
                                            className="btn-follow-up-compact"
                                            onClick={() => handleFollowUpSelect(q)}
                                            disabled={isLoading}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="chat-panel">
            <div className="panel-header">
                <span className="panel-icon">💬</span>
                <h2>학습 상담</h2>
                <button className="btn-new-session" onClick={startNewSession}>
                    {historyId ? '새 대화 시작' : '시작'}
                </button>
            </div>

            <p className="chat-subtitle">무엇이든 물어보세요. AI가 도와드립니다!</p>

            <div className="chat-area">
                {messages.length <= 1 && !isLoading && (
                    <div className="empty-chat-state">
                        <div className="empty-icon">👋</div>
                        <p>AI 학습봇에게 질문해보세요!</p>
                    </div>
                )}

                <div className="message-list">
                    {messages.map((msg, index) => (
                        <MessageItem key={index} message={msg} />
                    ))}

                    {isLoading && (
                        <div className="loading-indicator">
                            <div className="message-item bot-message loading-placeholder">
                                <div className="message-content-wrapper">
                                    <div className="message-header"><span className="message-role">AI</span></div>
                                    <div className="message-bubble"><div className="message-text">답변 생성 중...</div></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {systemError && (
                <div className="error-box">
                    ⚠️ {systemError}
                </div>
            )}

            <div className="input-area">
                <textarea
                    placeholder={isLoading ? "답변 생성 중..." : "질문을 입력하세요..."}
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAsk(currentQuestion, false);
                        }
                    }}
                    maxLength={MAX_QUESTION_LENGTH}
                    disabled={isLoading}
                />
                <button
                    className="btn-send"
                    onClick={() => handleAsk(currentQuestion, false)}
                    disabled={isLoading || currentQuestion.trim().length === 0}
                >
                    <span className="send-icon">▲</span>
                </button>
            </div>
        </div>
    );
};

// === RecommendedTopics 컴포넌트 ===
const RecommendedTopics = ({ onTopicClick }) => {
    const topics = [
        { icon: '🕰️', label: '포모도로 기법' },
        { icon: '📝', label: '노트 필기법' },
        { icon: '🧠', label: '집중력 향상' },
        { icon: '☀️', label: '아침 루틴' },
    ];

    return (
        <div className="recommend-panel">
            <h3 className="section-title">추천 주제</h3>
            <p className="section-subtitle">인기 있는 학습 주제를 클릭해보세요</p>
            <div className="topic-list">
                {topics.map(topic => (
                    <div
                        key={topic.label}
                        className="topic-item"
                        onClick={() => onTopicClick(topic.label)}
                    >
                        <span className="topic-icon">{topic.icon}</span>
                        <p className="topic-label">{topic.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// === 메인 페이지 컴포넌트 ===
const AILearningBotPage = () => {
    const [myProfile, setMyProfile] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [topicQuestion, setTopicQuestion] = useState('');
    const userId = tokenManager.getUserId();

    const loadMyProfile = async () => {
        try {
            // profileApi가 api.js에 정의되어 있다고 가정
            const data = await profileApi.getMyProfile(userId);
            setMyProfile(data);
        } catch (err) {
            setMyProfile({
                nickname: tokenManager.getNickname() || '사용자',
                userId: userId,
                level: 1,
                xp: 0
            });
        }
    };

    useEffect(() => {
        if (!tokenManager.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }
        loadMyProfile();
        setSelectedHistory(null);
    }, []);

    const handleHistorySelect = (historyItem) => {
        setSelectedHistory(historyItem);
        setTopicQuestion('');
    };

    const handleNewSessionStart = () => {
        setSelectedHistory(null);
        setRefreshTrigger(prev => prev + 1);
        setTopicQuestion('');
    };

    const handleTopicClick = (topicLabel) => {
        if (confirm(`'${topicLabel}'에 대해 새 대화로 질문하시겠습니까?`)) {
             setSelectedHistory(null);
             setTopicQuestion(topicLabel);
        }
    };

    if (!myProfile) {
        return <div className="loading">프로필 정보 로딩 중...</div>;
    }

    return (
        <div className="app-container">
            <Sidebar profile={myProfile} />

            <main className="main-content">
                <div className="page-header">
                    <div className="page-title">
                        <span className="title-icon">🧠</span>
                        <div>
                            <h1>AI 학습봇</h1>
                            <p>학습과 자기계발에 대해 질문하세요</p>
                        </div>
                    </div>
                </div>

                <div className="ai-layout-container">

                    <div className="layout-left">
                        <HistoryPanel
                            userId={userId}
                            onSelectHistory={handleHistorySelect}
                            selectedHistoryId={selectedHistory?.id}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>

                    <div className="layout-right">
                        <ChatPanel
                            userId={userId}
                            onNewSessionStart={handleNewSessionStart}
                            selectedHistory={selectedHistory}
                            setCurrentQuestionFromTopic={topicQuestion}
                        />
                    </div>

                </div>

                <div className="recommend-section">
                    <RecommendedTopics onTopicClick={handleTopicClick} />
                </div>
            </main>
        </div>
    );
};