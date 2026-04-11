import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, RefreshCw } from 'lucide-react';

const NewsCard = ({ post, onLike }) => {
    const [liked, setLiked] = useState(post.user_liked);
    const [likeCount, setLikeCount] = useState(Number(post.like_count));
    const [liking, setLiking] = useState(false);

    const handleLike = async () => {
        if (liking) return;
        // Optimistic update
        setLiking(true);
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

        try {
            const res = await fetch('/api/post_likes.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ post_id: post.id })
            });
            if (res.ok) {
                const data = await res.json();
                setLiked(data.liked);
                setLikeCount(data.like_count);
                if (onLike) onLike(post.id, data.liked, data.like_count);
            } else {
                // Revert on error
                setLiked(wasLiked);
                setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
            }
        } catch {
            setLiked(wasLiked);
            setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
        } finally {
            setLiking(false);
        }
    };

    const timeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Hozir';
        if (diffMins < 60) return `${diffMins} daqiqa oldin`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs} soat oldin`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays} kun oldin`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={styles.card}
        >
            <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                        {(post.author_name || 'A').charAt(0).toUpperCase()}
                    </span>
                </div>
                <div>
                    <h4 style={styles.authorName}>{post.author_name || 'Admin'}</h4>
                    <span style={styles.date}>{timeAgo(post.created_at)}</span>
                </div>
            </div>

            {post.content && (
                <div style={styles.cardContent}>
                    <p style={styles.newsText}>{post.content}</p>
                </div>
            )}

            {post.media_url && (
                <div style={styles.mediaContainer}>
                    {post.media_type === 'image' ? (
                        <img src={post.media_url} alt="Post media" style={styles.media} loading="lazy" />
                    ) : post.media_type === 'video' ? (
                        <video src={post.media_url} controls style={styles.media} />
                    ) : null}
                </div>
            )}

            <div style={styles.cardActions}>
                <button
                    style={{ ...styles.actionBtn, color: liked ? '#ef4444' : 'var(--text-light)' }}
                    onClick={handleLike}
                    disabled={liking}
                >
                    <Heart size={20} fill={liked ? '#ef4444' : 'none'} />
                    <span>{likeCount}</span>
                </button>
                {/* <button style={styles.actionBtn}>
                    <MessageCircle size={20} />
                    <span>Izoh</span>
                </button> */}
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/posts.php', { credentials: 'include' });
            if (!res.ok) throw new Error('Yangiliklar yuklanmadi');
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div style={styles.dashboard}>
            <div style={styles.pageHeader}>
                <div>
                    <h2 style={styles.pageTitle}>Yangiliklar Lentasi</h2>
                    <p style={styles.pageSubtitle}>EduNavigator platformasidagi so'nggi yangiliklar</p>
                </div>
                <button onClick={fetchPosts} style={styles.refreshBtn} title="Yangilash">
                    <RefreshCw size={18} />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.centered}>
                        <div style={styles.spinner}></div>
                    </motion.div>
                ) : error ? (
                    <motion.div key="error" style={styles.errorBox}>
                        <p>{error}</p>
                        <button onClick={fetchPosts} style={styles.retryBtn}>Qayta urinish</button>
                    </motion.div>
                ) : posts.length === 0 ? (
                    <motion.div key="empty" style={styles.emptyState}>
                        <p style={{ fontSize: '3rem' }}>📰</p>
                        <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>Hali yangiliklar yo'q. Admin post qo'shishi mumkin.</p>
                    </motion.div>
                ) : (
                    <div key="feed" style={styles.feedContainer}>
                        {posts.map(post => (
                            <NewsCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    dashboard: { maxWidth: '760px', margin: '0 auto' },
    pageHeader: {
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    pageTitle: { fontSize: '1.75rem', color: 'var(--text-dark)', marginBottom: '0.25rem' },
    pageSubtitle: { color: 'var(--text-light)', fontSize: '0.95rem' },
    refreshBtn: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '38px', height: '38px',
        borderRadius: '10px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        color: 'var(--text-light)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition)'
    },
    feedContainer: { display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' },
    card: {
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        transition: 'var(--transition)'
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem 0.75rem' },
    avatar: {
        width: '42px', height: '42px', borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
    },
    authorName: { fontSize: '0.95rem', fontWeight: 600 },
    date: { fontSize: '0.78rem', color: 'var(--text-light)' },
    cardContent: { padding: '0.5rem 1.5rem 1rem' },
    newsText: { color: 'var(--text-dark)', lineHeight: 1.65, fontSize: '0.97rem' },
    mediaContainer: { width: '100%', maxHeight: '420px', overflow: 'hidden', backgroundColor: '#000' },
    media: { width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' },
    cardActions: {
        display: 'flex', alignItems: 'center',
        padding: '0.875rem 1.5rem',
        borderTop: '1px solid var(--border-color)',
        gap: '1.25rem'
    },
    actionBtn: {
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        color: 'var(--text-light)', fontSize: '0.9rem',
        fontWeight: 500, transition: 'color 0.2s', cursor: 'pointer',
        background: 'none', border: 'none'
    },
    centered: { display: 'flex', justifyContent: 'center', padding: '4rem' },
    spinner: {
        width: '40px', height: '40px',
        border: '3px solid var(--secondary-color)',
        borderTopColor: 'var(--primary-color)',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
    },
    errorBox: {
        textAlign: 'center', padding: '2rem',
        backgroundColor: '#fef2f2', color: '#b91c1c',
        borderRadius: 'var(--radius-lg)', border: '1px solid #fee2e2'
    },
    retryBtn: {
        marginTop: '1rem', padding: '0.5rem 1rem',
        backgroundColor: '#ef4444', color: '#fff',
        borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600
    },
    emptyState: {
        textAlign: 'center', padding: '4rem 2rem',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-color)'
    }
};

// Inject spinner keyframes once
if (typeof document !== 'undefined' && !document.getElementById('spin-kf')) {
    const s = document.createElement('style');
    s.id = 'spin-kf';
    s.innerText = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(s);
}

export default Dashboard;
