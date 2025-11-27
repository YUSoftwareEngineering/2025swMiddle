// 버튼 컴포넌트
const Button = ({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    size = 'medium',
    disabled = false,
    loading = false,
    onClick,
    className = ''
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const classes = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading && <span className="spinner"></span>}
            {children}
        </button>
    );
};

window.Button = Button;

