import React from 'react';
import { Menu, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ toggleSidebar }) => {
    return (
        <header style={styles.header}>
            <div style={styles.leftSection}>
                <button onClick={toggleSidebar} style={styles.menuButton}>
                    <Menu size={24} />
                </button>
                <div style={styles.logoContainer}>
                    <div style={styles.logoIcon}>
                        {/* Compass-like simplified logo */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                        </svg>
                    </div>
                    <h1 style={styles.brandName}>EduNavigator</h1>
                </div>
            </div>

            <div style={styles.rightSection}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.profileBtn}
                >
                    <User size={20} />
                    <span style={styles.profileText}>Profile</span>
                </motion.button>
            </div>
        </header>
    );
};

const styles = {
    header: {
        height: 'var(--header-height)',
        backgroundColor: 'var(--white)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    menuButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-dark)',
        transition: 'var(--transition)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    logoIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--secondary-color)',
        borderRadius: '50%',
        padding: '0.25rem'
    },
    brandName: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--text-dark)',
        letterSpacing: '-0.5px'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    profileBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--secondary-color)',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-xl)',
        color: 'var(--text-dark)',
        fontWeight: 500,
        border: '1px solid var(--border-color)'
    },
    profileText: {
        display: 'none' // Hidden on mobile, can show on desktop via media query later
    }
};

export default Header;
