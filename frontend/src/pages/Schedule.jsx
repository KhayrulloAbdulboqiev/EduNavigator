import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ScheduleModal from '../components/ScheduleModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Clock, BookOpen, AlertCircle } from 'lucide-react';

const Schedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [schedules, setSchedules] = useState([]);

    const fetchSchedules = async () => {
        const res = await fetch('/api/schedules.php', { credentials: 'include' });
        const data = await res.json();
        if (Array.isArray(data)) {
            setSchedules(data.map(s => ({
                id: s.id,
                date: s.scheduled_date,
                subject: s.subject_name,
                topic: s.topic_description,
                time: `${s.start_time.substring(0, 5)} - ${s.end_time.substring(0, 5)}`,
                color: s.color_code
            })));
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        // Adjust for Monday start (1) instead of Sunday (0)
        let startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        let days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const hasSchedule = (day) => {
        if (!day) return false;
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Using local format trick for matching Demo Data YYYY-MM-DD
        const checkString = new Date(checkDate.getTime() - (checkDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        return schedules.some(s => s.date === checkString);
    };

    const handleDayClick = (day) => {
        if (!day) return;
        const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newSelected);
        setIsDrawerOpen(true);
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const getClassesForSelectedDate = () => {
        if (!selectedDate) return [];
        const selectedString = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        return schedules.filter(s => s.date === selectedString);
    };

    const days = generateCalendar();
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Dars jadvali</h2>
                    <p style={styles.subtitle}>Manage and view classes efficiently</p>
                </div>
                <div style={styles.actions}>
                    {/* RBAC restricts modal to admins only */}
                </div>
            </div>

            <div style={styles.mainContent}>
                {/* Calendar View */}
                <div style={{ ...styles.calendarCard, flex: isDrawerOpen ? 2 : 1 }}>
                    <div style={styles.calendarHeader}>
                        <button onClick={() => changeMonth(-1)} style={styles.navBtn}>
                            <ChevronLeft size={20} />
                        </button>
                        <h3 style={styles.monthTitle}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <button onClick={() => changeMonth(1)} style={styles.navBtn}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div style={styles.daysGrid}>
                        {dayNames.map(day => (
                            <div key={day} style={styles.dayName}>{day}</div>
                        ))}
                        {days.map((day, index) => {
                            const isToday = day === new Date().getDate() &&
                                currentDate.getMonth() === new Date().getMonth() &&
                                currentDate.getFullYear() === new Date().getFullYear();
                            const isActive = hasSchedule(day);
                            const isSelected = selectedDate && day === selectedDate.getDate() &&
                                currentDate.getMonth() === selectedDate.getMonth();

                            return (
                                <motion.div
                                    key={index}
                                    whileHover={day ? { scale: 1.05, y: -2 } : {}}
                                    onClick={() => handleDayClick(day)}
                                    style={{
                                        ...styles.dayCell,
                                        opacity: day ? 1 : 0,
                                        cursor: day ? 'pointer' : 'default',
                                        backgroundColor: isSelected ? 'var(--primary-color)' : (isToday ? '#f1f5f9' : 'transparent'),
                                        color: isSelected ? 'white' : 'var(--text-dark)',
                                        border: isToday && !isSelected ? '1px solid var(--border-color)' : '1px solid transparent',
                                        boxShadow: isSelected ? '0 10px 15px -3px rgba(10, 37, 64, 0.2)' : 'none'
                                    }}
                                >
                                    {day}
                                    {isActive && !isSelected && (
                                        <div style={styles.activeIndicator} />
                                    )}
                                    {isActive && isSelected && (
                                        <div style={{ ...styles.activeIndicator, backgroundColor: 'white' }} />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline Drawer */}
                <AnimatePresence>
                    {isDrawerOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 50, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: '400px' }}
                            exit={{ opacity: 0, x: 50, width: 0 }}
                            style={styles.drawerCard}
                        >
                            <div style={styles.drawerHeader}>
                                <div>
                                    <h3 style={styles.drawerTitle}>
                                        {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </h3>
                                    <p style={styles.drawerSubtitle}>
                                        {getClassesForSelectedDate().length} classes scheduled
                                    </p>
                                </div>
                                <button onClick={() => setIsDrawerOpen(false)} style={styles.closeBtn}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={styles.timeline}>
                                {getClassesForSelectedDate().length === 0 ? (
                                    <div style={styles.emptyState}>
                                        <div style={styles.emptyIcon}><AlertCircle size={32} /></div>
                                        <p>No classes scheduled for this day.</p>
                                    </div>
                                ) : (
                                    getClassesForSelectedDate().map((s, i) => (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            style={styles.timelineItem}
                                        >
                                            <div style={styles.timelineTime}>
                                                <Clock size={16} />
                                                <span>{s.time}</span>
                                            </div>
                                            <div style={{ ...styles.timelineContent, borderLeftColor: s.color }}>
                                                <h4 style={styles.timelineSubject}>{s.subject}</h4>
                                                <div style={styles.timelineTopic}>
                                                    <BookOpen size={14} />
                                                    <span>{s.topic}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}

                                {isAdmin && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={styles.addBtn}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <Plus size={18} /> Add Schedule
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchSchedules}
                preselectedDate={selectedDate ? new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : ''}
            />
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '3rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        color: 'var(--text-dark)',
        fontWeight: 700,
    },
    subtitle: {
        color: 'var(--text-light)',
        marginTop: '0.25rem',
    },
    adminToggle: {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        fontWeight: 600,
        cursor: 'pointer',
    },
    mainContent: {
        display: 'flex',
        gap: '2rem',
        minHeight: '600px',
    },
    calendarCard: {
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        padding: '2rem',
        transition: 'all 0.3s ease',
    },
    calendarHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    monthTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--primary-color)',
    },
    navBtn: {
        padding: '0.5rem',
        borderRadius: '50%',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--white)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.2s',
    },
    daysGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1rem',
    },
    dayName: {
        textAlign: 'center',
        fontWeight: 600,
        color: 'var(--text-light)',
        fontSize: '0.875rem',
        marginBottom: '1rem',
    },
    dayCell: {
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontSize: '1rem',
        fontWeight: 500,
        position: 'relative',
        transition: 'background-color 0.2s, color 0.2s'
    },
    activeIndicator: {
        width: '6px',
        height: '6px',
        backgroundColor: 'var(--secondary-color)',
        borderRadius: '50%',
        position: 'absolute',
        bottom: '8px',
    },
    drawerCard: {
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    drawerHeader: {
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#f8fafc',
    },
    drawerTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--text-dark)',
    },
    drawerSubtitle: {
        fontSize: '0.875rem',
        color: 'var(--text-light)',
        marginTop: '0.25rem',
    },
    closeBtn: {
        padding: '0.5rem',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-light)',
    },
    timeline: {
        padding: '1.5rem',
        flex: 1,
        overflowY: 'auto',
    },
    timelineItem: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    timelineTime: {
        width: '50px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        color: 'var(--text-light)',
        fontSize: '0.85rem',
        fontWeight: 600,
        paddingTop: '0.25rem',
    },
    timelineContent: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        borderLeft: '4px solid var(--primary-color)',
    },
    timelineSubject: {
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--text-dark)',
        marginBottom: '0.5rem',
    },
    timelineTopic: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-light)',
        fontSize: '0.875rem',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        color: 'var(--text-light)',
        textAlign: 'center',
    },
    emptyIcon: {
        color: 'var(--border-color)',
        marginBottom: '1rem',
    },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '1rem',
        marginTop: '1rem',
        backgroundColor: '#f0fdf4',
        color: '#16a34a',
        border: '1px dashed #16a34a',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        cursor: 'pointer',
        transition: '0.2s',
    }
};

export default Schedule;
