// 탭 컴포넌트
const { useState } = React;

const Tabs = ({ tabs, defaultTab, onChange }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (onChange) {
            onChange(tabId);
        }
    };

    return (
        <div className="tabs-container">
            <div className="tabs-header">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`tab-panel ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {activeTab === tab.id && tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

window.Tabs = Tabs;

