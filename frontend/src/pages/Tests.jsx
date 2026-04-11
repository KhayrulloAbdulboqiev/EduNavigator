import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Plus, Clock, ChevronRight } from 'lucide-react';
import TestInterface from '../components/TestInterface';
import AdminTestManager from './AdminTestManager';

const Tests = () => {
    const { user } = useContext(AuthContext);
    const [subjects, setSubjects] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [activeTest, setActiveTest] = useState(null);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchTests(selectedSubject.id);
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/subjects.php', { credentials: 'include' });
            if (!res.ok) throw new Error('Fanlarni yuklashda xatolik yuz berdi');
            const data = await res.json();
            setSubjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTests = async (subjectId) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/tests.php?subject_id=${subjectId}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Testlarni yuklashda xatolik yuz berdi');
            const data = await res.json();
            setTests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isAdminMode) {
        return (
            <AdminTestManager
                isAdmin={user?.role === 'admin'}
                onClose={() => {
                    setIsAdminMode(false);
                    fetchSubjects();
                }}
            />
        );
    }

    if (activeTest) {
        return (
            <TestInterface
                test={activeTest}
                onClose={() => {
                    setActiveTest(null);
                    if (selectedSubject) fetchTests(selectedSubject.id);
                }}
            />
        );
    }

    return (
        <div className="tests-container fade-in">
            <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                        {selectedSubject ? `${selectedSubject.name} - Testlar` : 'Testlar Markazi'}
                    </h2>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>
                        {selectedSubject ? 'Mavjud testlardan birini tanlang va bilimingizni sinang!' : 'Fanlardan birini tanlang va testlarni boshlang!'}
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => setIsAdminMode(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} />
                    Test Qo'shish
                </button>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {!selectedSubject ? (
                // Subject Categories Grid
                <div className="subjects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {subjects.map(subject => (
                        <div
                            key={subject.id}
                            className="card subject-card clickable"
                            onClick={() => setSelectedSubject(subject)}
                            style={{
                                borderLeft: `5px solid ${subject.color_code || 'var(--primary-color)'}`,
                                transition: 'transform 0.2s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className="icon-circle" style={{ backgroundColor: `${subject.color_code}15`, color: subject.color_code }}>
                                        <BookOpen size={24} />
                                    </div>
                                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{subject.name}</span>
                                </div>
                                <ChevronRight size={20} color="var(--text-light)" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Test Listing for Select Subject
                <div>
                    <button
                        className="btn-text"
                        onClick={() => setSelectedSubject(null)}
                        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: 600 }}
                    >
                        ← Fanlarga qaytish
                    </button>

                    {tests.length === 0 && !loading ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-light)' }}>Hozircha ushbu fan bo'yicha testlar mavjud emas.</p>
                        </div>
                    ) : (
                        <div className="tests-list" style={{ display: 'grid', gap: '1rem' }}>
                            {tests.map(test => (
                                <div key={test.id} className="card test-card hover-glow" style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{test.title}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <Clock size={16} />
                                                    {test.time_limit} daqiqa
                                                </span>
                                                <span>•</span>
                                                <span> {test.description || 'Tavsif mavjud emas'}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setActiveTest(test)}
                                        >
                                            Boshlash
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="spinner"></div>
                </div>
            )}

            <style>{`
                .subject-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                }
                .icon-circle {
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hover-glow:hover {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 15px rgba(10, 37, 64, 0.1);
                }
                .btn-text {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    font-size: 1rem;
                }
                .btn-text:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default Tests;
