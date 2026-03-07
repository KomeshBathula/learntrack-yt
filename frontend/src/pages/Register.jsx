import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Check console for details.');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative">
            {/* Theme toggle — top right */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md bg-[var(--bg-surface)] p-8 rounded-2xl border border-[var(--border)] shadow-2xl animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                        Start Learning
                    </h1>
                    <p className="text-[var(--text-muted)] mt-2">Create your account today</p>
                </div>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-secondary to-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-6 text-[var(--text-muted)] text-sm">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
