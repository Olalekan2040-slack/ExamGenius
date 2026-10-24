import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingOverlay from '../components/LoadingOverlay'
import { useToast } from '../contexts/ToastContext'
import { getLearningAnalytics } from '../api'

function getScoreColor(score) {
  if (score >= 90) return '#10B981'
  if (score >= 75) return '#3B82F6'
  if (score >= 60) return '#F59E0B'
  if (score >= 40) return '#EF4444'
  return '#DC2626'
}

export default function Analytics() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    loadAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadAnalytics() {
    setLoading(true)
    try {
      const data = await getLearningAnalytics()
      setAnalytics(data)
    } catch (err) {
      addToast('Failed to load analytics: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingOverlay message="Loading analytics..." />

  if (!analytics) return null

  const overall = analytics.overall || { total_attempts: 0, correct_answers: 0, accuracy: 0 }
  const bySubject = analytics.by_subject || []
  const streaks = analytics.streaks || { current: 0, longest: 0, total_active_days: 0 }
  const recent = analytics.recent_practice || []
  const weekly = analytics.weekly_trend || []
  const sw = analytics.strengths_weaknesses || {}

  return (
    <Layout>
      <div className="analytics-dashboard" style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h1 style={{ margin: 0 }}>
              <i className="fas fa-chart-bar"></i> Performance Analytics
            </h1>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/dashboard')}
              style={{ padding: '8px 16px' }}
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Comprehensive insights into your learning journey
          </p>
        </div>

        {/* ── Overall Performance ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(var(--primary-yellow-rgb, 255,193,7),0.12), rgba(var(--success-rgb, 34,197,94),0.12))',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            marginBottom: '32px',
            border: '2px solid var(--border-color)',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '24px' }}>
            <i className="fas fa-trophy"></i> Overall Performance
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'var(--primary-yellow-dark)',
                  marginBottom: '8px',
                }}
              >
                {overall.accuracy?.toFixed(1) || 0}%
              </div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Overall Accuracy</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'var(--success)',
                  marginBottom: '8px',
                }}
              >
                {overall.correct_answers || 0}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Correct Answers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'var(--info)',
                  marginBottom: '8px',
                }}
              >
                {overall.total_attempts || 0}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total Attempts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'var(--error)',
                  marginBottom: '8px',
                }}
              >
                {(overall.total_attempts - overall.correct_answers) || 0}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Need Review</div>
            </div>
          </div>
        </div>

        {/* ── Streaks & Weekly Activity ── */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}
        >
          {/* Streaks */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-fire" style={{ color: 'var(--error)' }}></i> Learning Streaks
              </h3>
            </div>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 700,
                  color: 'var(--error)',
                  marginBottom: '8px',
                }}
              >
                🔥 {streaks.current}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Current streak days
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'var(--bg-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                }}
              >
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>
                  Longest Streak
                </div>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{streaks.longest} days</div>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'var(--bg-light)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>
                  Total Active Days
                </div>
                <div style={{ fontWeight: 700, color: 'var(--success)' }}>
                  {streaks.total_active_days} days
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-calendar-alt" style={{ color: 'var(--info)' }}></i> Weekly
                Activity
              </h3>
            </div>
            <div style={{ padding: '20px' }}>
              {weekly && weekly.length > 0 ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '8px',
                      height: '150px',
                      padding: '20px 0',
                    }}
                  >
                    {weekly.slice(-7).map((day, i) => {
                      const maxAccuracy = Math.max(...weekly.map((w) => w.accuracy || 0), 100)
                      const height = (day.accuracy / maxAccuracy) * 100
                      return (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <div
                            title={`${day.accuracy.toFixed(1)}%`}
                            style={{
                              width: '100%',
                              height: `${height}%`,
                              background: 'linear-gradient(180deg, var(--success), rgba(var(--success-rgb, 34,197,94),0.5))',
                              borderRadius: '4px 4px 0 0',
                              transition: 'all 0.3s',
                            }}
                          ></div>
                          <small style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </small>
                        </div>
                      )
                    })}
                  </div>
                  <small
                    style={{
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    Last 7 days activity
                  </small>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                  <i
                    className="fas fa-inbox"
                    style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}
                  ></i>
                  <p>No activity in the last 7 days</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Performance by Subject ── */}
        {bySubject && bySubject.length > 0 && (
          <div className="card" style={{ marginBottom: '32px' }}>
            <div className="card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-book"></i> Performance by Subject
              </h3>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                {bySubject.map((subject, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-light)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `4px solid ${getScoreColor(subject.accuracy)}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '16px' }}>{subject.subject}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {subject.attempts} attempts • {subject.correct} correct
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            color: getScoreColor(subject.accuracy),
                          }}
                        >
                          {subject.accuracy?.toFixed(1) || 0}%
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'white',
                        height: '8px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${subject.accuracy || 0}%`,
                          background: getScoreColor(subject.accuracy),
                          transition: 'width 0.3s',
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Strengths & Weaknesses ── */}
        {sw && (sw.strengths || sw.weaknesses) && (
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}
          >
            {/* Strengths */}
            {sw.strengths && sw.strengths.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 style={{ margin: 0 }}>
                    <i className="fas fa-star" style={{ color: 'var(--success)' }}></i> Your Strengths
                  </h3>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Topics where you excel
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sw.strengths.slice(0, 5).map((strength, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          background: 'rgba(232,245,233,0.12)',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '3px solid var(--success)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                              {idx + 1}. {strength.topic}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                marginBottom: '4px',
                              }}
                            >
                              {strength.subject || ''}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {strength.attempts} attempts &bull; Trend: {strength.trend}
                            </div>
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--success)' }}>
                            {strength.accuracy}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Weaknesses / Focus Areas */}
            {sw.weaknesses && sw.weaknesses.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 style={{ margin: 0 }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: 'var(--error)' }}></i>{' '}
                    Focus Areas
                  </h3>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Topics needing more practice
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sw.weaknesses.slice(0, 5).map((weakness, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          background: 'rgba(255,235,238,0.12)',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '3px solid var(--error)',
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          navigate('/guided-learn', {
                            state: { subject: weakness.subject, topic: weakness.topic },
                          })
                        }
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                              {idx + 1}. {weakness.topic}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                marginBottom: '4px',
                              }}
                            >
                              {weakness.subject || ''}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {weakness.attempts} attempts &bull; Trend: {weakness.trend} &bull;{' '}
                              <span style={{ color: 'var(--primary)' }}>Click to study</span>
                            </div>
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--error)' }}>
                            {weakness.accuracy}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Insights ── */}
        {sw.summary && (
          <div
            className="card"
            style={{
              background:
                'linear-gradient(135deg, rgba(var(--primary-yellow-rgb,255,193,7),0.08), rgba(var(--success-rgb,34,197,94),0.08))',
            }}
          >
            <div className="card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-lightbulb"></i> Insights
              </h3>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {sw.summary}
              </p>
            </div>
          </div>
        )}

        {/* ── Recent Topics Practiced ── */}
        {recent && recent.length > 0 && (
          <div className="card" style={{ marginTop: '32px' }}>
            <div className="card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-history"></i> Recent Topics Practiced
              </h3>
            </div>
            <div style={{ padding: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '12px',
                }}
              >
                {recent.slice(0, 8).map((topic, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-light)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `3px solid ${getScoreColor(topic.accuracy)}`,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '6px' }}>{topic.subject}</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>{topic.topic}</div>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {topic.attempts} attempts
                      </span>
                      <span
                        style={{ fontWeight: 700, color: getScoreColor(topic.accuracy) }}
                      >
                        {topic.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div
          style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}
        >
          <button
            className="btn btn-primary"
            onClick={() => navigate('/guided-learn')}
            style={{ flex: 1, minWidth: '150px' }}
          >
            <i className="fas fa-book-reader"></i> Continue Learning
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/year-practice')}
            style={{ flex: 1, minWidth: '150px' }}
          >
            <i className="fas fa-calendar-alt"></i> Year Practice
          </button>
          <button
            className="btn btn-outline"
            onClick={() => window.print()}
            style={{ flex: 1, minWidth: '150px' }}
          >
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>
    </Layout>
  )
}
