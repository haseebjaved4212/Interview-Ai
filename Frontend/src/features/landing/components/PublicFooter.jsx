import { Link } from 'react-router';

const PublicFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="public-footer">
            <div className="landing-container">
                <div className="public-footer__inner">
                    <div className="public-footer__brand-block">
                        <Link to="/" className="public-footer__brand">
                            <span className="public-footer__mark" aria-hidden="true">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                    <polyline points="2 17 12 22 22 17" />
                                    <polyline points="2 12 12 17 22 12" />
                                </svg>
                            </span>
                            <span className="public-footer__wordmark">HireCraft</span>
                        </Link>
                        <p className="public-footer__desc">
                            Targeted interview intelligence, structured questions, and candidate preparation strategy.
                        </p>
                    </div>

                    <div className="public-footer__nav">
                        <a href="#how-it-works" className="public-footer__link">How it works</a>
                        <a href="#features" className="public-footer__link">Features</a>
                        <Link to="/login" className="public-footer__link">Log in</Link>
                        <Link to="/register" className="public-footer__link">Sign up</Link>
                    </div>
                </div>

                <div className="public-footer__bottom">
                    <p className="public-footer__copyright">
                        &copy; {currentYear} HireCraft. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
