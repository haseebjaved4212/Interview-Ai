import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';

const PublicNavbar = () => {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 12) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={`public-header ${scrolled ? 'public-header--scrolled' : ''}`}>
            <nav className="public-nav" aria-label="Main Navigation">
                {/* Brand Wordmark */}
                <Link to="/" className="public-nav__brand" onClick={closeMenu}>
                    <span className="public-nav__mark" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                    </span>
                    <span className="public-nav__wordmark">HireCraft</span>
                </Link>

                {/* Desktop Anchor Links */}
                <div className="public-nav__links">
                    <a href="#how-it-works" className="public-nav__link">How it works</a>
                    <a href="#features" className="public-nav__link">Features</a>
                </div>

                {/* Desktop Auth Actions */}
                <div className="public-nav__actions">
                    {user ? (
                        <Link to="/dashboard" className="button primary-button public-nav__btn">
                            Go to dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="public-nav__link">
                                Log in
                            </Link>
                            <Link to="/register" className="button primary-button public-nav__btn">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    className="public-nav__toggle"
                    onClick={() => setMenuOpen(open => !open)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span className={`public-nav__toggle-bar ${menuOpen ? 'public-nav__toggle-bar--open' : ''}`} />
                </button>
            </nav>

            {/* Mobile Collapsed Menu */}
            <div className={`public-nav__mobile-menu ${menuOpen ? 'public-nav__mobile-menu--open' : ''}`}>
                <div className="public-nav__mobile-links">
                    <a href="#how-it-works" className="public-nav__mobile-link" onClick={closeMenu}>
                        How it works
                    </a>
                    <a href="#features" className="public-nav__mobile-link" onClick={closeMenu}>
                        Features
                    </a>
                </div>
                <div className="public-nav__mobile-actions">
                    {user ? (
                        <Link to="/dashboard" className="button primary-button public-nav__mobile-btn" onClick={closeMenu}>
                            Go to dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="button secondary-button public-nav__mobile-btn" onClick={closeMenu}>
                                Log in
                            </Link>
                            <Link to="/register" className="button primary-button public-nav__mobile-btn" onClick={closeMenu}>
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PublicNavbar;
