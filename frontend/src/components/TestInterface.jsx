import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Send } from 'lucide-react';

const TestInterface = ({ test, onClose }) => {
    const { user } = useContext(AuthContext);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(test.time_limit * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const [tabSwitches, setTabSwitches] = useState(0);

    // Load state from localStorage on init
    useEffect(() => {
        const savedAnswers = localStorage.getItem(`test_${test.id}_answers`);
        const savedTime = localStorage.getItem(`test_${test.id}_time`);

        if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
        if (savedTime) setTimeLeft(parseInt(savedTime));

        fetchQuestions();
    }, [test.id]);

    // Anti-cheat system
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !isFinished) {
                setTabSwitches(prev => prev + 1);
                setShowWarning(true);
                // Auto-close warning after 5 seconds
                setTimeout(() => setShowWarning(false), 5000);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isFinished]);

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0 && !isFinished) {
            submitTest();
            return;
        }

        const timer = setInterval(() => {
            if (!isFinished) {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    localStorage.setItem(`test_${test.id}_time`, newTime.toString());
                    return newTime;
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isFinished, test.id]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/questions.php?test_id=${test.id}`, { credentials: 'include' });
            const data = await res.json();
            setQuestions(data);
        } catch (error) {
            console.error("Questions fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionId) => {
        if (isFinished) return;
        const newAnswers = { ...answers, [questionId]: optionId };
        setAnswers(newAnswers);
        localStorage.setItem(`test_${test.id}_answers`, JSON.stringify(newAnswers));
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach(q => {
            const selectedOptionId = answers[q.id];
            const correctOption = q.options.find(opt => opt.is_correct);
            if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
                correctCount++;
            }
        });
        return correctCount;
    };

    const submitTest = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const calculatedScore = calculateScore();
        setScore(calculatedScore);

        try {
            const res = await fetch('/api/results.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    test_id: test.id,
                    score: calculatedScore,
                    total_questions: questions.length
                })
            });

            if (res.ok) {
                setIsFinished(true);
                // Clear localStorage on successful submission
                localStorage.removeItem(`test_${test.id}_answers`);
                localStorage.removeItem(`test_${test.id}_time`);
            }
        } catch (error) {
            alert("Natijani saqlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

    if (isFinished) {
        return (
            <div className="card result-card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem' }}>
                <div className={score / questions.length >= 0.6 ? "text-success" : "text-danger"}>
                    {score / questions.length >= 0.6 ? <CheckCircle size={80} style={{ marginBottom: '1.5rem' }} /> : <XCircle size={80} style={{ marginBottom: '1.5rem' }} />}
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test Yakunlandi!</h2>
                <div style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
                    Sizning natijangiz: <span style={{ fontWeight: 700, fontSize: '2.5rem' }}>{score}</span> / {questions.length}
                </div>
                <div className="progress-bar-container" style={{ height: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', marginBottom: '2rem' }}>
                    <div
                        className="progress-bar"
                        style={{
                            height: '100%',
                            width: `${(score / questions.length) * 100}%`,
                            backgroundColor: score / questions.length >= 0.6 ? '#28a745' : '#dc3545',
                            borderRadius: '5px'
                        }}
                    ></div>
                </div>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                    {tabSwitches > 0 && `Eslatma: Test davomida ${tabSwitches} marta boshqa oynaga o'tganingiz aniqlandi.`}
                </p>
                <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', padding: '1rem' }}>
                    Bosh sahifaga qaytish
                </button>
            </div>
        );
    }

    return (
        <div className="test-interface">
            {/* Header / Timer Bar */}
            <div className="test-header" style={{
                position: 'sticky', top: 0, zIndex: 100,
                backgroundColor: 'var(--white)', padding: '1rem 2rem',
                borderBottom: '2px solid var(--border-color)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h3 style={{ fontWeight: 700 }}>{test.title}</h3>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.5rem 1.25rem', borderRadius: '50px',
                    backgroundColor: timeLeft < 60 ? '#fff5f5' : '#f0f7ff',
                    color: timeLeft < 60 ? '#e03131' : 'var(--primary-color)',
                    fontWeight: 700, fontSize: '1.2rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                    <Clock size={20} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Anti-cheat Warning */}
            {showWarning && (
                <div className="cheat-warning" style={{
                    position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 1000, backgroundColor: '#fff3bf', border: '1px solid #fab005',
                    padding: '1rem 2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem',
                    boxShadow: '0 10px 15px rgba(0,0,0,0.1)', animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
                }}>
                    <AlertTriangle color="#fab005" />
                    <span><strong>Diqqat!</strong> Test paytida boshqa oynaga o'tish mumkin emas. Bu harakatingiz qayd etildi!</span>
                </div>
            )}

            <div className="questions-container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
                {questions.map((q, index) => (
                    <div key={q.id} className="card question-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '30px', height: '30px', borderRadius: '50%',
                                backgroundColor: 'var(--primary-color)', color: 'white',
                                fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                            }}>
                                {index + 1}
                            </span>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.5 }}>{q.question_text}</h4>
                        </div>

                        <div className="options-list" style={{ display: 'grid', gap: '0.75rem' }}>
                            {q.options.map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => handleOptionSelect(q.id, option.id)}
                                    style={{
                                        padding: '1rem 1.5rem', borderRadius: '10px',
                                        border: '2px solid',
                                        borderColor: answers[q.id] === option.id ? 'var(--primary-color)' : 'var(--border-color)',
                                        backgroundColor: answers[q.id] === option.id ? '#f0f7ff' : 'var(--white)',
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        fontWeight: 500
                                    }}
                                >
                                    <div style={{
                                        width: '18px', height: '18px', borderRadius: '50%', border: '2px solid',
                                        borderColor: answers[q.id] === option.id ? 'var(--primary-color)' : '#adb5bd',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {answers[q.id] === option.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>}
                                    </div>
                                    {option.option_text}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div style={{ paddingBottom: '5rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={submitTest}
                        disabled={isSubmitting || questions.length === 0}
                        style={{
                            width: '100%', padding: '1.25rem', borderRadius: '12px', fontSize: '1.1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
                        }}
                    >
                        {isSubmitting ? <div className="spinner-small"></div> : <Send size={20} />}
                        Testni Yakunlash
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0) translateX(-50%); }
                    20%, 80% { transform: translate3d(2px, 0, 0) translateX(-50%); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0) translateX(-50%); }
                    40%, 60% { transform: translate3d(4px, 0, 0) translateX(-50%); }
                }
                .question-card {
                    border-radius: 16px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    transition: border-color 0.3s ease;
                }
                .spinner-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 300px;
                }
                .spinner-small {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255,255,255,.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default TestInterface;
