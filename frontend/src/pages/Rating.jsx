import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Clock, ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getApiUrl = (endpoint) => `/api/${endpoint}`;

const Rating = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(getApiUrl('subjects.php'), { credentials: 'include' });
                if (!response.ok) throw new Error('Fanlarni yuklashda xatolik yuz berdi');
                const data = await response.json();
                setSubjects(data);
                if (data && data.length > 0) {
                    setSelectedSubject(data[0].id);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (!selectedSubject) return;

        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const response = await fetch(getApiUrl(`rating.php?subject_id=${selectedSubject}`), { credentials: 'include' });
                if (!response.ok) throw new Error('Reytingni yuklashda xatolik yuz berdi');
                const data = await response.json();
                setLeaderboard(data);
            } catch (err) {
                setError(err.message || 'Reyting ma\'lumotlarini yuklab bo\'lmadi');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [selectedSubject]);

    const getRankStyles = (rank) => {
        switch (rank) {
            case 1: return { icon: <Trophy size={20} color="#FFD700" />, color: '#FFF9E6', border: '1px solid #FFE58F' };
            case 2: return { icon: <Medal size={20} color="#C0C0C0" />, color: '#F5F5F5', border: '1px solid #D9D9D9' };
            case 3: return { icon: <Award size={20} color="#CD7F32" />, color: '#FFF2E8', border: '1px solid #FFD8BF' };
            default: return { icon: <span style={styles.rankNumber}>{rank}</span>, color: 'transparent', border: 'none' };
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.header}>
                <div style={styles.titleContainer}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={styles.iconBox}
                    >
                        <Trophy size={24} color="var(--primary-color)" />
                    </motion.div>
                    <div>
                        <h1 style={styles.title}>Reyting (Leaderboard)</h1>
                        <p style={styles.subtitle}>Sizning fanlar bo'yicha ko'rsatkichlaringiz</p>
                    </div>
                </div>

                <div style={styles.filterBox}>
                    <Filter size={18} color="var(--text-light)" />
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={styles.select}
                    >
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <ChevronDown size={18} color="var(--text-light)" style={styles.selectIcon} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={styles.loadingContainer}
                    >
                        <div style={styles.spinner}></div>
                    </motion.div>
                ) : error ? (
                    <motion.div style={styles.errorBox}>{error}</motion.div>
                ) : leaderboard.length === 0 ? (
                    <motion.div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>🏆</div>
                        <p>Hozircha malumotlar yo'q</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={styles.tableCard}
                    >
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th style={styles.th}>O'rin</th>
                                    <th style={styles.th}>Ism Familiya</th>
                                    <th style={{ ...styles.th, textAlign: 'center' }}>Natija</th>
                                    <th style={{ ...styles.th, textAlign: 'right' }}>Vaqt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((user, idx) => {
                                    const rankInfo = getRankStyles(user.rank || idx + 1);
                                    return (
                                        <motion.tr
                                            key={user.user_id}
                                            whileHover={{ backgroundColor: '#f8fafc' }}
                                            style={{ ...styles.tr, backgroundColor: rankInfo.color }}
                                        >
                                            <td style={styles.td}>
                                                <div style={{ ...styles.rankBadge, border: rankInfo.border }}>
                                                    {rankInfo.icon}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.userName}>{user.name}</span>
                                            </td>
                                            <td style={{ ...styles.td, textAlign: 'center' }}>
                                                <span style={styles.scoreBadge}>
                                                    {user.total_score} / {user.total_questions}
                                                </span>
                                            </td>
                                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                                <div style={styles.timeInfo}>
                                                    <Clock size={14} style={{ marginRight: '4px' }} />
                                                    {new Date(user.completed_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    pageWrapper: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1rem'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    iconBox: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: 'var(--secondary-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '0.25rem',
        color: 'var(--text-dark)'
    },
    subtitle: {
        fontSize: '0.875rem',
        color: 'var(--text-light)'
    },
    filterBox: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--white)',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
    },
    select: {
        appearance: 'none',
        border: 'none',
        background: 'none',
        fontSize: '0.9rem',
        fontWeight: '500',
        color: 'var(--text-dark)',
        cursor: 'pointer',
        paddingRight: '1.5rem',
        outline: 'none'
    },
    selectIcon: {
        position: 'absolute',
        right: '12px',
        pointerEvents: 'none'
    },
    tableCard: {
        backgroundColor: 'var(--white)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.95rem'
    },
    tableHeadRow: {
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid var(--border-color)'
    },
    th: {
        padding: '1.25rem 1.5rem',
        textAlign: 'left',
        fontWeight: '600',
        color: 'var(--text-light)',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '0.05em'
    },
    tr: {
        borderBottom: '1px solid #f1f5f9',
        transition: 'background-color 0.2s ease'
    },
    td: {
        padding: '1rem 1.5rem',
        verticalAlign: 'middle'
    },
    rankBadge: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--white)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    rankNumber: {
        fontWeight: '700',
        color: 'var(--text-light)'
    },
    userName: {
        fontWeight: '600',
        color: 'var(--text-dark)'
    },
    scoreBadge: {
        display: 'inline-block',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        backgroundColor: 'var(--secondary-color)',
        color: 'var(--primary-color)',
        fontWeight: '700',
        fontSize: '0.875rem'
    },
    timeInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: 'var(--text-light)',
        fontSize: '0.8rem'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: '4rem'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid var(--secondary-color)',
        borderTopColor: 'var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    errorBox: {
        padding: '1.5rem',
        backgroundColor: '#fef2f2',
        color: '#b91c1c',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #fee2e2'
    },
    emptyState: {
        textAlign: 'center',
        padding: '5rem 2rem',
        backgroundColor: 'var(--white)',
        borderRadius: '16px',
        border: '1px dashed var(--border-color)'
    },
    emptyIcon: {
        fontSize: '3rem',
        marginBottom: '1rem'
    }
};

// Add global keyframes for spinner
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default Rating;
