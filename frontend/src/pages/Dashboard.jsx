import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingOverlay from '../components/LoadingOverlay'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getDashboardStats, getPoints } from '../api'
import { formatDate } from '../utils'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [pointsData, setPointsData] = useState({
    total_points: 0,
    level: 1,
    level_name: 'Beginner',
    breakdown: {},
  })

  // Collapsible section state
  const [strengthsOpen, setStrengthsOpen] = useState(false)
  const [weaknessesOpen, setWeaknessesOpen] = useState(false)
  const [yearPracticeOpen, setYearPracticeOpen] = useState(true)

  // Filter state
  const [activityFilter, setActivityFilter] = useState('count-5')
  const [cbtFilter, setCbtFilter] = useState('count-3')
  const [yearFilter, setYearFilter] = useState('count-5')

  const pollRef = useRef(null)

  useEffect(() => {
    loadDashboard()
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadDashboard() {
    setLoading(true)
    try {
      const [statsRes, pointsRes] = await Promise.allSettled([
        getDashboardStats(),
        getPoints(),
      ])

      if (statsRes.status === 'fulfilled') setStats(statsRes.value)
      if (pointsRes.status === 'fulfilled') setPointsData(pointsRes.value)

      if (statsRes.status === 'rejected') throw statsRes.reason
    } catch (err) {
      addToast('Failed to load dashboard: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }

    // Poll every 30 seconds
    pollRef.current = setInterval(async () => {
      try {
        const fresh = await getDashboardStats()
        if (fresh) setStats(fresh)
      } catch {
        // silent
      }
    }, 30000)
  }

  // ─── Filter helpers ────────────────────────────────────────────────
  function applyFilter(data, filterValue) {
    if (!data) return []
    if (filterValue === 'all') return data
    if (filterValue.startsWith('count-')) {
      const limit = parseInt(filterValue.split('-')[1])
      return data.slice(0, limit)
    }
    if (filterValue.startsWith('days-')) {
      const days = parseInt(filterValue.split('-')[1])
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
      return data.filter((item) => {
        const ts = new Date(item.timestamp || item.completed_at || item.date).getTime()
        return !isNaN(ts) && ts >= cutoff
      })
    }
    return data.slice(0, parseInt(filterValue) || 5)
  }

  // ─── Score colour helper (for activity) ───────────────────────────
  const sourceConfig = {
    cbt: { label: 'CBT', color: '#7C3AED', bg: '#F3E8FF' },
    year: { label: 'Year', color: '#1D4ED8', bg: '#EFF6FF' },
    guided: { label: 'Guided', color: '#D97706', bg: '#FFF9E6' },
    topic: { label: 'Topic', color: '#15803D', bg: '#F0FDF4' },
    revision: { label: 'Revision', color: '#BE123C', bg: '#FFF1F2' },
  }

  if (loading) return <LoadingOverlay message="Loading dashboard..." />

  if (!stats) return null

  const breakdown = pointsData.breakdown || {}
  const filteredActivity = applyFilter(stats.recent_attempts, activityFilter)
  const filteredCbt = applyFilter(stats.cbt_history, cbtFilter)
  const filteredYearPractice = applyFilter(stats.year_practice_history, yearFilter)

  const hasBoth =
    stats.strengths?.length > 0 && stats.weaknesses?.length > 0

  return (
    <Layout>
      <div className="dashboard">
        <h1 style={{ marginBottom: '24px' }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>

        {/* ── Stats Cards ── */}
        <div className="stats-grid">
          {/* Points */}
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Points</p>
                <h3 style={{ color: 'var(--primary-yellow)' }}>{pointsData.total_points}</h3>
              </div>
              <i className="fas fa-star" style={{ fontSize: '32px', color: 'var(--primary-yellow)', opacity: 0.3 }}></i>
            </div>
          </div>
          {/* Accuracy */}
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Accuracy</p>
                <h3 style={{ color: 'var(--success)' }}>{stats.overall_stats.overall_accuracy.toFixed(1)}%</h3>
              </div>
              <i className="fas fa-bullseye" style={{ fontSize: '32px', color: 'var(--success)', opacity: 0.3 }}></i>
            </div>
          </div>
          {/* Correct Answers */}
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Correct Answers</p>
                <h3 style={{ color: 'var(--success)' }}>{stats.overall_stats.correct_attempts}</h3>
              </div>
              <i className="fas fa-check-circle" style={{ fontSize: '32px', color: 'var(--success)', opacity: 0.3 }}></i>
            </div>
          </div>
          {/* Active Days */}
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Active Days</p>
                <h3 style={{ color: 'var(--primary-yellow-dark)' }}>{stats.overall_stats.total_active_days}</h3>
              </div>
              <i className="fas fa-calendar-check" style={{ fontSize: '32px', color: 'var(--primary-yellow-dark)', opacity: 0.3 }}></i>
            </div>
          </div>
        </div>

        {/* ── Level & Streak ── */}
        <div
          className="level-streak-row mt-3"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch' }}
        >
          {/* Level Card */}
          <div className="learning-level-card card" style={{ borderTop: '4px solid #8b5cf6', marginBottom: 0 }}>
            <div className="card-header">
              <h2>
                <i className="fas fa-trophy" style={{ color: '#ffd700' }}></i> Your Level
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 0' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {pointsData.level}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '22px',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {pointsData.level_name}
                </h3>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                  {pointsData.total_points} total points
                </p>
                <div className="points-breakdown" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {breakdown.learning && (
                    <span className="points-badge" title="From guided learning">
                      <i className="fas fa-book"></i> {breakdown.learning}
                    </span>
                  )}
                  {breakdown.cbt && (
                    <span className="points-badge" title="From CBT exams">
                      <i className="fas fa-laptop"></i> {breakdown.cbt}
                    </span>
                  )}
                  {breakdown.year_practice && (
                    <span className="points-badge" title="From year practice">
                      <i className="fas fa-calendar"></i> {breakdown.year_practice}
                    </span>
                  )}
                  {breakdown.topic_practice && (
                    <span className="points-badge" title="From topic practice">
                      <i className="fas fa-pen"></i> {breakdown.topic_practice}
                    </span>
                  )}
                  {breakdown.streak_bonus && (
                    <span className="points-badge" title="Streak bonus">
                      <i className="fas fa-fire"></i> {breakdown.streak_bonus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="streak-card" style={{ margin: 0, minHeight: '120px' }}>
            <div className="streak-icon" style={{ fontSize: '40px' }}>🔥</div>
            <div className="streak-info">
              <h3 style={{ fontSize: '28px' }}>{stats.streak.current_streak} Day Streak!</h3>
              <p>
                Longest: {stats.streak.longest_streak} days
                <br />
                <span style={{ fontSize: '12px', opacity: 0.8 }}>
                  Last activity: {formatDate(stats.streak.last_activity)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="card mt-3">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button className="btn btn-primary" onClick={() => navigate('/guided-learn')}>
              <i className="fas fa-book-reader"></i> Learn Topics
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/year-practice')}>
              <i className="fas fa-calendar-alt"></i> Year Practice
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/cbt')}>
              <i className="fas fa-laptop"></i> Start CBT
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/analytics')}>
              <i className="fas fa-chart-line"></i> View Analytics
            </button>
          </div>
        </div>

        {/* ── Recommended Topics ── */}
        {stats.recommended_topics && stats.recommended_topics.length > 0 && (
          <div className="card mt-3" style={{ borderTop: '4px solid var(--success)' }}>
            <div className="card-header">
              <h2>
                <i className="fas fa-lightbulb" style={{ color: 'var(--primary-yellow)' }}></i>{' '}
                Recommended Topics for You
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {stats.profile?.department ? (
                  <>Based on your <strong>{stats.profile.department}</strong> department and your performance</>
                ) : (
                  'Based on your performance'
                )}
              </p>
            </div>
            <div className="recommended-topics-grid">
              {stats.recommended_topics.map((topic, idx) => {
                const sourceLabels = {
                  learning: 'Guided Learning',
                  practice: 'Practice',
                  cbt: 'CBT',
                  year_practice: 'Year Practice',
                  suggested: 'Suggested',
                }
                const sourceLabel = sourceLabels[topic.source] || ''
                return (
                  <div
                    key={idx}
                    className="recommended-topic-card"
                    onClick={() =>
                      navigate('/guided-learn', { state: { subject: topic.subject, topic: topic.topic } })
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span className="topic-number">{idx + 1}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)', flex: 1 }}>
                        {topic.subject}
                      </span>
                      {sourceLabel && (
                        <span className={`source-badge source-${topic.source || 'suggested'}`}>
                          {sourceLabel}
                        </span>
                      )}
                    </div>
                    <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '15px' }}>
                      {topic.topic}
                    </h3>
                    {topic.accuracy !== null && topic.accuracy !== undefined && topic.accuracy > 0 ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-color)',
                        }}
                      >
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Current Accuracy
                        </span>
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: topic.accuracy < 50 ? 'var(--error)' : 'var(--primary-yellow-dark)',
                          }}
                        >
                          {topic.accuracy.toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}
                      >
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Start learning this topic
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div
              style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
                marginTop: '16px',
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => navigate('/guided-learn')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <i className="fas fa-book-reader"></i> Start Learning
              </button>
            </div>
          </div>
        )}

        {/* ── Strengths & Weaknesses ── */}
        {((stats.strengths && stats.strengths.length > 0) ||
          (stats.weaknesses && stats.weaknesses.length > 0)) && (
          <div
            className="sw-row mt-3"
            style={{
              display: 'grid',
              gridTemplateColumns: hasBoth ? '1fr 1fr' : '1fr',
              gap: '16px',
            }}
          >
            {/* Strengths */}
            {stats.strengths && stats.strengths.length > 0 && (
              <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
                <div
                  className="card-header"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setStrengthsOpen((v) => !v)}
                >
                  <h2>
                    <i className="fas fa-star" style={{ color: 'var(--success)' }}></i> Your Strengths
                    <i
                      className="fas fa-chevron-down"
                      style={{
                        marginLeft: '8px',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        transform: strengthsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    ></i>
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Topics where you score ≥ 70%
                  </p>
                </div>
                {strengthsOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
                    {stats.strengths.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#f0fdf4',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '3px solid var(--success)',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{s.topic}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {s.subject} · {s.attempts} attempt{s.attempts !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: 'white',
                          }}
                        >
                          {Math.round(s.accuracy)}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Weaknesses */}
            {stats.weaknesses && stats.weaknesses.length > 0 && (
              <div className="card" style={{ borderTop: '4px solid var(--error)' }}>
                <div
                  className="card-header"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setWeaknessesOpen((v) => !v)}
                >
                  <h2>
                    <i className="fas fa-exclamation-triangle" style={{ color: 'var(--error)' }}></i>{' '}
                    Areas to Improve
                    <i
                      className="fas fa-chevron-down"
                      style={{
                        marginLeft: '8px',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        transform: weaknessesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    ></i>
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Topics scoring below 70% — click to study
                  </p>
                </div>
                {weaknessesOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
                    {stats.weaknesses.map((w, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#fff1f2',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '3px solid var(--error)',
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          navigate('/guided-learn', { state: { subject: w.subject, topic: w.topic } })
                        }
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{w.topic}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {w.subject} · {w.attempts} attempt{w.attempts !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              fontWeight: 700,
                              color: 'white',
                            }}
                          >
                            {Math.round(w.accuracy)}%
                          </div>
                          <i className="fas fa-chevron-right" style={{ color: 'var(--error)', fontSize: '12px' }}></i>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Recently Studied Topics ── */}
        {stats.recent_topics && stats.recent_topics.length > 0 && (
          <div className="card mt-3">
            <div className="card-header">
              <h2>
                <i className="fas fa-clock" style={{ color: 'var(--primary-yellow-dark)' }}></i>{' '}
                Recently Studied Topics
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '8px' }}>
              {stats.recent_topics.map((rt, i) => (
                <div
                  key={i}
                  onClick={() =>
                    navigate('/guided-learn', { state: { subject: rt.subject, topic: rt.topic } })
                  }
                  style={{
                    padding: '10px 16px',
                    background: 'var(--primary-yellow-light)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#FFD54F')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'var(--primary-yellow-light)')}
                >
                  <i className="fas fa-book-open" style={{ color: 'var(--primary-yellow-dark)', fontSize: '14px' }}></i>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{rt.topic}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{rt.subject}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Activity ── */}
        {stats.recent_attempts && stats.recent_attempts.length > 0 && (
          <div className="card mt-3">
            <div
              className="card-header"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <h2>
                <i className="fas fa-history"></i> Recent Activity
              </h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <option value="count-5">Last 5</option>
                  <option value="count-10">Last 10</option>
                  <option value="count-20">Last 20</option>
                  <option value="days-1">Today</option>
                  <option value="days-3">Last 3 Days</option>
                  <option value="days-7">Last 7 Days</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {filteredActivity.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '12px' }}>
                  No activity found for this period.
                </p>
              ) : (
                filteredActivity.map((attempt, idx) => {
                  const src = sourceConfig[attempt.practice_type] || {
                    label: attempt.practice_type || '—',
                    color: '#6B7280',
                    bg: '#F3F4F6',
                  }
                  return (
                    <div
                      key={idx}
                      className="activity-item"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '9px 14px',
                        borderBottom: '1px solid var(--border-color)',
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {attempt.is_correct === true && (
                          <i className="fas fa-check-circle" style={{ color: 'var(--success)', fontSize: '15px' }}></i>
                        )}
                        {attempt.is_correct === false && (
                          <i className="fas fa-times-circle" style={{ color: 'var(--error)', fontSize: '15px' }}></i>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {attempt.subject}
                            {attempt.topic ? ` — ${attempt.topic}` : ''}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: src.bg,
                            color: src.color,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {src.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          marginLeft: '8px',
                        }}
                      >
                        {formatDate(attempt.timestamp)}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* ── CBT History ── */}
        {stats.cbt_history && stats.cbt_history.length > 0 && (
          <div className="card mt-3">
            <div
              className="card-header"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <h2>
                <i className="fas fa-laptop"></i> CBT Exam History ({stats.cbt_history.length})
              </h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  value={cbtFilter}
                  onChange={(e) => setCbtFilter(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <option value="count-3">Last 3</option>
                  <option value="count-5">Last 5</option>
                  <option value="count-10">Last 10</option>
                  <option value="days-3">Last 3 Days</option>
                  <option value="days-7">Last 7 Days</option>
                  <option value="days-30">Last 30 Days</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredCbt.map((cbt, idx) => (
                <div
                  key={idx}
                  className="cbt-history-item"
                  style={{
                    padding: '12px 16px',
                    background: 'var(--bg-light)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--primary-yellow)',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong>{formatDate(cbt.date)}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Accuracy: {cbt.accuracy.toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-yellow-dark)' }}>
                      {cbt.score}/{cbt.total}
                    </span>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() =>
                        navigate('/cbt', { state: { mode: 'review', sessionId: cbt.session_id } })
                      }
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Year Practice History ── */}
        {stats.year_practice_history && stats.year_practice_history.length > 0 && (
          <div className="card mt-3">
            <div
              className="card-header"
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onClick={() => setYearPracticeOpen((v) => !v)}
            >
              <h2>
                <i className="fas fa-calendar-alt" style={{ color: '#1D4ED8' }}></i> Year Practice
                History ({stats.year_practice_history.length})
                <i
                  className="fas fa-chevron-down"
                  style={{
                    marginLeft: '8px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    transform: yearPracticeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                ></i>
              </h2>
              <div
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <option value="count-5">Last 5</option>
                  <option value="count-10">Last 10</option>
                  <option value="days-7">Last 7 Days</option>
                  <option value="days-30">Last 30 Days</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            {yearPracticeOpen && (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredYearPractice.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', padding: '12px' }}>
                    No records found for this period.
                  </p>
                ) : (
                  filteredYearPractice.map((yp, idx) => (
                    <div
                      key={idx}
                      className="yp-history-item"
                      style={{
                        padding: '12px 16px',
                        background: 'var(--bg-light)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '4px solid #1D4ED8',
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>
                          {yp.subject} — {yp.year}
                        </strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Accuracy:{' '}
                          {typeof yp.accuracy === 'number' ? yp.accuracy.toFixed(1) : yp.accuracy}%
                          &nbsp;·&nbsp; {formatDate(yp.completed_at || yp.date)}
                        </div>
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#1D4ED8' }}>
                        {yp.correct_answers}/{yp.total_questions}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Registered Subjects ── */}
        {stats.profile?.registered_subjects && stats.profile.registered_subjects.length > 0 && (
          <div className="card mt-3">
            <div className="card-header">
              <h2>
                <i className="fas fa-book"></i> Your Registered Subjects (
                {stats.profile.department || 'JAMB'})
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {stats.profile.registered_subjects.map((sub, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 20px',
                    background: 'var(--primary-yellow-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '24px',
                      height: '24px',
                      background: 'var(--primary-yellow)',
                      color: 'var(--white)',
                      borderRadius: '50%',
                      textAlign: 'center',
                      lineHeight: '24px',
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {sub.position}
                  </span>
                  {sub.subject}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
