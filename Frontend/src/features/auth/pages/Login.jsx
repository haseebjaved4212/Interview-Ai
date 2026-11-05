import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const { loading, handleLogin, authError } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await handleLogin({ email, password });
        if (result?.success) {
            navigate('/');
        }
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Authenticating...</h1>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-layout">
                <aside className="auth-editorial-panel">
                    <div className="auth-editorial-panel__tag">Interview AI Studio</div>
                    <h2 className="auth-editorial-panel__quote">
                        A considered method for your technical career.
                    </h2>
                    <p className="auth-editorial-panel__description">
                        Curated inquiries, structural intent, model solutions, and day by day milestones tailored precisely to your profile.
                    </p>
                    <div className="auth-editorial-panel__footer">
                        <span>Edition 2026</span>
                        <span className="auth-editorial-panel__dot">&bull;</span>
                        <span>Candidate Workspace</span>
                    </div>
                </aside>

                <div className="form-container">
                    <h1>Login</h1>

                    {authError && (
                        <div className="form-error-alert" role="alert">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); }}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); }}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button className="button primary-button">Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </main>
    );
};

export default Login;
