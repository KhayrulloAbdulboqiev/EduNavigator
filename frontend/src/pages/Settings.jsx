import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2, Edit3, Image as ImageIcon, Video, Clock, BookOpen } from 'lucide-react';

const Settings = () => {
    // Simulate active user role. In production, this comes from Auth context.
    const [isAdmin, setIsAdmin] = useState(true);

    // Subjects state
    const [subjects, setSubjects] = useState([]);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectColor, setNewSubjectColor] = useState('#0A2540');
    const [isAddingSubject, setIsAddingSubject] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [newSlotName, setNewSlotName] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:30');
    const [isActive, setIsActive] = useState(true);
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const toggleRole = () => setIsAdmin(!isAdmin);

    useEffect(() => {
        if (isAdmin) {
            fetchSubjects();
            fetchTimeSlots(); 
        }
    }, [isAdmin]);

    const fetchTimeSlots = async () => {
        setLoadingSlots(true);
        try {
            const res = await fetch('/api/time_slots.php');
            if (res.ok) {
                const data = await res.json();
                setTimeSlots(data);
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleAddTimeSlot = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/time_slots.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: newSlotName, 
                    start_time: startTime, 
                    end_time: endTime,
                    is_active: isActive 
                })
            });
            if (res.ok) {
                setNewSlotName('');
                setIsAddingSlot(false);
                fetchTimeSlots();
            }
        } catch (error) {
            console.error("Error adding slot:", error);
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm("O'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/time_slots.php?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchTimeSlots();
        } catch (error) {
            console.error("Error deleting slot:", error);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchSubjects();
            fetchTimeSlots();
        }
    }, [isAdmin]);

    const fetchSubjects = async () => {
        setLoadingSubjects(true);
        try {
            const res = await fetch('/api/subjects.php');
            if (res.ok) {
                const data = await res.json();
                setSubjects(data);
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;

        try {
            const res = await fetch('/api/subjects.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSubjectName, color_code: newSubjectColor })
            });
            if (res.ok) {
                setNewSubjectName('');
                setNewSubjectColor('#0A2540');
                setIsAddingSubject(false);
                fetchSubjects(); // Refresh list
            }
        } catch (error) {
            console.error("Error adding subject:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Settings</h2>
                <button onClick={toggleRole} style={styles.toggleBtn}>
                    Toggle View: {isAdmin ? 'Admin' : 'User'}
                </button>
            </div>

            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>General Preferences</h3>
                <div style={styles.card}>
                    <div style={styles.settingRow}>
                        <div>
                            <h4 style={styles.settingName}>Language</h4>
                            <p style={styles.settingDesc}>Choose your preferred language</p>
                        </div>
                        <select style={styles.select}>
                            <option>O'zbekcha</option>
                            <option>English</option>
                            <option>Русский</option>
                        </select>
                    </div>

                    <div style={styles.settingRow}>
                        <div>
                            <h4 style={styles.settingName}>Notifications</h4>
                            <p style={styles.settingDesc}>Receive alerts on new schedules</p>
                        </div>
                        <label className="switch" style={styles.switchLabel}>
                            <input type="checkbox" defaultChecked />
                            <span style={styles.slider}></span>
                        </label>
                    </div>
                </div>
            </div>

            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.adminSection}
                >
                    <div style={styles.adminHeader}>
                        <h3 style={styles.sectionTitle}>Admin Dashboard</h3>
                        <span style={styles.badge}>Restricted Access</span>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.adminHeaderRow}>
                            <h4 style={styles.settingName}>Manage News Feed</h4>
                            <button style={styles.btnPrimary}>
                                <Plus size={18} /> Add New Post
                            </button>
                        </div>

                        <div style={styles.uploadArea}>
                            <div style={styles.uploadOptions}>
                                <button style={styles.uploadBtn}>
                                    <ImageIcon size={24} color="var(--primary-color)" />
                                    <span>Upload Image</span>
                                </button>
                                <button style={styles.uploadBtn}>
                                    <Video size={24} color="var(--primary-color)" />
                                    <span>Upload Video</span>
                                </button>
                            </div>
                            <p style={styles.uploadText}>Supports JPG, PNG, MP4</p>
                        </div>

                        <div style={styles.postList}>
                            <div style={styles.postItem}>
                                <div style={styles.postInfo}>
                                    <div style={styles.postMiniImg}></div>
                                    <span>Welcome to the new EduNavigator...</span>
                                </div>
                                <div style={styles.postActions}>
                                    <button style={styles.actionEdit}><Edit3 size={18} /></button>
                                    <button style={styles.actionDelete}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>

                        <div style={{ ...styles.adminHeaderRow, marginTop: '2rem' }}>
                            <h4 style={styles.settingName}>Manage Subjects</h4>
                            <button style={styles.btnPrimary} onClick={() => setIsAddingSubject(!isAddingSubject)}>
                                <Plus size={18} /> {isAddingSubject ? 'Cancel' : 'Add Subject'}
                            </button>
                        </div>

                        {isAddingSubject && (
                            <form onSubmit={handleAddSubject} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Subject Name</label>
                                        <input
                                            type="text"
                                            value={newSubjectName}
                                            onChange={(e) => setNewSubjectName(e.target.value)}
                                            style={styles.inputField}
                                            placeholder="e.g. Mathematics"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Color Code</label>
                                        <input
                                            type="color"
                                            value={newSubjectColor}
                                            onChange={(e) => setNewSubjectColor(e.target.value)}
                                            style={{ ...styles.inputField, padding: '0.2rem', height: '42px', width: '80px', cursor: 'pointer' }}
                                        />
                                    </div>
                                    <button type="submit" style={styles.btnPrimary}>Save</button>
                                </div>
                            </form>
                        )}

                        <div style={styles.postList}>
                            {loadingSubjects ? (
                                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-light)' }}>Loading subjects...</div>
                            ) : subjects.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-light)' }}>No subjects found.</div>
                            ) : (
                                subjects.map(subject => (
                                    <div key={subject.id} style={styles.postItem}>
                                        <div style={styles.postInfo}>
                                            <div style={{ ...styles.postMiniImg, backgroundColor: subject.color_code || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BookOpen size={20} color={subject.color_code ? '#fff' : '#64748b'} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{subject.name}</div>
                                            </div>
                                        </div>
                                        <div style={styles.postActions}>
                                            <button style={styles.actionDelete}><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ ...styles.adminHeaderRow, marginTop: '2rem' }}>
                            <h4 style={styles.settingName}>Manage Global Time Slots</h4>
                            <button style={styles.btnPrimary} onClick={() => setIsAddingSlot(!isAddingSlot)}>
                                <Plus size={18} /> {isAddingSlot ? 'Cancel' : 'Add Slot'}
                            </button>
                        </div>

                        {isAddingSlot && (
                            <form onSubmit={handleAddTimeSlot} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                                    <div>
                                        <label style={styles.label}>Slot Name</label>
                                        <input
                                            type="text"
                                            value={newSlotName}
                                            onChange={(e) => setNewSlotName(e.target.value)}
                                            style={styles.inputField}
                                            placeholder="e.g. Lesson 1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={styles.label}>Start</label>
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            style={styles.inputField}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={styles.label}>End</label>
                                        <input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            style={styles.inputField}
                                            required
                                        />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <label style={styles.label}>Active</label>
                                        <input 
                                            type="checkbox" 
                                            checked={isActive} 
                                            onChange={(e) => setIsActive(e.target.checked)}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                    </div>
                                    <button type="submit" style={styles.btnPrimary}>Save</button>
                                </div>  
                            </form>
                        )}

                        <div style={styles.postList}>
                            {loadingSlots ? (
                                <div style={{ textAlign: 'center', padding: '1rem' }}>Loading slots...</div>
                            ) : timeSlots.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '1rem' }}>No time slots found.</div>
                            ) : (
                                timeSlots.map(slot => (
                                    <div key={slot.id} style={styles.postItem}>
                                        <div style={styles.postInfo}>
                                            <div style={{ ...styles.postMiniImg, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Clock size={20} color="#64748b" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{slot.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                    {slot.start_time.substring(0,5)} - {slot.end_time.substring(0,5)}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={styles.postActions}>
                                            <span style={{ 
                                                ...styles.badge, 
                                                backgroundColor: slot.is_active ? '#dcfce7' : '#f3f4f6', 
                                                color: slot.is_active ? '#16a34a' : '#6b7280', 
                                                marginRight: '8px' 
                                            }}>
                                                {slot.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            <button style={styles.actionDelete} onClick={() => handleDeleteSlot(slot.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Internal CSS for simple toggle switch */}
            <style>{`
        .switch input { opacity: 0; width: 0; height: 0; }
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;}
        .switch span { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .switch span:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        .switch input:checked + span { background-color: var(--primary-color); }
        .switch input:checked + span:before { transform: translateX(20px); }
      `}</style>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
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
    },
    toggleBtn: {
        backgroundColor: 'var(--secondary-color)',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        fontWeight: 600,
    },
    section: {
        marginBottom: '3rem',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        marginBottom: '1rem',
        color: 'var(--text-dark)',
        fontWeight: 600,
    },
    card: {
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
    },
    settingRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
    },
    settingName: {
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '0.25rem',
    },
    settingDesc: {
        fontSize: '0.875rem',
        color: 'var(--text-light)',
    },
    select: {
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        outline: 'none',
        backgroundColor: 'var(--bg-color)',
        cursor: 'pointer',
    },
    switchLabel: {
        display: 'inline-block',
    },
    adminSection: {
        marginTop: '2rem',
    },
    adminHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
    },
    badge: {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-xl)',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    adminHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
    },
    btnPrimary: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--primary-color)',
        color: 'var(--white)',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        border: 'none',
    },
    uploadArea: {
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--secondary-color)',
    },
    uploadOptions: {
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '1rem',
    },
    uploadBtn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1.5rem',
        backgroundColor: 'var(--white)',
        border: '1px dashed var(--primary-color)',
        borderRadius: 'var(--radius-lg)',
        width: '140px',
        transition: 'var(--transition)',
    },
    uploadText: {
        fontSize: '0.875rem',
        color: 'var(--text-light)',
    },
    postList: {
        padding: '1.5rem',
    },
    postItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'var(--bg-color)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '0.5rem',
    },
    postInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontWeight: 500,
    },
    postMiniImg: {
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--primary-color)',
        borderRadius: 'var(--radius-md)',
    },
    postActions: {
        display: 'flex',
        gap: '0.5rem',
    },
    actionEdit: {
        padding: '0.5rem',
        color: 'var(--text-light)',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-md)',
    },
    actionDelete: {
        padding: '0.5rem',
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        borderRadius: 'var(--radius-md)',
    },
    inputField: {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        outline: 'none',
        fontSize: '1rem',
        backgroundColor: 'var(--white)',
    }
};

export default Settings;
