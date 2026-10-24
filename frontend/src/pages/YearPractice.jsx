import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
import LoadingOverlay from '../components/LoadingOverlay';
import {
  getSubjects,
  getYears,
  getYearPracticeQuestions,
  submitYearPractice,
  getYearPracticeHistory,
  getYearPracticeSessionReview,
} from '../api';
import { formatDate, formatQuestionText } from '../utils';

export default function YearPractice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();

  // mode: 'select' | 'practice' | 'results' | 'history' | 'session-review'
  const [mode, setMode] = useState('select');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading...');

  // Select mode state
  const [subjectsList, setSubjectsList] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [count, setCount] = useState(20);

  // Practice mode state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Results mode state
  const [results, setResults] = useState(null);
  const [practiceSubject, setPracticeSubject] = useState('');
  const [practiceYear, setPracticeYear] = useState('');

  // History mode state
  const [history, setHistory] = useState([]);

  // Session review state
  const [sessionReview, setSessionReview] = useState(null);

  // ── On mount: handle navigation state ──────────────────────────
  useEffect(() => {
    const state = location.state;
    if (state?.mode === 'practice' && state?.subject && state?.year) {
      setSubject(state.subject);
      setYear(state.year);
      setPracticeSubject(state.subject);
      setPracticeYear(state.year);
      startPractice(state.subject, state.year, 20);
    } else {
      loadSelectData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load subjects and years for select screen ───────────────────
  async function loadSelectData() {
    setLoading(true);
    setLoadingMsg('Loading...');
    try {
      const [subjectsData, yearsData] = await Promise.all([getSubjects(), getYears()]);
      setSubjectsList(subjectsData.subjects || []);
      setYearsList(yearsData.years || []);
    } catch (err) {
      addToast('Failed to load: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Start practice ──────────────────────────────────────────────
  async function startPractice(subjectParam, yearParam, countParam) {
    setLoading(true);
    setLoadingMsg('Loading questions...');
    try {
      const data = await getYearPracticeQuestions(subjectParam, yearParam, countParam);

      if (data.incomplete_year_data) {
        addToast('Warning: Limited questions available for this year', 'warning');
      }

      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswers({});
      setPracticeSubject(subjectParam);
      setPracticeYear(yearParam);
      setMode('practice');
    } catch (err) {
      addToast('Failed to load questions: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Handle start from select form ──────────────────────────────
  async function handleStartPractice() {
    if (!subject || !year) {
      addToast('Please select both subject and year', 'warning');
      return;
    }
    await startPractice(subject, year, count);
  }

  // ── Practice mode handlers ──────────────────────────────────────
  function selectAnswer(questionId, answer) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function navigateQuestion(direction) {
    setCurrentIndex((prev) => prev + direction);
  }

  function confirmExit() {
    const confirmed = window.confirm('Exit practice? Your progress will be lost.');
    if (confirmed) {
      setMode('select');
      loadSelectData();
    }
  }

  async function handleSubmit() {
    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;

    if (answeredCount < totalCount) {
      const confirmed = window.confirm(`Only answered ${answeredCount}/${totalCount}. Submit anyway?`);
      if (!confirmed) return;
    }

    setLoading(true);
    setLoadingMsg('Submitting...');
    try {
      const answersPayload = questions.map((q) => ({
        question_id: q.question_id,
        user_answer: answers[q.question_id] || null,
      }));

      const result = await submitYearPractice(practiceSubject, practiceYear, answersPayload);
      setResults(result);
      setMode('results');
    } catch (err) {
      addToast('Failed to submit: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Load history ────────────────────────────────────────────────
  async function loadHistory() {
    setLoading(true);
    setLoadingMsg('Loading history...');
    try {
      const data = await getYearPracticeHistory();
      setHistory(data.history || []);
      setMode('history');
    } catch (err) {
      addToast('Failed to load history: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Load session review ─────────────────────────────────────────
  async function loadSessionReview(sessionId) {
    setLoading(true);
    setLoadingMsg('Loading review...');
    try {
      const session = await getYearPracticeSessionReview(sessionId);
      setSessionReview(session);
      setMode('session-review');
    } catch (err) {
      addToast('Failed to load review: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Loading overlay ─────────────────────────────────────────────
  if (loading) return <LoadingOverlay message={loadingMsg} />;

  // ── Render: Select mode ─────────────────────────────────────────
  if (mode === 'select') {
    return (
      <Layout>
        <div className="year-practice-screen">
          <h1><i className="fas fa-calendar-alt"></i> Practice by Year</h1>
          <p style={{ marginBottom: 32, color: 'var(--text-secondary)' }}>
            Select a subject and year to practice past JAMB questions
          </p>

          <div className="card">
            <div className="card-header">
              <h2>Select Practice Settings</h2>
            </div>

            <div className="form-group">
              <label htmlFor="year-subject">Subject</label>
              <select
                id="year-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                <option value="">-- Select Subject --</option>
                {subjectsList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year-year">Year</label>
              <select
                id="year-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">-- Select Year --</option>
                {yearsList.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year-count">Number of Questions</label>
              <select
                id="year-count"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
              >
                <option value={10}>10 questions</option>
                <option value={20}>20 questions</option>
                <option value={30}>30 questions</option>
                <option value={40}>40 questions</option>
              </select>
            </div>

            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleStartPractice}
            >
              <i className="fas fa-play-circle"></i> Start Practice
            </button>
            <button
              className="btn btn-outline btn-block"
              style={{ marginTop: 12 }}
              onClick={loadHistory}
            >
              <i className="fas fa-history"></i> View Practice History
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Render: Practice mode ───────────────────────────────────────
  if (mode === 'practice') {
    const question = questions[currentIndex];
    const total = questions.length;
    const current = currentIndex + 1;

    return (
      <Layout>
        <div className="practice-screen">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <button className="btn btn-outline" onClick={confirmExit}>
              <i className="fas fa-times"></i> Exit
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                Question {current} of {total}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {practiceSubject} {practiceYear}
              </div>
            </div>
            <div style={{ width: 100 }}></div>
          </div>

          {question && (
            <div className="question-card">
              <div className="question-number">{question.topic}</div>

              {question.passage && (
                <div
                  className="passage-box"
                  style={{
                    background: 'var(--bg-light)',
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 16,
                    borderLeft: '4px solid var(--info)',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--info)' }}>
                    <i className="fas fa-book-open"></i> Passage/Context:
                  </div>
                  <div style={{ lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                    {question.passage}
                  </div>
                </div>
              )}

              {question.table_html && (
                <div
                  className="table-context"
                  style={{
                    overflowX: 'auto',
                    marginBottom: 16,
                    borderLeft: '4px solid var(--primary-yellow)',
                    padding: '12px 12px 4px',
                    background: 'var(--bg-light)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--primary-yellow-dark)' }}>
                    <i className="fas fa-table"></i> Study the following:
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: question.table_html }} />
                </div>
              )}

              <div
                className="question-text"
                dangerouslySetInnerHTML={{
                  __html: formatQuestionText(
                    question.question,
                    question.subject || practiceSubject
                  ),
                }}
              />

              {question.image_path && (
                <img
                  src={question.image_path}
                  alt="Question image"
                  style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', margin: '16px 0', display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}

              <div className="options-list">
                {Object.entries(question.options || {}).map(([letter, text]) => (
                  <div
                    key={letter}
                    className={`option-item${answers[question.question_id] === letter ? ' selected' : ''}`}
                    onClick={() => selectAnswer(question.question_id, letter)}
                  >
                    <div className="option-letter">{letter}</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatQuestionText(text, question.subject || practiceSubject),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button
              className="btn btn-outline"
              onClick={() => navigateQuestion(-1)}
              disabled={current === 1}
            >
              <i className="fas fa-arrow-left"></i> Previous
            </button>

            {current === total ? (
              <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                <i className="fas fa-check-circle"></i> Submit Answers
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => navigateQuestion(1)}>
                Next <i className="fas fa-arrow-right"></i>
              </button>
            )}
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
            <i className="fas fa-trophy" style={{ fontSize: 64, color: 'var(--primary-yellow)' }}></i>
            <h1 style={{ margin: '20px 0' }}>
              {practiceSubject} {practiceYear} Results
            </h1>
            <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--primary-yellow-dark)', marginBottom: 8 }}>
              {results.summary?.score?.toFixed(1)}%
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {results.summary?.correct}/{results.summary?.total} correct
            </div>
          </div>

          <div className="stats-grid mb-3">
            <div className="stat-card">
              <i className="fas fa-check" style={{ color: 'var(--success)' }}></i>
              <div className="stat-value">{results.summary?.correct}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-card">
              <i className="fas fa-times" style={{ color: 'var(--error)' }}></i>
              <div className="stat-value">{results.summary?.incorrect}</div>
              <div className="stat-label">Incorrect</div>
            </div>
            <div className="stat-card">
              <i className="fas fa-trophy" style={{ color: 'var(--primary-yellow-dark)' }}></i>
              <div className="stat-value">{results.summary?.score?.toFixed(1)}%</div>
              <div className="stat-label">Score</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Answer Review</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(results.results || []).map((res, idx) => {
                const question = questions.find((q) => q.question_id === res.question_id);
                const isCorrect = res.is_correct !== undefined ? res.is_correct : res.correct;
                return (
                  <div
                    key={res.question_id || idx}
                    style={{
                      padding: 16,
                      border: `2px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: isCorrect ? '#E8F5E9' : '#FFEBEE',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <strong>Q{idx + 1}: {question?.topic}</strong>
                      <i
                        className={`fas fa-${isCorrect ? 'check-circle' : 'times-circle'}`}
                        style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontSize: 24 }}
                      ></i>
                    </div>
                    <p
                      style={{ marginBottom: 12 }}
                      dangerouslySetInnerHTML={{
                        __html: formatQuestionText(
                          question?.question || '',
                          question?.subject || practiceSubject
                        ),
                      }}
                    />
                    {question?.passage && (
                      <div style={{ background: 'var(--bg-light)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: 10, borderLeft: '4px solid var(--info)', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {question.passage}
                      </div>
                    )}
                    {question?.table_html && (
                      <div
                        style={{ overflowX: 'auto', marginBottom: 10, borderLeft: '4px solid var(--primary-yellow)', padding: '8px 12px 4px', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', fontSize: 13 }}
                        dangerouslySetInnerHTML={{ __html: question.table_html }}
                      />
                    )}
                    {question?.image_path && (
                      <img
                        src={question.image_path}
                        alt="Question image"
                        style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', margin: '8px 0 12px', display: 'block' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div>
                      <div>
                        <strong style={{ color: 'var(--success)' }}>Correct:</strong> {res.correct_answer}
                      </div>
                      {!isCorrect && (
                        <div>
                          <strong style={{ color: 'var(--error)' }}>Your answer:</strong>{' '}
                          {res.user_answer || 'None'}
                        </div>
                      )}
                    </div>
                    {res.explanation && (
                      <div style={{ marginTop: 12, padding: 12, background: 'var(--white)', borderRadius: 'var(--radius-sm)' }}>
                        <strong>Explanation:</strong> {res.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setMode('select');
                setResults(null);
                loadSelectData();
              }}
            >
              <i className="fas fa-redo"></i> New Practice
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

  // ── Render: History mode ────────────────────────────────────────
  if (mode === 'history') {
    return (
      <Layout>
        <div className="year-practice-screen">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                setMode('select');
                loadSelectData();
              }}
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <h1 style={{ margin: 0 }}><i className="fas fa-history"></i> Year Practice History</h1>
          </div>

          {history.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <i className="fas fa-inbox" style={{ fontSize: 48, color: 'var(--text-secondary)', opacity: 0.4 }}></i>
              <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>
                No year practice sessions yet.
              </p>
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setMode('select');
                  loadSelectData();
                }}
              >
                <i className="fas fa-play-circle"></i> Start a Practice
              </button>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h2>
                  {history.length} Session{history.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
                {history.map((session, idx) => {
                  const accuracy = typeof session.accuracy === 'number'
                    ? session.accuracy
                    : parseFloat(session.accuracy) || 0;
                  const accuracyColor =
                    accuracy >= 70
                      ? 'var(--success)'
                      : accuracy >= 50
                      ? '#D97706'
                      : 'var(--error)';

                  return (
                    <div
                      key={session.id || idx}
                      style={{
                        padding: '14px 16px',
                        background: 'var(--bg-light)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '4px solid #1D4ED8',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>
                          {session.subject} &mdash; {session.year}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                          {formatDate(session.date || session.completed_at)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#1D4ED8' }}>
                          {session.correct_answers}/{session.total_questions}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: accuracyColor }}>
                          {typeof session.accuracy === 'number'
                            ? session.accuracy.toFixed(1)
                            : session.accuracy}%
                        </span>
                        {session.id && (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 12px', fontSize: 12 }}
                            onClick={() => loadSessionReview(session.id)}
                          >
                            <i className="fas fa-eye"></i> Review
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // ── Render: Session Review mode ─────────────────────────────────
  if (mode === 'session-review' && sessionReview) {
    const reviewResults = sessionReview.results || [];
    const correctAnswers = sessionReview.correct_answers || 0;
    const totalQuestions = sessionReview.total_questions || 0;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy = sessionReview.accuracy || 0;

    return (
      <Layout>
        <div className="results-screen">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={loadHistory}>
              <i className="fas fa-arrow-left"></i> Back to History
            </button>
            <h1 style={{ margin: 0 }}>
              {sessionReview.subject} {sessionReview.year} &mdash; Review
            </h1>
          </div>

          <div className="stats-grid mb-3">
            <div className="stat-card">
              <i className="fas fa-trophy" style={{ color: 'var(--primary-yellow-dark)' }}></i>
              <div className="stat-value">{accuracy.toFixed(1)}%</div>
              <div className="stat-label">Score</div>
            </div>
            <div className="stat-card">
              <i className="fas fa-check" style={{ color: 'var(--success)' }}></i>
              <div className="stat-value">{correctAnswers}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-card">
              <i className="fas fa-times" style={{ color: 'var(--error)' }}></i>
              <div className="stat-value">{incorrectAnswers}</div>
              <div className="stat-label">Incorrect</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Question Review ({reviewResults.length} questions)</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Completed: {formatDate(sessionReview.completed_at)}
              </p>
            </div>

            {reviewResults.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
                <i className="fas fa-info-circle"></i> Detailed review is only available for sessions completed after the latest update.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
                {reviewResults.map((res, idx) => {
                  const isCorrect = res.is_correct;
                  const opts = res.options || {};
                  return (
                    <div
                      key={res.question_id || idx}
                      style={{
                        padding: 16,
                        border: `2px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: isCorrect ? '#f0fdf4' : '#fff1f2',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {res.subject || ''} &bull; {res.topic || ''}
                          </span>
                          <div style={{ fontWeight: 700, marginTop: 4 }}>Q{idx + 1}</div>
                        </div>
                        <i
                          className={`fas fa-${isCorrect ? 'check-circle' : 'times-circle'}`}
                          style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontSize: 22 }}
                        ></i>
                      </div>

                      <p style={{ margin: '0 0 12px', lineHeight: 1.5 }}>{res.question || ''}</p>

                      {Object.keys(opts).length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                          {Object.entries(opts).map(([key, text]) => {
                            const isCorrectOpt = key === res.correct_answer;
                            const isWrongUserAnswer = key === res.user_answer && !isCorrect;
                            return (
                              <div
                                key={key}
                                style={{
                                  padding: '7px 12px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  background: isCorrectOpt
                                    ? '#dcfce7'
                                    : isWrongUserAnswer
                                    ? '#fee2e2'
                                    : 'var(--bg-light)',
                                  border: `1px solid ${
                                    isCorrectOpt
                                      ? 'var(--success)'
                                      : isWrongUserAnswer
                                      ? 'var(--error)'
                                      : 'var(--border-color)'
                                  }`,
                                  fontWeight: isCorrectOpt || key === res.user_answer ? 600 : 400,
                                }}
                              >
                                <strong>{key}.</strong> {text}
                                {isCorrectOpt && (
                                  <span style={{ color: 'var(--success)', fontSize: 11 }}>
                                    {' '} &#10003; Correct
                                  </span>
                                )}
                                {isWrongUserAnswer && (
                                  <span style={{ color: 'var(--error)', fontSize: 11 }}>
                                    {' '} &#10005; Your answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, marginBottom: 8 }}>
                          <strong style={{ color: 'var(--success)' }}>Correct:</strong> {res.correct_answer}
                          {!isCorrect && (
                            <>
                              &nbsp; <strong style={{ color: 'var(--error)' }}>Yours:</strong>{' '}
                              {res.user_answer || 'None'}
                            </>
                          )}
                        </div>
                      )}

                      {res.explanation && (
                        <div style={{ padding: '10px 12px', background: 'white', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                          <strong>Explanation:</strong> {res.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setMode('select');
                setSessionReview(null);
                loadSelectData();
              }}
            >
              <i className="fas fa-play-circle"></i> New Practice
            </button>
            <button className="btn btn-outline" onClick={loadHistory}>
              <i className="fas fa-history"></i> History
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              <i className="fas fa-home"></i> Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Fallback
  return <LoadingOverlay message="Loading..." />;
}
