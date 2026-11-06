import PublicNavbar from '../components/PublicNavbar';

const Landing = () => {
    return (
        <div className="landing-page">
            <PublicNavbar />
            <main id="main-content">
                {/* Subsequent stages: Hero, Workflow, Features, CTA will be plugged in here */}
            </main>
        </div>
    );
};

export default Landing;
