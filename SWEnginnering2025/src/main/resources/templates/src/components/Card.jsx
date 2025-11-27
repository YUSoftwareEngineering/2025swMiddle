// 카드 컴포넌트
const Card = ({ 
    children, 
    title, 
    subtitle,
    onClick,
    className = '',
    hoverable = false
}) => {
    const classes = `card ${hoverable ? 'card-hoverable' : ''} ${className}`.trim();

    return (
        <div className={classes} onClick={onClick}>
            {(title || subtitle) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

window.Card = Card;

