import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Play } from 'lucide-react';

const mockNews = [
    {
        id: 1,
        title: 'Welcome to the new EduNavigator Platform!',
        content: 'We are thrilled to launch the beta version of EduNavigator. Your comprehensive hub for all educational resources, schedules, and online learning.',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        date: '2 hours ago',
        likes: 124
    },
    {
        id: 2,
        title: 'How to use our Roadmap feature',
        content: 'Watch this quick tutorial on how to navigate through the Edu-Map to track your learning journey.',
        type: 'video',
        mediaUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        date: '5 hours ago',
        likes: 89
    },
    {
        id: 3,
        title: 'Upcoming Global Certifications Fair',
        content: 'Prepare yourself for the global certifications fair happening next week. Get ready to boost your resume!',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1546410531-ee4cb47b5394?auto=format&fit=crop&w=800&q=80',
        date: '1 day ago',
        likes: 245
    }
];

const NewsCard = ({ news }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={styles.card}
        >
            <div style={styles.cardHeader}>
                <div style={styles.avatar}></div>
                <div>
                    <h4 style={styles.authorName}>Admin Team</h4>
                    <span style={styles.date}>{news.date}</span>
                </div>
            </div>

            <div style={styles.cardContent}>
                <h3 style={styles.newsTitle}>{news.title}</h3>
                <p style={styles.newsText}>{news.content}</p>
            </div>

            {news.mediaUrl && (
                <div style={styles.mediaContainer}>
                    {news.type === 'image' ? (
                        <img src={news.mediaUrl} alt={news.title} style={styles.media} />
                    ) : (
                        <div style={styles.videoWrapper}>
                            <video
                                src={news.mediaUrl}
                                controls
                                style={styles.media}
                                poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"
                            />
                        </div>
                    )}
                </div>
            )}

            <div style={styles.cardActions}>
                <button style={styles.actionBtn}>
                    <Heart size={20} />
                    <span>{news.likes}</span>
                </button>
                <button style={styles.actionBtn}>
                    <MessageCircle size={20} />
                    <span>Comment</span>
                </button>
                <button style={styles.actionBtn}>
                    <Share2 size={20} />
                    <span>Share</span>
                </button>
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    return (
        <div style={styles.dashboard}>
            <div style={styles.pageHeader}>
                <h2 style={styles.pageTitle}>News Feed</h2>
                <p style={styles.pageSubtitle}>Stay updated with the latest in EduNavigator</p>
            </div>

            <div style={styles.feedContainer}>
                {mockNews.map(news => (
                    <NewsCard key={news.id} news={news} />
                ))}
            </div>
        </div>
    );
};

const styles = {
    dashboard: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    pageHeader: {
        marginBottom: '2rem'
    },
    pageTitle: {
        fontSize: '2rem',
        color: 'var(--text-dark)',
        marginBottom: '0.5rem'
    },
    pageSubtitle: {
        color: 'var(--text-light)',
        fontSize: '1rem'
    },
    feedContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        paddingBottom: '2rem'
    },
    card: {
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        transition: 'var(--transition)'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem 1.5rem 0.5rem',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorName: {
        fontSize: '1rem',
        fontWeight: 600,
    },
    date: {
        fontSize: '0.8rem',
        color: 'var(--text-light)',
    },
    cardContent: {
        padding: '1rem 1.5rem',
    },
    newsTitle: {
        fontSize: '1.25rem',
        marginBottom: '0.5rem',
    },
    newsText: {
        color: 'var(--text-dark)',
        lineHeight: 1.6,
    },
    mediaContainer: {
        width: '100%',
        maxHeight: '400px',
        backgroundColor: '#000',
        overflow: 'hidden',
        position: 'relative'
    },
    media: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        maxHeight: '400px',
        display: 'block'
    },
    videoWrapper: {
        position: 'relative',
        width: '100%',
    },
    cardActions: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border-color)',
        gap: '1.5rem'
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-light)',
        fontSize: '0.9rem',
        fontWeight: 500,
        transition: 'color 0.2s',
    }
};

export default Dashboard;
