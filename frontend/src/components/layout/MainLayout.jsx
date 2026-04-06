import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="main-layout">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

            <main
                className={`content-area ${!sidebarOpen ? 'collapsed' : ''}`}
            >
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
