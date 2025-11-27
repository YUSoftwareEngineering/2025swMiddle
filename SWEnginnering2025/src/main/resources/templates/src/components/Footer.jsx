// 푸터 컴포넌트
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-text">
                    © 2025 SelfGrow. 함께 성장하는 소셜 자기개발 플랫폼
                </p>
                <div className="footer-links">
                    <a href="/about.html">소개</a>
                    <a href="/privacy.html">개인정보처리방침</a>
                    <a href="/terms.html">이용약관</a>
                </div>
            </div>
        </footer>
    );
};

window.Footer = Footer;

