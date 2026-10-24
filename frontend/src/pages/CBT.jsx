import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
import LoadingOverlay from '../components/LoadingOverlay';
import {
  createCBTSession,
  getCBTQuestions,
  submitCBT,
  reviewCBT,
  getSubjects,
  resumeCBTSession,
} from '../api';
import { formatTime, formatQuestionText } from '../utils';

const ENGLISH_LABELS = ['English', 'English Language', 'Use of English'];

export default function CBT() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();

  // mode: 'select' | 'exam' | 'results' | 'review'
  const [mode, setMode] = useState('select');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading...');

  // Select mode
  const [subjectsList, setSubjectsList] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Exam mode
  const [sessionId, setSessionId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(7200);
  const [examStartTime, setExamStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(7200);

  // Results mode
  const [results, setResults] = useState(null);

  // Review mode
  const [reviewData, setReviewData] = useState(null);

  const timerRef = useRef(null);

  // ── On mount: handle navigation state ──────────────────────────
  useEffect(() => {
    const state = location.state;
    if (state?.mode === 'review' && state?.sessionId) {
      loadReview(state.sessionId);
    } else if (state?.mode === 'resume' && state?.sessionId) {
      handleResume(state.sessionId);
    } else {
      loadSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── beforeunload warning during exam ───────────────────────────
  useEffect(() => {
    if (mode !== 'exam') return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [mode]);

  // ── Timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'exam' || !examStartTime) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
      const remaining = timeLimit - elapsed;
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        addToast('Time is up! Auto-submitting exam...', 'warning');
        setTimeout(() => handleSubmitExam(), 2000);
        return;
      }
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, examStartTime, timeLimit]);

  // ── Cleanup timer on unmount ────────────────────────────────────
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Load subjects for select screen ────────────────────────────
  async function loadSubjects() {
    setLoading(true);
    setLoadingMsg('Loading...');
    try {
      const data = await getSubjects();
      const list = data.subjects || [];
      setSubjectsList(list);
      // Pre-select English
      const englishSubject = list.find((s) => ENGLISH_LABELS.includes(s));
      if (englishSubject) setSelectedSubjects([englishSubject]);
    } catch (err) {
      addToast('Failed to load subjects: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Resume session ──────────────────────────────────────────────
  async function handleResume(sid) {
    setLoading(true);
    setLoadingMsg('Resuming session...');
    try {
      const data = await resumeCBTSession(sid);
      setSessionId(data.session_id || sid);
      setSubjects(data.subjects || []);
      setTimeLimit((data.time_limit_minutes || 120) * 60);

      setLoadingMsg('Loading questions...');
      const questionsData = await getCBTQuestions(data.session_id || sid);
      setQuestions(questionsData.questions || []);

      const start = Date.now() - ((data.elapsed_seconds || 0) * 1000);
      setExamStartTime(start);
      setTimeLeft(Math.max(0, (data.time_limit_minutes || 120) * 60 - (data.elapsed_seconds || 0)));
      setCurrentSubjectIndex(0);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setMode('exam');
    } catch (err) {
      addToast('Failed to resume session: ' + err.message, 'error');
      loadSubjects();
    } finally {
      setLoading(false);
    }
  }

  // ── Load review ─────────────────────────────────────────────────
  async function loadReview(sid) {
    setLoading(true);
    setLoadingMsg('Loading review...');
    try {
      const data = await reviewCBT(sid);
      setReviewData(data);
      setMode('review');
    } catch (err) {
      addToast('Failed to load review: ' + err.message, 'error');
      setMode('select');
      loadSubjects();
    } finally {
      setLoading(false);
    }
  }

  // ── Subject selection handlers ──────────────────────────────────
  function handleSubjectToggle(subject) {
    const isEnglish = ENGLISH_LABELS.includes(subject);
    if (isEnglish) {
      addToast('English is mandatory and cannot be deselected', 'warning');
      return;
    }
    setSelectedSubjects((prev) => {
      if (prev.includes(subject)) {
        return prev.filter((s) => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  }

  // ── Start exam ──────────────────────────────────────────────────
  async function handleStartExam() {
    if (selectedSubjects.length !== 4) {
      addToast('Please select exactly 4 subjects (English Language + 3 more)', 'warning');
      return;
    }

    const confirmed = window.confirm('Ready to start CBT exam? Timer will begin immediately.');
    if (!confirmed) return;

    // Normalize English labels to 'English' for the backend
    const normalizedSubjects = selectedSubjects.map((s) =>
      ENGLISH_LABELS.includes(s) ? 'English' : s
    );

    setLoading(true);
    setLoadingMsg('Creating exam session...');
    try {
      const data = await createCBTSession(normalizedSubjects);

      setSessionId(data.session_id);
      setSubjects(data.subjects);
      setTimeLimit((data.time_limit_minutes || 120) * 60);
      setTimeLeft((data.time_limit_minutes || 120) * 60);

      setLoadingMsg('Loading questions...');
      const questionsData = await getCBTQuestions(data.session_id);
      setQuestions(questionsData.questions || []);

      setCurrentSubjectIndex(0);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setFlagged(new Set());
      setExamStartTime(Date.now());
      setMode('exam');
    } catch (err) {
      addToast('Failed to create exam: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Exam interaction handlers ───────────────────────────────────
  function switchSubject(index) {
    setCurrentSubjectIndex(index);
    setCurrentQuestionIndex(0);
  }

  function selectAnswer(questionId, answer) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function navigateQuestion(direction) {
    setCurrentQuestionIndex((prev) => prev + direction);
  }

  function toggleFlag(questionId) {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }

  function confirmSubmit() {
    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;
    const confirmed = window.confirm(
      `You've answered ${answeredCount}/${totalCount} questions. Submit exam now?`
    );
    if (confirmed) handleSubmitExam();
  }

  async function handleSubmitExam() {
    if (timerRef.current) clearInterval(timerRef.current);

    setLoading(true);
    setLoadingMsg('Submitting exam...');
    try {
      if (!sessionId) throw new Error('No active CBT session');
      if (!questions || questions.length === 0) throw new Error('No questions loaded');

      const answersPayload = questions.map((q) => ({
        question_id: q.question_id,
        user_answer: answers[q.question_id] || null,
      }));

      const result = await submitCBT(sessionId, answersPayload);
      setResults(result);
      setMode('results');
    } catch (err) {
      addToast('Failed to submit: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Computed values for exam mode ───────────────────────────────
  const currentSubjectPosition = currentSubjectIndex + 1;
  const currentQuestions = questions.filter(
    (q) => q.subject_position === currentSubjectPosition
  );
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalInSubject = currentQuestions.length;

  // ── Render: Loading ─────────────────────────────────────────────
  if (loading) return <LoadingOverlay message={loadingMsg} />;

  // ── Render: Select mode ─────────────────────────────────────────
  if (mode === 'select') {
    const otherCount = selectedSubjects.filter((s) => !ENGLISH_LABELS.includes(s)).length;
    const englishInList = selectedSubjects.find((s) => ENGLISH_LABELS.includes(s));
    const displayCount = selectedSubjects.length;

    return (
      <Layout>
        <div className="cbt-screen">
          <h1><i className="fas fa-laptop"></i> Full CBT Simulation</h1>
          <p style={{ marginBottom: 32, color: 'var(--text-secondary)' }}>
            Experience real JAMB exam conditions with 180 questions and a 2-hour timer
          </p>

          <div className="card">
            <div className="card-header">
              <h2>Select Your 4 Subjects</h2>
            </div>

            <div style={{ background: 'var(--primary-yellow-light)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
              <strong>Important:</strong>
              <ul style={{ margin: '8px 0 0 20px', lineHeight: 1.8 }}>
                <li><strong>English Language is mandatory</strong> (always included)</li>
                <li>Select exactly 3 more subjects from the list below</li>
                <li>You'll have <strong>2 hours</strong> to complete <strong>180 questions</strong> (English: 60, other subjects: 40 each)</li>
                <li>Timer starts immediately after you begin</li>
                <li>You can switch between subjects during the exam</li>
              </ul>
            </div>

            <div id="subject-selection" className="cbt-subject-grid">
              {subjectsList.map((s) => {
                const isEnglish = ENGLISH_LABELS.includes(s);
                const isChecked = selectedSubjects.includes(s);
                return (
                  <label
                    key={s}
                    className="cbt-subject-option"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 16,
                      background: isChecked ? 'var(--primary-yellow-light)' : 'var(--bg-light)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: isChecked ? '2px solid var(--primary-yellow)' : '2px solid transparent',
                      transition: 'var(--transition)',
                    }}
                    onClick={() => handleSubjectToggle(s)}
                  >
                    <input
                      type="checkbox"
                      name="cbt-subject"
                      value={s}
                      checked={isChecked}
                      onChange={() => handleSubjectToggle(s)}
                      style={{ marginRight: 12, width: 20, height: 20 }}
                    />
                    <span style={{ fontWeight: 600 }}>
                      {s}{isEnglish ? ' (Required)' : ''}
                    </span>
                  </label>
                );
              })}
            </div>

            <div
              id="subject-count"
              style={{
                marginBottom: 20,
                padding: 12,
                background: 'var(--bg-light)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                fontWeight: 600,
                color: displayCount === 4 ? 'var(--success)' : 'var(--text-primary)',
              }}
            >
              {displayCount} of 4 subjects selected (English Language + {otherCount} more)
            </div>

            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleStartExam}
              disabled={selectedSubjects.length !== 4}
              id="start-cbt-btn"
            >
              <i className="fas fa-play-circle"></i> Start CBT Exam
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Render: Exam mode ───────────────────────────────────────────
  if (mode === 'exam') {
    return (
      <Layout>
        <div className="cbt-exam-screen">
          <div className="cbt-exam-header">
            <div className="timer-display" id="cbt-timer-container">
              <i className="fas fa-clock"></i>
              <span
                id="cbt-timer"
                className={timeLeft < 300 ? 'warning' : ''}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="cbt-subject-tabs">
              {subjects.map((subj, idx) => (
                <button
                  key={subj}
                  className={`btn ${idx === currentSubjectIndex ? 'btn-primary' : 'btn-outline'} cbt-tab-btn`}
                  onClick={() => switchSubject(idx)}
                >
                  {subj}
                </button>
              ))}
            </div>

            <button className="btn btn-primary" onClick={confirmSubmit}>
              <i className="fas fa-check-circle"></i> Submit
            </button>
          </div>

          <div className="card mb-3">
            <div style={{ padding: 16, background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{subjects[currentSubjectIndex]}</strong>
              <span>Question {currentQuestionIndex + 1} of {totalInSubject}</span>
            </div>
          </div>

          {currentQuestion ? (
            <div className="question-card">
              <div className="question-number">Question {currentQuestionIndex + 1}</div>

              {currentQuestion.passage && (
                <div
                  className="passage-box"
                  style={{
                    background: 'var(--bg-light)',
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 16,
                    borderLeft: '4px solid var(--info)',
                    maxHeight: 220,
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--info)' }}>
                    <i className="fas fa-book-open"></i> Passage/Context:
                  </div>
                  <div style={{ lineHeight: 1.6, color: 'var(--text-secondary)', fontSize: 14, whiteSpace: 'pre-wrap' }}>
                    {currentQuestion.passage}
                  </div>
                </div>
              )}

              {currentQuestion.table_html && (
                <div
                  style={{
                    overflowX: 'auto',
                    marginBottom: 16,
                    borderLeft: '4px solid var(--primary-yellow)',
                    padding: '12px 12px 4px',
                    background: 'var(--bg-light)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--primary-yellow-dark)', fontSize: 13 }}>
                    <i className="fas fa-table"></i> Study the following:
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: currentQuestion.table_html }} />
                </div>
              )}

              <div
                className="question-text"
                dangerouslySetInnerHTML={{
                  __html: formatQuestionText(
                    currentQuestion.question,
                    subjects[currentSubjectIndex]
                  ),
                }}
              />

              {currentQuestion.image_path && (
                <img
                  src={currentQuestion.image_path}
                  alt="Question image"
                  style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', margin: '16px 0', display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}

              <div className="options-list">
                {Object.entries(currentQuestion.options || {}).map(([letter, text]) => (
                  <div
                    key={letter}
                    className={`option-item${answers[currentQuestion.question_id] === letter ? ' selected' : ''}`}
                    onClick={() => selectAnswer(currentQuestion.question_id, letter)}
                  >
                    <div className="option-letter">{letter}</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatQuestionText(text, subjects[currentSubjectIndex]),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--text-secondary)' }}>No questions available for this subject.</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button
              className="btn btn-outline"
              onClick={() => navigateQuestion(-1)}
              disabled={currentQuestionIndex === 0}
            >
              <i className="fas fa-arrow-left"></i> Previous
            </button>

            <button
              className="btn btn-outline"
              onClick={() => navigateQuestion(1)}
              disabled={currentQuestionIndex === totalInSubject - 1}
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Render: Results mode ────────────────────────────────────────
  if (mode === 'results' && results) {
    return (
      <Layout>
        <div className="results-screen">
          <div className="text-center mb-3">
            <i className="fas fa-trophy" style={{ fontSize: 80, color: 'var(--primary-yellow)' }}></i>
            <h1 style={{ margin: '20px 0' }}>CBT Exam Complete!</h1>
            <div style={{ fontSize: 56, fontWeight: 700, color: 'var(--primary-yellow-dark)', marginBottom: 8 }}>
              {results.overall_score}/160
            </div>
            <div style={{ fontSize: 20, color: 'var(--text-secondary)' }}>
              {results.overall_accuracy?.toFixed(1)}% Overall Accuracy
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">
              <h2>Subject Breakdown</h2>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              {(results.subject_breakdown || []).map((sub) => (
                <div
                  key={sub.subject}
                  style={{
                    padding: 16,
                    background: 'var(--bg-light)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--primary-yellow)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong>{sub.subject}</strong>
                    <span style={{ fontSize: 20, fontWeight: 600 }}>{sub.correct}/{sub.total}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Accuracy: {sub.accuracy?.toFixed(1)}%
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${sub.accuracy}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/cbt', { state: { mode: 'review', sessionId: results.session_id } })}
            >
              <i className="fas fa-eye"></i> Review Answers
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setMode('select');
                setResults(null);
                loadSubjects();
              }}
            >
              <i className="fas fa-redo"></i> New Exam
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/dashboard')}
            >
              <i className="fas fa-home"></i> Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Render: Review mode ─────────────────────────────────────────
  if (mode === 'review' && reviewData) {
    return (
      <Layout>
        <div className="results-screen">
          <h1>
            <i className="fas fa-eye"></i> CBT Review -{' '}
            {reviewData.score}/{reviewData.total} ({reviewData.accuracy?.toFixed(1)}%)
          </h1>

          <div className="card mt-3">
            <div className="card-header">
              <h2>All Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(reviewData.questions_with_answers || []).map((q, idx) => (
                <div
                  key={q.question_id || idx}
                  style={{
                    padding: 16,
                    border: `2px solid ${q.is_correct ? 'var(--success)' : 'var(--error)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: q.is_correct ? '#E8F5E9' : '#FFEBEE',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong>Q{q.question_number}: {q.subject}</strong>
                    <i
                      className={`fas fa-${q.is_correct ? 'check-circle' : 'times-circle'}`}
                      style={{ color: q.is_correct ? 'var(--success)' : 'var(--error)', fontSize: 24 }}
                    ></i>
                  </div>

                  {q.passage && (
                    <div style={{ background: 'var(--bg-light)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: 10, borderLeft: '4px solid var(--info)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      <strong style={{ color: 'var(--info)', display: 'block', marginBottom: 4 }}><i className="fas fa-book-open"></i> Passage/Context:</strong>
                      {q.passage}
                    </div>
                  )}

                  {q.table_html && (
                    <div style={{ overflowX: 'auto', marginBottom: 10, borderLeft: '4px solid var(--primary-yellow)', padding: '8px 12px 4px', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', fontSize: 13 }}
                      dangerouslySetInnerHTML={{ __html: q.table_html }} />
                  )}

                  <p style={{ marginBottom: 10 }}
                    dangerouslySetInnerHTML={{ __html: formatQuestionText(q.question || '', q.subject || '') }} />

                  {q.image_path && (
                    <img src={q.image_path} alt="Question" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', margin: '8px 0 12px', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                  )}

                  {q.options && Object.keys(q.options).length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      {Object.entries(q.options).map(([key, text]) => {
                        const isCorrect = key === q.correct_answer;
                        const isWrong = key === q.user_answer && !q.is_correct;
                        return (
                          <div key={key} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 13, background: isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : 'var(--bg-light)', border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--border-color)'}`, fontWeight: isCorrect || key === q.user_answer ? 600 : 400 }}>
                            <strong>{key}.</strong> {text}
                            {isCorrect && <span style={{ color: 'var(--success)', fontSize: 11 }}> ✓ Correct</span>}
                            {isWrong && <span style={{ color: 'var(--error)', fontSize: 11 }}> ✗ Your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ marginBottom: 8 }}>
                      <div><strong style={{ color: 'var(--success)' }}>Correct:</strong> {q.correct_answer}</div>
                      {!q.is_correct && <div><strong style={{ color: 'var(--error)' }}>Your answer:</strong> {q.user_answer || 'None'}</div>}
                    </div>
                  )}

                  {q.explanation && (
                    <div style={{ marginTop: 10, padding: 12, background: 'var(--white)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn btn-outline mt-3"
            onClick={() => navigate('/dashboard')}
          >
            <i className="fas fa-home"></i> Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  // Fallback while loading or transitioning
  return <LoadingOverlay message="Loading..." />;
}
