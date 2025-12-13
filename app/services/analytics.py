"""
Analytics Service
Professional analysis module for calculating performance metrics, strengths, weaknesses, and insights
"""

from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta, date
import sqlite3
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
        Calculate detailed topic-level analysis
        Returns metrics, performance insights, and trends
        """
        if not attempt_results:
            return {}

        total = len(attempt_results)
        correct = sum(1 for r in attempt_results if r['is_correct'])
        accuracy = (correct / total * 100) if total > 0 else 0

        # Question difficulty analysis
        conn = get_connection()
        cursor = conn.cursor()

        difficulty_map = {}
        for result in attempt_results:
            cursor.execute("""
                SELECT q.year, q.number
                FROM questions q
                WHERE q.id = ?
            """, (result['question_id'],))
            
            q_row = cursor.fetchone()
            if q_row:
                year = q_row[0]
                # Older years = harder (assumption)
                difficulty = 'hard' if year <= 2014 else 'medium' if year <= 2018 else 'easy'
                difficulty_map[result['question_id']] = difficulty

        # Performance by difficulty
        difficulty_performance = defaultdict(lambda: {'correct': 0, 'total': 0})
        for result in attempt_results:
            difficulty = difficulty_map.get(result['question_id'], 'unknown')
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
            'completion_rate': round((total / total * 100), 2),
            'time_taken': datetime.utcnow().isoformat()
        }

    @staticmethod
    def identify_strengths_weaknesses(
        user_id: int,
        subject: Optional[str] = None
    ) -> Dict:
        """
        Analyze user's strengths and weaknesses across topics/subjects
        Returns top performing and struggling areas
        """
        conn = get_connection()
        cursor = conn.cursor()

        # Get all topic performance
        if subject:
            cursor.execute("""
                SELECT topic, accuracy, total_attempts, correct_attempts
                FROM user_stats
                WHERE user_id = ? AND subject = ?
                ORDER BY accuracy DESC
            """, (user_id, subject))
        else:
            cursor.execute("""
                SELECT topic, accuracy, total_attempts, correct_attempts
                FROM user_stats
                WHERE user_id = ?
                ORDER BY accuracy DESC
            """, (user_id,))

        stats = cursor.fetchall()
        if not stats:
            return {
                'strengths': [],
                'weaknesses': [],
                'average_accuracy': 0,
                'topics_covered': 0
            }

        # Calculate averages
        total_accuracy = sum(row[1] for row in stats) / len(stats) if stats else 0

        # Strengths: topics with accuracy >= (average + 10)
        threshold_high = total_accuracy + 10
        threshold_low = total_accuracy - 10

        strengths = []
        weaknesses = []

        for row in stats:
            topic, accuracy, total_attempts, correct = row
            if total_attempts < 2:  # Need at least 2 attempts
                continue

            analysis = {
                'topic': topic,
                'accuracy': round(accuracy, 2),
                'attempts': total_attempts,
                'correct': correct,
                'trend': AnalyticsService._calculate_trend(user_id, topic)
            }

            if accuracy >= threshold_high:
                strengths.append(analysis)
            elif accuracy <= threshold_low:
                weaknesses.append(analysis)

        # If no clear strengths/weaknesses, use top 3 and bottom 3
        if not strengths:
            strengths = [
                {
                    'topic': row[0],
                    'accuracy': round(row[1], 2),
                    'attempts': row[2],
                    'correct': row[3],
                    'trend': AnalyticsService._calculate_trend(user_id, row[0])
                }
                for row in stats[:3]
            ]

        if not weaknesses:
            weaknesses = [
                {
                    'topic': row[0],
                    'accuracy': round(row[1], 2),
                    'attempts': row[2],
                    'correct': row[3],
                    'trend': AnalyticsService._calculate_trend(user_id, row[0])
                }
                for row in stats[-3:] if row[1] < total_accuracy
            ]

        return {
            'strengths': strengths,
            'weaknesses': weaknesses,
            'average_accuracy': round(total_accuracy, 2),
            'topics_covered': len(stats),
            'summary': AnalyticsService._generate_summary(strengths, weaknesses, total_accuracy)
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

        # Ensure streak row exists to prevent null math later
        AnalyticsService._ensure_streak_row(cursor, user_id)
        conn.commit()

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
                   ROUND(CAST(SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100, 2) as accuracy,
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
            INSERT OR IGNORE INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
            VALUES (?, 0, 0, NULL, 0)
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

        # Calculate time taken
        try:
            start_time = datetime.fromisoformat(started)
            end_time = datetime.fromisoformat(completed)
            time_taken_mins = int((end_time - start_time).total_seconds() / 60)
        except:
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
