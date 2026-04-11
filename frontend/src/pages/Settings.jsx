import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2, Edit3, Image as ImageIcon, Video, Clock, BookOpen, Send, X, ShieldAlert, Eye } from 'lucide-react';

const Settings = () => {
    const [isAdmin, setIsAdmin] = useState(true);

    // --- Subjects ---
    const [subjects, setSubjects] = useState([]);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectColor, setNewSubjectColor] = useState('#0A2540');
    const [isAddingSubject, setIsAddingSubject] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // --- Time Slots ---
    const [timeSlots, setTimeSlots] = useState([]);
    const [newSlotName, setNewSlotName] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:30');
    const [isActive, setIsActive] = useState(true);
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // --- Posts ---
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [isAddingPost, setIsAddingPost] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState('none');
    const [submittingPost, setSubmittingPost] = useState(false);
    const fileInputRef = useRef();

    const toggleRole = () => setIsAdmin(!isAdmin);

    useEffect(() => {
        // Fetch for all users so they can see the read-only view
        fetchSubjects();
        fetchTimeSlots();
        fetchPosts();
    }, []); // Run once on mount

    // ===== POSTS =====
    const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
            const res = await fetch('/api/posts.php', { credentials: 'include' });
            if (res.ok) setPosts(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoadingPosts(false); }
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setMediaFile(file);
        const type = file.type.startsWith('video') ? 'video' : 'image';
        setMediaType(type);
        setMediaPreview(URL.createObjectURL(file));
    };

    const handleAddPost = async (e) => {
        e.preventDefault();
        if (!postContent.trim() && !mediaFile) return;
        setSubmittingPost(true);
        try {
            const formData = new FormData();
            formData.append('content', postContent);
            if (mediaFile) formData.append('media', mediaFile);

            const res = await fetch('/api/posts.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            if (res.ok) {
                setPostContent('');
                setMediaFile(null);
                setMediaPreview(null);
                setMediaType('none');
                setIsAddingPost(false);
                await fetchPosts();
            }
        } catch (e) { console.error(e); }
        finally { setSubmittingPost(false); }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm("Bu postni o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/posts.php?id=${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) setPosts(prev => prev.filter(p => p.id !== id));
        } catch (e) { console.error(e); }
    };

    // ===== SUBJECTS =====
    const fetchSubjects = async () => {
        setLoadingSubjects(true);
        try {
            const res = await fetch('/api/subjects.php', { credentials: 'include' });
            if (res.ok) setSubjects(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoadingSubjects(false); }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;
        try {
            const res = await fetch('/api/subjects.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newSubjectName, color_code: newSubjectColor })
            });
            if (res.ok) {
                setNewSubjectName('');
                setNewSubjectColor('#0A2540');
                setIsAddingSubject(false);
                fetchSubjects();
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm("Bu fanni o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/subjects.php?id=${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) setSubjects(prev => prev.filter(s => s.id !== id));
        } catch (e) { console.error(e); }
    };

    // ===== TIME SLOTS =====
    const fetchTimeSlots = async () => {
        setLoadingSlots(true);
        try {
            const res = await fetch('/api/time_slots.php', { credentials: 'include' });
            if (res.ok) setTimeSlots(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoadingSlots(false); }
    };

    const handleAddTimeSlot = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/time_slots.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newSlotName, start_time: startTime, end_time: endTime, is_active: isActive })
            });
            if (res.ok) {
                setNewSlotName('');
                setIsAddingSlot(false);
                fetchTimeSlots();
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm("Bu vaqt slotini o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/time_slots.php?id=${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) fetchTimeSlots();
        } catch (e) { console.error(e); }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Sozlamalar</h2>
                <button onClick={toggleRole} style={styles.toggleBtn}>
                    Ko'rinish: {isAdmin ? '👑 Admin' : '👤 Foydalanuvchi'}
                </button>
            </div>

            {/* General Preferences */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Umumiy sozlamalar</h3>
                <div style={styles.card}>
                    <div style={styles.settingRow}>
                        <div>
                            <h4 style={styles.settingName}>Til</h4>
                            <p style={styles.settingDesc}>Interfeys tilini tanlang</p>
                        </div>
                        <select style={styles.select}>
                            <option>O'zbekcha</option>
                            <option>English</option>
                            <option>Русский</option>
                        </select>
                    </div>
                    <div style={styles.settingRow}>
                        <div>
                            <h4 style={styles.settingName}>Bildirishnomalar</h4>
                            <p style={styles.settingDesc}>Yangi jadval haqida xabarnomalar</p>
                        </div>
                        <label className="switch" style={styles.switchLabel}>
                            <input type="checkbox" defaultChecked />
                            <span style={styles.slider}></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* System Data Section (Visible to all, read-only for non-admins) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.adminSection}>
                <div style={styles.adminHeader}>
                    <h3 style={styles.sectionTitle}>Tizim Ma'lumotlari</h3>
                    {isAdmin ? (
                        <span style={styles.badgeAdmin}><ShieldAlert size={14} style={{ marginRight: 4 }} /> Admin</span>
                    ) : (
                        <span style={styles.badgeUser}><Eye size={14} style={{ marginRight: 4 }} /> Faqat o'qish uchun</span>
                    )}
                </div>

                <div style={styles.card}>
                    {/* ===== MANAGE NEWS FEED ===== */}
                    <div style={styles.adminHeaderRow}>
                        <h4 style={styles.settingName}>Yangiliklar lentasi</h4>
                        {isAdmin && (
                            <button style={styles.btnPrimary} onClick={() => setIsAddingPost(!isAddingPost)}>
                                {isAddingPost ? <><X size={18} /> Bekor qilish</> : <><Plus size={18} /> Yangi post</>}
                            </button>
                        )}
                    </div>

                    {isAdmin && isAddingPost && (
                        <form onSubmit={handleAddPost} style={styles.postForm}>
                            <textarea
                                value={postContent}
                                onChange={e => setPostContent(e.target.value)}
                                style={styles.textarea}
                                placeholder="Post matni (ixtiyoriy)..."
                                rows={3}
                            />

                            {/* Media Preview */}
                            {mediaPreview && (
                                <div style={styles.previewBox}>
                                    {mediaType === 'image' ? (
                                        <img src={mediaPreview} alt="Preview" style={styles.previewMedia} />
                                    ) : (
                                        <video src={mediaPreview} controls style={styles.previewMedia} />
                                    )}
                                    <button
                                        type="button"
                                        style={styles.removeMediaBtn}
                                        onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaType('none'); }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div style={styles.postFormActions}>
                                <div style={styles.uploadOptions}>
                                    <button
                                        type="button"
                                        style={styles.uploadBtn}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <ImageIcon size={20} color="var(--primary-color)" />
                                        <span>Rasm / Video</span>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,video/*"
                                        style={{ display: 'none' }}
                                        onChange={handleMediaChange}
                                    />
                                </div>
                                <button type="submit" style={styles.btnPrimary} disabled={submittingPost}>
                                    <Send size={16} />
                                    {submittingPost ? 'Yuklanmoqda...' : 'Joylash'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Posts list */}
                    <div style={styles.postList}>
                        {loadingPosts ? (
                            <div style={styles.listPlaceholder}>Yuklanmoqda...</div>
                        ) : posts.length === 0 ? (
                            <div style={styles.listPlaceholder}>Hali postlar yo'q.</div>
                        ) : posts.map(post => (
                            <div key={post.id} style={styles.postItem}>
                                <div style={styles.postInfo}>
                                    <div style={{ ...styles.postMiniImg, backgroundColor: post.media_type === 'video' ? '#e0e7ff' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {post.media_type === 'video' ? <Video size={18} color="#4f46e5" /> : <ImageIcon size={18} color="#16a34a" />}
                                    </div>
                                    <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                                        {post.content ? post.content.substring(0, 50) + (post.content.length > 50 ? '…' : '') : '(Media post)'}
                                    </span>
                                </div>
                                <div style={styles.postActions}>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>❤ {post.like_count || 0}</span>
                                    {isAdmin && (
                                        <button style={styles.actionDelete} onClick={() => handleDeletePost(post.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== MANAGE SUBJECTS ===== */}
                    <div style={{ ...styles.adminHeaderRow, marginTop: '1rem', borderTop: '2px solid var(--border-color)' }}>
                        <h4 style={styles.settingName}>Fanlar ro'yxati</h4>
                        {isAdmin && (
                            <button style={styles.btnPrimary} onClick={() => setIsAddingSubject(!isAddingSubject)}>
                                <Plus size={18} /> {isAddingSubject ? 'Bekor qilish' : 'Fan qo\'shish'}
                            </button>
                        )}
                    </div>

                    {isAdmin && isAddingSubject && (
                        <form onSubmit={handleAddSubject} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '160px' }}>
                                    <label style={styles.label}>Fan nomi</label>
                                    <input type="text" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} style={styles.inputField} placeholder="masalan: Matematika" required />
                                </div>
                                <div>
                                    <label style={styles.label}>Rang</label>
                                    <input type="color" value={newSubjectColor} onChange={e => setNewSubjectColor(e.target.value)} style={{ ...styles.inputField, padding: '0.2rem', height: '42px', width: '70px', cursor: 'pointer' }} />
                                </div>
                                <button type="submit" style={styles.btnPrimary}>Saqlash</button>
                            </div>
                        </form>
                    )}

                    <div style={styles.postList}>
                        {loadingSubjects ? (
                            <div style={styles.listPlaceholder}>Yuklanmoqda...</div>
                        ) : subjects.length === 0 ? (
                            <div style={styles.listPlaceholder}>Fanlar topilmadi.</div>
                        ) : subjects.map(subject => (
                            <div key={subject.id} style={styles.postItem}>
                                <div style={styles.postInfo}>
                                    <div style={{ ...styles.postMiniImg, backgroundColor: subject.color_code || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BookOpen size={18} color="#fff" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{subject.name}</div>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <div style={styles.postActions}>
                                        <button style={styles.actionDelete} onClick={() => handleDeleteSubject(subject.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ===== MANAGE TIME SLOTS ===== */}
                    <div style={{ ...styles.adminHeaderRow, marginTop: '1rem', borderTop: '2px solid var(--border-color)' }}>
                        <h4 style={styles.settingName}>Vaqt slotlari</h4>
                        {isAdmin && (
                            <button style={styles.btnPrimary} onClick={() => setIsAddingSlot(!isAddingSlot)}>
                                <Plus size={18} /> {isAddingSlot ? 'Bekor qilish' : 'Slot qo\'shish'}
                            </button>
                        )}
                    </div>

                    {isAdmin && isAddingSlot && (
                        <form onSubmit={handleAddTimeSlot} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                                <div>
                                    <label style={styles.label}>Slot nomi</label>
                                    <input type="text" value={newSlotName} onChange={e => setNewSlotName(e.target.value)} style={styles.inputField} placeholder="masalan: 1-dars" required />
                                </div>
                                <div>
                                    <label style={styles.label}>Boshlash</label>
                                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={styles.inputField} required />
                                </div>
                                <div>
                                    <label style={styles.label}>Tugash</label>
                                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={styles.inputField} required />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <label style={styles.label}>Faol</label>
                                    <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                </div>
                                <button type="submit" style={styles.btnPrimary}>Saqlash</button>
                            </div>
                        </form>
                    )}

                    <div style={styles.postList}>
                        {loadingSlots ? (
                            <div style={styles.listPlaceholder}>Yuklanmoqda...</div>
                        ) : timeSlots.length === 0 ? (
                            <div style={styles.listPlaceholder}>Vaqt slotlari topilmadi.</div>
                        ) : timeSlots.map(slot => (
                            <div key={slot.id} style={styles.postItem}>
                                <div style={styles.postInfo}>
                                    <div style={{ ...styles.postMiniImg, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock size={18} color="#64748b" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{slot.name}</div>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                                            {slot.start_time?.substring(0, 5)} - {slot.end_time?.substring(0, 5)}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.postActions}>
                                    <span style={{ ...styles.badge, backgroundColor: slot.is_active ? '#dcfce7' : '#f3f4f6', color: slot.is_active ? '#16a34a' : '#6b7280', marginRight: isAdmin ? '8px' : 0 }}>
                                        {slot.is_active ? 'Faol' : 'Nofaol'}
                                    </span>
                                    {isAdmin && (
                                        <button style={styles.actionDelete} onClick={() => handleDeleteSlot(slot.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <style>{`
                .switch input { opacity: 0; width: 0; height: 0; }
                .switch { position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; }
                .switch span { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
                .switch span:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                .switch input:checked + span { background-color: var(--primary-color); }
                .switch input:checked + span:before { transform: translateX(20px); }
            `}</style>
        </div>
    );
};

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '2rem', color: 'var(--text-dark)' },
    toggleBtn: { backgroundColor: 'var(--secondary-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer' },
    section: { marginBottom: '3rem' },
    sectionTitle: { fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-dark)', fontWeight: 600 },
    card: { backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', overflow: 'hidden' },
    settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' },
    settingName: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' },
    settingDesc: { fontSize: '0.875rem', color: 'var(--text-light)' },
    select: { padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', cursor: 'pointer' },
    switchLabel: { display: 'inline-block' },
    adminSection: { marginTop: '1.5rem' },
    adminHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
    badge: { padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' },
    badgeAdmin: { display: 'flex', alignItems: 'center', backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' },
    badgeUser: { display: 'flex', alignItems: 'center', backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' },
    adminHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' },
    btnPrimary: { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-color)', color: 'var(--white)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 600, border: 'none', cursor: 'pointer' },
    postForm: { padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    textarea: { width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.95rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
    previewBox: { position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '220px', backgroundColor: '#000' },
    previewMedia: { width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' },
    removeMediaBtn: { position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    postFormActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    uploadOptions: { display: 'flex', gap: '0.75rem' },
    uploadBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--white)', border: '1px dashed var(--primary-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-color)' },
    postList: { padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    listPlaceholder: { textAlign: 'center', padding: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' },
    postItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' },
    postInfo: { display: 'flex', alignItems: 'center', gap: '0.875rem', fontWeight: 500, minWidth: 0, flex: 1 },
    postMiniImg: { width: '38px', height: '38px', backgroundColor: 'var(--primary-color)', borderRadius: 'var(--radius-md)', flexShrink: 0 },
    postActions: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '0.5rem' },
    actionDelete: { padding: '0.4rem', color: '#ef4444', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    inputField: { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.95rem', backgroundColor: 'var(--white)', boxSizing: 'border-box' },
    label: { display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }
};

export default Settings;
