import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ArrowLeft, Check, AlertCircle } from 'lucide-react';

const CreateTest = ({ onClose }) => {
    const [subjects, setSubjects] = useState([]);
    const [testData, setTestData] = useState({
        subject_id: '', title: '', description: '', time_limit: 30
    });
    const [createdTestId, setCreatedTestId] = useState(null);
    const [questions, setQuestions] = useState([
        {
            question_text: '', points: 1, options: [
                { option_text: '', is_correct: true },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false }
            ]
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await fetch('/api/subjects.php', { credentials: 'include' });
            const data = await res.json();
            setSubjects(data);
        } catch (err) {
            console.error("Subjects fetch failed:", err);
        }
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/tests.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });
            const data = await res.json();
            if (res.ok) {
                setCreatedTestId(data.id);
                setMessage({ type: 'success', text: 'Test sarlavhasi yaratildi. Endi savollarni qo\'shing.' });
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            question_text: '', points: 1, options: [
                { option_text: '', is_correct: true },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false }
            ]
        }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const newQuestions = [...questions];
        if (field === 'is_correct' && value === true) {
            // Only one correct option per question
            newQuestions[qIndex].options.forEach((opt, idx) => {
                opt.is_correct = (idx === oIndex);
            });
        } else {
            newQuestions[qIndex].options[oIndex][field] = value;
        }
        setQuestions(newQuestions);
    };

    const saveQuestions = async () => {
        setLoading(true);
        try {
            for (const question of questions) {
                const res = await fetch('/api/questions.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...question, test_id: createdTestId })
                });
                if (!res.ok) throw new Error("Savollarni saqlashda xatolik.");
            }
            setMessage({ type: 'success', text: 'Barcha savollar muvaffaqiyatli saqlandi!' });
            setTimeout(onClose, 2000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-manager fade-in" style={{ paddingBottom: '5rem' }}>
            <div className="header-flex" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={onClose} className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Yangi Test Yaratish</h2>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`} style={{
                    marginBottom: '2rem', padding: '1rem', borderRadius: '8px',
                    backgroundColor: message.type === 'success' ? '#ebfbee' : '#fff5f5',
                    color: message.type === 'success' ? '#2b8a3e' : '#e03131',
                    border: '1px solid',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                    {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            {!createdTestId ? (
                <div className="card" style={{ padding: '2.5rem', maxWidth: '700px' }}>
                    <form onSubmit={handleCreateTest}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Fan</label>
                            <select
                                className="form-control"
                                value={testData.subject_id}
                                onChange={(e) => setTestData({ ...testData, subject_id: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            >
                                <option value="">Fanni tanlang</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Test Sarlavhasi</label>
                            <input
                                type="text"
                                className="form-control"
                                value={testData.title}
                                onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                                placeholder="Masalan: 1-chorak yakuniy testi"
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Vaqt Chegarasi (daqiqa)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={testData.time_limit}
                                onChange={(e) => setTestData({ ...testData, time_limit: e.target.value })}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tavsif</label>
                            <textarea
                                className="form-control"
                                value={testData.description}
                                onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '100px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                            {loading ? 'Yaratilmoqda...' : 'Testni Saqlash'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="questions-editor">
                    {questions.map((q, qIdx) => (
                        <div key={qIdx} className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h4 style={{ fontWeight: 700 }}>Savol {qIdx + 1}</h4>
                                <button onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))} style={{ color: '#fa5252', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <textarea
                                placeholder="Savol matnini kiriting..."
                                value={q.question_text}
                                onChange={(e) => handleQuestionChange(qIdx, 'question_text', e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', minHeight: '80px' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', padding: '0.75rem', borderRadius: '8px' }}>
                                        <input
                                            type="radio"
                                            checked={opt.is_correct}
                                            onChange={() => handleOptionChange(qIdx, oIdx, 'is_correct', true)}
                                        />
                                        <input
                                            type="text"
                                            placeholder={`Variant ${oIdx + 1}`}
                                            value={opt.option_text}
                                            onChange={(e) => handleOptionChange(qIdx, oIdx, 'option_text', e.target.value)}
                                            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button className="btn btn-secondary" onClick={addQuestion} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Plus size={20} /> Savol Qo'shish
                        </button>
                        <button className="btn btn-primary" onClick={saveQuestions} disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Save size={20} /> {loading ? 'Saqlanmoqda...' : 'Barchasini Saqlash'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTest;
