import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const result = await register(name, email, password);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message || 'Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={styles.card}
            >
                <div style={styles.header}>
                    <div style={styles.logoIcon}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                        </svg>
                    </div>
                    <h2 style={styles.title}>Create an Account</h2>
                    <p style={styles.subtitle}>Join EduNavigator today</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        style={styles.submitBtn}
                    >
                        Sign Up
                    </motion.button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already have an account? <Link to="/login" style={styles.linkTextBold}>Log in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        padding: '1rem',
    },
    card: {
        backgroundColor: 'var(--white)',
        width: '100%',
        maxWidth: '440px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logoIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--secondary-color)',
        borderRadius: '50%',
        padding: '1rem',
        marginBottom: '1rem',
    },
    title: {
        fontSize: '1.75rem',
        marginBottom: '0.5rem',
        color: 'var(--text-dark)',
    },
    subtitle: {
        color: 'var(--text-light)',
        fontSize: '0.95rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--text-dark)',
    },
    input: {
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'var(--transition)',
    },
    submitBtn: {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--white)',
        padding: '0.875rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        fontSize: '1rem',
        marginTop: '0.5rem',
    },
    footer: {
        marginTop: '2rem',
        textAlign: 'center',
    },
    footerText: {
        color: 'var(--text-light)',
        fontSize: '0.95rem',
    },
    linkTextBold: {
        color: 'var(--primary-color)',
        fontWeight: 600,
    }
};

export default Register;
