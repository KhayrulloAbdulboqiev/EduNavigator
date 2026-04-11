import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MonitorPlay, BookOpen, Map,
    Trophy, BookMarked, Award, User,
    Share2, Settings
} from 'lucide-react';

const menuItems = [
    { path: '/schedule', name: 'Dars jadvali', icon: Calendar },
    { path: '/online-education', name: 'Online ta\'lim', icon: MonitorPlay },
    { path: '/tests', name: 'Testlar', icon: BookOpen },
    { path: '/navigator', name: 'Navigator', icon: Map },
    { path: '/rating', name: 'Reyting', icon: Trophy },
    { path: '/library', name: 'Kutubxona', icon: BookMarked },
    { path: '/certificates', name: 'Xalqaro sertifikatlar', icon: Award },
    { path: '/directors', name: 'Rahbariyat', icon: User },
    // { path: '/share', name: 'Do\'stlarga ulashish', icon: Share2 },
    { path: '/settings', name: 'Sozlamalar', icon: Settings },
];

const Sidebar = ({ isOpen, closeSidebar }) => {
    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.overlay}
                        onClick={closeSidebar}
                    />
                )}
            </AnimatePresence>

            <div style={{
                ...styles.sidebar,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            }}>
                <div style={styles.menuList}>
                    {menuItems.map((item) => (
                        <NavLink
                            to={item.path}
                            key={item.path}
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                            style={({ isActive }) => ({
                                ...styles.menuItem,
                                backgroundColor: isActive ? 'var(--secondary-color)' : 'transparent',
                                color: isActive ? 'var(--text-dark)' : 'var(--text-light)',
                                fontWeight: isActive ? 600 : 500,
                                borderRight: isActive ? '3px solid var(--primary-color)' : '3px solid transparent'
                            })}
                            onClick={(e) => {
                                if (window.innerWidth <= 768) {
                                    closeSidebar();
                                }
                            }}
                        >
                            <item.icon size={20} style={{
                                color: 'var(--primary-color)'
                            }} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};

const styles = {
    sidebar: {
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--white)',
        borderRight: '1px solid var(--border-color)',
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        bottom: 0,
        zIndex: 90,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto'
    },
    overlay: {
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 80,
        backdropFilter: 'blur(2px)' // Glassmorphism touch
    },
    menuList: {
        padding: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1.5rem',
        textDecoration: 'none',
        transition: 'var(--transition)',
    }
};

export default Sidebar;
