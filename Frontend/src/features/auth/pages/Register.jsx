import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import '../auth.form.scss';

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
        <main>
            <div className="form-container">
                <h1>Register</h1>

                {authError && (
                    <div style={{
                        color: "var(--color-error, #EF4444)",
                        backgroundColor: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.85rem"
                    }}>
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
        </main>
    );
};

export default Register;
