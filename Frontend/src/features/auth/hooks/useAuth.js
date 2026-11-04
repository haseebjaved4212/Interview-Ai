import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;
    const [authError, setAuthError] = useState(null);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setAuthError(null);
        try {
            const data = await login({ email, password });
            if (data?.user) {
                setUser(data.user);
                return { success: true };
            }
            throw new Error(data?.message || "Login failed");
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Login failed";
            setAuthError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        setAuthError(null);
        try {
            const data = await register({ username, email, password });
            if (data?.user) {
                setUser(data.user);
                return { success: true };
            }
            throw new Error(data?.message || "Registration failed");
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Registration failed";
            setAuthError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const verifySession = useCallback(async () => {
        try {
            const data = await getMe();
            if (data?.user) {
                setUser(data.user);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading]);

    useEffect(() => {
        verifySession();
    }, [verifySession]);

    return {
        user,
        loading,
        authError,
        setAuthError,
        handleRegister,
        handleLogin,
        handleLogout
    };
};
