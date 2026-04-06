import React, { useState, useEffect } from 'react';

const ScheduleModal = ({ isOpen, onClose, onSave, preselectedDate }) => {
    const [subjects, setSubjects] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);

    const [formData, setFormData] = useState({
        scheduled_date: '',
        subject_id: '',
        time_slot_id: '',
        topic_description: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, scheduled_date: preselectedDate || '' }));
            fetch('/api/subjects.php', { credentials: 'include' }).then(r => r.json()).then(data => {
                if (Array.isArray(data)) setSubjects(data);
            });
            fetch('/api/time_slots.php', { credentials: 'include' }).then(r => r.json()).then(data => {
                if (Array.isArray(data)) setTimeSlots(data);
            });
        }
    }, [isOpen, preselectedDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/schedules.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            onSave();
            onClose();
        } else {
            alert('Error saving schedule');
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Add Class Schedule</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="date" value={formData.scheduled_date} onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })} required style={styles.input} />
                    <select value={formData.subject_id} onChange={e => setFormData({ ...formData, subject_id: e.target.value })} required style={styles.input}>
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select value={formData.time_slot_id} onChange={e => setFormData({ ...formData, time_slot_id: e.target.value })} required style={styles.input}>
                        <option value="">Select Time Slot</option>
                        {timeSlots.map(t => <option key={t.id} value={t.id}>{t.name} ({t.start_time} - {t.end_time})</option>)}
                    </select>
                    <input type="text" placeholder="Topic / Lesson Description" value={formData.topic_description} onChange={e => setFormData({ ...formData, topic_description: e.target.value })} style={styles.input} required />

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                        <button type="submit" style={styles.submitBtn}>Save Schedule</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modal: {
        backgroundColor: 'white', padding: '2rem', borderRadius: '12px', minWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    input: {
        padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none'
    },
    cancelBtn: {
        padding: '0.75rem 1.5rem', border: 'none', background: '#e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
    },
    submitBtn: {
        padding: '0.75rem 1.5rem', border: 'none', background: 'var(--primary-color)', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
    }
};

export default ScheduleModal;
