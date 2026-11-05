import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loading, handleRegister, authError } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await handleRegister({ username, email, password });
        if (result?.success) {
            navigate("/");
        }
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Creating your account...</h1>
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
                        Join candidates who prepare with clarity, deep question rationale, and structured execution.
                    </p>
                    <div className="auth-editorial-panel__footer">
                        <span>Edition 2026</span>
                        <span className="auth-editorial-panel__dot">&bull;</span>
                        <span>Candidate Workspace</span>
                    </div>
                </aside>

                <div className="form-container">
                    <h1>Register</h1>

                    {authError && (
                        <div className="form-error-alert" role="alert">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); }}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                required
                            />
                        </div>
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

                        <button className="button primary-button">Register</button>
                    </form>

                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </main>
    );
};

export default Register;
