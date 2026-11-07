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
            navigate('/dashboard');
        }
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <h1 className="loading-title">Authenticating...</h1>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-split">
                <aside className="auth-panel">
                    <Link to="/" className="auth-wordmark">HireCraft</Link>
                    <div className="auth-panel__content">
                        <h2 className="auth-panel__statement">
                            Prepare for the job you want, not a generic one.
                        </h2>
                        <p className="auth-panel__sub">
                            Paste a job description, add your profile, get a plan built around the gap.
                        </p>
                    </div>
                </aside>

                <div className="auth-form-wrapper">
                    <div className="form-container">
                        <header className="form-header">
                            <h1 className="form-title">Welcome back</h1>
                            <p className="form-sub">Pick up where you left off.</p>
                        </header>

                        {authError && (
                            <div className="form-error-alert" role="alert">
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
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
                                    autoComplete="email"
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
                                    autoComplete="current-password"
                                />
                            </div>
                            <button className="button primary-button auth-submit">Login</button>
                        </form>

                        <p className="auth-switch">
                            Don't have an account? <Link to="/register">Create account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
