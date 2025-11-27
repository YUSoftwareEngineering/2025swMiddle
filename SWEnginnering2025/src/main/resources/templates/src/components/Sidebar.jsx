// 사이드바 컴포넌트
const Sidebar = ({ currentPath }) => {
    const menuItems = [
        { path: '/home.html', label: '홈', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
        { path: '/goals.html', label: '목표 관리', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
        { path: '/calendar.html', label: '캘린더', icon: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z' },
        { path: '/focus.html', label: '집중 세션', icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' },
        { path: '/failure-log.html', label: '실패 기록', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
        { path: '/friends.html', label: '친구', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-circle">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L9 9H2L7.5 13.5L5.5 21L12 16.5L18.5 21L16.5 13.5L22 9H15L12 2Z" />
                    </svg>
                </div>
                <span className="logo-text">SelfGrow</span>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <a
                        key={item.path}
                        href={item.path}
                        className={`sidebar-item ${currentPath === item.path ? 'active' : ''}`}
                    >
                        <svg viewBox="0 0 24 24" className="sidebar-icon">
                            <path d={item.icon} />
                        </svg>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );
};

window.Sidebar = Sidebar;

