"""
Analytics Service
Professional analysis module for calculating performance metrics, strengths, weaknesses, and insights
"""

from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta, date
from collections import defaultdict
from app.db.database import get_connection


class AnalyticsService:
    """World-class analytics engine for exam performance analysis"""

    @staticmethod
    def calculate_topic_analysis(
        user_id: int,
        subject: str,
        topic: str,
        attempt_results: List[Dict]
    ) -> Dict:
        """
        Calculate detailed topic-level analysis.
        Uses a single bulk query instead of N individual queries.
        """
        if not attempt_results:
            return {}

        total = len(attempt_results)
        correct = sum(1 for r in attempt_results if r['is_correct'])
        accuracy = (correct / total * 100) if total > 0 else 0

        # ── Single bulk query for all question years ───────────────────────
        conn = get_connection()
        cursor = conn.cursor()
        qids = [r['question_id'] for r in attempt_results]
        placeholders = ",".join(["?" for _ in qids])
        cursor.execute(f"""
            SELECT id, year FROM questions WHERE id IN ({placeholders})
        """, qids)
        year_map = {row[0]: row[1] for row in cursor.fetchall()}

        difficulty_performance = defaultdict(lambda: {'correct': 0, 'total': 0})
        for result in attempt_results:
            year = year_map.get(result['question_id'])
            if year:
                difficulty = 'hard' if year <= 2014 else 'medium' if year <= 2018 else 'easy'
            else:
                difficulty = 'unknown'
            difficulty_performance[difficulty]['total'] += 1
            if result['is_correct']:
                difficulty_performance[difficulty]['correct'] += 1

        difficulty_metrics = {}
        for diff, stats in difficulty_performance.items():
            difficulty_metrics[diff] = {
                'correct': stats['correct'],
                'total': stats['total'],
                'accuracy': round((stats['correct'] / stats['total'] * 100), 2) if stats['total'] > 0 else 0
            }

        return {
            'total_questions': total,
            'correct_answers': correct,
            'accuracy': round(accuracy, 2),
            'difficulty_breakdown': difficulty_metrics,
            'completion_rate': 100.0,
            'time_taken': datetime.utcnow().isoformat()
        }

    @staticmethod
    def identify_strengths_weaknesses(
        user_id: int,
        subject: Optional[str] = None
    ) -> Dict:
        """
        Analyse strengths and weaknesses using practice_attempts directly.
        Uses a single aggregation query — no N+1 per-topic queries.
        """
        conn = get_connection()
        cursor = conn.cursor()

        params: list = [user_id]
        subject_clause = ""
        if subject:
            subject_clause = " AND subject = ?"
            params.append(subject)

        # ── Single aggregation query ──────────────────────────────────────
        cursor.execute(f"""
            SELECT topic, subject,
                   COUNT(*) AS attempts,
                   SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS correct
            FROM practice_attempts
            WHERE user_id = ?{subject_clause}
              AND topic IS NOT NULL AND topic != ''
            GROUP BY topic, subject
            HAVING COUNT(*) >= 3
            ORDER BY
                (CAST(SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS FLOAT)
                 / NULLIF(COUNT(*), 0)) DESC
        """, params)

        rows = cursor.fetchall()
        if not rows:
            return {
                'strengths': [],
                'weaknesses': [],
                'average_accuracy': 0,
                'topics_covered': 0,
                'summary': 'Practice more questions to see your strengths and weaknesses.'
            }

        # ── Batch trend calculation — one query for all topics ────────────
        topics = [r[0] for r in rows]
        topic_ph = ",".join(["?" for _ in topics])
        trend_params = [user_id] + topics
        cursor.execute(f"""
            SELECT topic,
                   is_correct,
                   ROW_NUMBER() OVER (PARTITION BY topic ORDER BY created_at DESC) AS rn
            FROM practice_attempts
            WHERE user_id = ? AND topic IN ({topic_ph})
        """, trend_params)
        trend_rows_all = cursor.fetchall()

        # Build trend map: topic → list of recent is_correct (up to 5)
        trend_recent: dict = {}
        for topic_, is_correct_, rn_ in trend_rows_all:
            if rn_ <= 5:
                trend_recent.setdefault(topic_, []).append(is_correct_)

        def _trend_from_list(recent: list) -> str:
            if len(recent) < 2:
                return 'stable'
            recent_avg = sum(recent[:3]) / max(len(recent[:3]), 1)
            older = recent[3:]
            older_avg = sum(older) / len(older) if older else recent_avg
            if recent_avg > older_avg + 0.2:
                return 'improving'
            elif recent_avg < older_avg - 0.2:
                return 'declining'
            return 'stable'
        # ─────────────────────────────────────────────────────────────────

        total_accuracy = sum(
            (r[3] / r[2] * 100) for r in rows if r[2] > 0
        ) / len(rows)

        strengths: list = []
        weaknesses: list = []

        for topic, subj, attempts, correct in rows:
            accuracy = round(correct / attempts * 100, 2) if attempts > 0 else 0
            entry = {
                'topic': topic,
                'subject': subj,
                'accuracy': accuracy,
                'attempts': attempts,
                'correct': correct,
                'trend': _trend_from_list(trend_recent.get(topic, []))
            }
            if accuracy >= 70 and attempts >= 5:
                strengths.append(entry)
            elif accuracy < 60:
                weaknesses.append(entry)

        strengths.sort(key=lambda x: x['accuracy'], reverse=True)
        weaknesses.sort(key=lambda x: x['accuracy'])

        return {
            'strengths': strengths[:8],
            'weaknesses': weaknesses[:8],
            'average_accuracy': round(total_accuracy, 2),
            'topics_covered': len(rows),
            'summary': AnalyticsService._generate_summary(strengths[:8], weaknesses[:8], total_accuracy)
        }

    @staticmethod
    def _calculate_trend(user_id: int, topic: str) -> str:
        """
        Calculate performance trend: improving, declining, stable
        """
        conn = get_connection()
        cursor = conn.cursor()

        # Get recent 5 attempts
        cursor.execute("""
            SELECT is_correct
            FROM practice_attempts
            WHERE user_id = ? AND topic = ?
            ORDER BY created_at DESC
            LIMIT 5
        """, (user_id, topic))

        recent = [row[0] for row in cursor.fetchall()]

        if len(recent) < 2:
            return 'stable'

        recent_avg = sum(recent[:3]) / 3 if len(recent) >= 3 else sum(recent) / len(recent)
        older_avg = sum(recent[3:]) / len(recent[3:]) if len(recent) > 3 else sum(recent) / len(recent)

        if recent_avg > older_avg + 0.2:
            return 'improving'
        elif recent_avg < older_avg - 0.2:
            return 'declining'
        else:
            return 'stable'

    @staticmethod
    def get_comprehensive_dashboard_stats(user_id: int) -> Dict:
        """
        Get all dashboard analytics: overall stats, trends, recent attempts, streaks
        """
        conn = get_connection()
        cursor = conn.cursor()

        # If a previous statement aborted the transaction, clear it first
        try:
            conn.rollback()
        except Exception:
            pass

        try:
            # Ensure streak row exists to prevent null math later
            AnalyticsService._ensure_streak_row(cursor, user_id)
            conn.commit()
        except Exception:
            conn.rollback()
            raise

        # Overall stats
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
            FROM practice_attempts
            WHERE user_id = ?
        """, (user_id,))

        overall = cursor.fetchone()
        total_attempts = overall[0] if overall[0] else 0
        total_correct = overall[1] if overall[1] else 0
        overall_accuracy = (total_correct / total_attempts * 100) if total_attempts > 0 else 0

        # Subject performance
        cursor.execute("""
            SELECT subject, COUNT(*) as total, SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
            FROM practice_attempts
            WHERE user_id = ?
            GROUP BY subject
            ORDER BY (CAST(SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*)) DESC
        """, (user_id,))

        subject_stats = []
        for row in cursor.fetchall():
            subject, total, correct = row
            accuracy = (correct / total * 100) if total > 0 else 0
            subject_stats.append({
                'subject': subject,
                'attempts': total,
                'correct': correct,
                'accuracy': round(accuracy, 2)
            })

        # Streak info
        cursor.execute("""
            SELECT current_streak, longest_streak, total_active_days
            FROM user_streaks
            WHERE user_id = ?
        """, (user_id,))

        streak = cursor.fetchone()
        current_streak = streak[0] if streak else 0
        longest_streak = streak[1] if streak else 0
        active_days = streak[2] if streak else 0

        # Recent practice
        cursor.execute("""
            SELECT topic, subject, COUNT(*) as attempts, 
                   ROUND((SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0)::numeric) * 100, 2) as accuracy,
                   MAX(created_at) as last_attempt
            FROM practice_attempts
            WHERE user_id = ?
            GROUP BY topic, subject
            ORDER BY last_attempt DESC
            LIMIT 10
        """, (user_id,))

        recent_practice = []
        for row in cursor.fetchall():
            topic, subject, attempts, accuracy, last_attempt = row
            recent_practice.append({
                'topic': topic,
                'subject': subject,
                'attempts': attempts,
                'accuracy': accuracy or 0,
                'last_attempted': last_attempt
            })

        # Time series (last 7 days)
        start_date = (datetime.utcnow().date() - timedelta(days=6)).isoformat()
        end_date = datetime.utcnow().date().isoformat()
        cursor.execute("""
            SELECT DATE(created_at) as day, COUNT(*) as total, 
                   SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
            FROM practice_attempts
            WHERE user_id = ? AND DATE(created_at) BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            ORDER BY day
        """, (user_id, start_date, end_date))

        day_map = {row[0]: {'total': row[1], 'correct': row[2]} for row in cursor.fetchall()}
        daily_stats = []
        for offset in range(7):
            day_obj = datetime.utcnow().date() - timedelta(days=6 - offset)
            day_key = day_obj.isoformat()
            totals = day_map.get(day_key, {'total': 0, 'correct': 0})
            total = totals['total'] or 0
            correct = totals['correct'] or 0
            daily_stats.append({
                'date': day_key,
                'total': total,
                'correct': correct,
                'accuracy': round((correct / total * 100), 2) if total > 0 else 0
            })

        return {
            'overall': {
                'total_attempts': total_attempts,
                'correct_answers': total_correct,
                'accuracy': round(overall_accuracy, 2)
            },
            'by_subject': subject_stats,
            'streaks': {
                'current': current_streak,
                'longest': longest_streak,
                'total_active_days': active_days
            },
            'recent_practice': recent_practice,
            'weekly_trend': daily_stats,
            'strengths_weaknesses': AnalyticsService.identify_strengths_weaknesses(user_id)
        }

    @staticmethod
    def update_user_streak(cursor, user_id: int, activity_date: Optional[date] = None) -> None:
        """Update streak counters safely for a user."""
        today = (activity_date or datetime.utcnow().date()).isoformat()
        yesterday = (activity_date or datetime.utcnow().date()) - timedelta(days=1)
        yesterday_iso = yesterday.isoformat()

        cursor.execute("""
            SELECT current_streak, longest_streak, last_activity_date, total_active_days
            FROM user_streaks
            WHERE user_id = ?
        """, (user_id,))
        row = cursor.fetchone()

        if not row:
            cursor.execute("""
                INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
                VALUES (?, 1, 1, ?, 1)
            """, (user_id, today))
            return

        current_streak, longest_streak, last_activity_date, total_active_days = row

        if last_activity_date == today:
            return

        if last_activity_date == yesterday_iso:
            current_streak = (current_streak or 0) + 1
        else:
            current_streak = 1

        longest_streak = max(longest_streak or 0, current_streak)
        total_active_days = (total_active_days or 0) + 1

        cursor.execute("""
            UPDATE user_streaks
            SET current_streak = ?,
                longest_streak = ?,
                last_activity_date = ?,
                total_active_days = ?
            WHERE user_id = ?
        """, (current_streak, longest_streak, today, total_active_days, user_id))

    @staticmethod
    def _ensure_streak_row(cursor, user_id: int) -> None:
        cursor.execute("""
            INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
            VALUES (?, 0, 0, NULL, 0)
            ON CONFLICT(user_id) DO NOTHING
        """, (user_id,))

    @staticmethod
    def _generate_summary(strengths: List[Dict], weaknesses: List[Dict], avg_accuracy: float) -> str:
        """Generate insight summary text"""
        if not strengths and not weaknesses:
            return "Start practicing more questions to see insights"

        summary = []
        if strengths:
            top_strength = strengths[0]['topic']
            summary.append(f"🌟 Strong in {top_strength}")

        if weaknesses:
            main_weakness = weaknesses[0]['topic']
            summary.append(f"⚠️ Focus on {main_weakness}")

        if avg_accuracy >= 80:
            summary.append("Excellent progress!")
        elif avg_accuracy >= 60:
            summary.append("Good effort, keep practicing!")
        else:
            summary.append("More practice needed")

        return " • ".join(summary)

    @staticmethod
    def get_cbt_analysis(session_id: str) -> Dict:
        """Analyze CBT exam session results"""
        conn = get_connection()
        cursor = conn.cursor()

        # Get session info
        cursor.execute("""
            SELECT total_questions, score, started_at, completed_at
            FROM exam_sessions
            WHERE id = ?
        """, (session_id,))

        session = cursor.fetchone()
        if not session:
            return {}

        total_q, score, started, completed = session

        # Calculate time taken (Postgres may return datetime objects)
        try:
            start_time = datetime.fromisoformat(started) if isinstance(started, str) else started
            end_time = datetime.fromisoformat(completed) if isinstance(completed, str) else completed
            if start_time and end_time:
                time_taken_mins = int((end_time - start_time).total_seconds() / 60)
            else:
                time_taken_mins = 0
        except Exception:
            time_taken_mins = 0

        # Subject breakdown
        cursor.execute("""
            SELECT subject, COUNT(*) as total, SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
            FROM session_questions
            WHERE session_id = ?
            GROUP BY subject
        """, (session_id,))

        subject_breakdown = []
        for row in cursor.fetchall():
            subject, total, correct = row
            accuracy = (correct / total * 100) if total > 0 else 0
            subject_breakdown.append({
                'subject': subject,
                'total': total,
                'correct': correct,
                'accuracy': round(accuracy, 2)
            })

        return {
            'total_questions': total_q,
            'score': score,
            'accuracy': round((score / total_q * 100), 2) if total_q > 0 else 0,
            'time_taken_minutes': time_taken_mins,
            'by_subject': subject_breakdown
        }
