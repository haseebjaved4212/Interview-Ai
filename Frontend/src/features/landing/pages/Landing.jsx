import { Link } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import PublicNavbar from '../components/PublicNavbar';
import HeroPreviewCard from '../components/HeroPreviewCard';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="landing-page">
            <PublicNavbar />

            <main id="main-content">
                {/* ── 2. Hero Section ── */}
                <section className="hero-section" aria-labelledby="hero-title">
                    <div className="landing-container">
                        <div className="hero-grid">
                            <div className="hero-content">
                                <h1 id="hero-title" className="hero-title">
                                    Prepare with intention. Master your next <span className="highlight">interview</span>.
                                </h1>

                                <p className="hero-lead">
                                    Align your resume against any target job description. Generate focused technical and behavioral questions with interviewer intention, model answers, a day by day roadmap, and an ATS friendly resume.
                                </p>

                                <div className="hero-actions">
                                    {user ? (
                                        <Link to="/dashboard" className="button primary-button hero-btn">
                                            Go to dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/register" className="button primary-button hero-btn">
                                                Get started
                                            </Link>
                                            <Link to="/login" className="button secondary-button hero-btn">
                                                Log in
                                            </Link>
                                        </>
                                    )}
                                </div>

                                <p className="hero-facts">
                                    PDF or DOCX resume, ready in about 30 seconds
                                </p>
                            </div>

                            <HeroPreviewCard />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Landing;
