import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import secrets
import os

from app.core.config import settings

# Prefer settings (loads .env) with sensible fallbacks
SMTP_SERVER = settings.MAIL_SERVER or "smtp.gmail.com"
SMTP_PORT = settings.MAIL_PORT or 587
SENDER_EMAIL = settings.SENDER_EMAIL or settings.MAIL_USERNAME or os.getenv("SENDER_EMAIL") or os.getenv("MAIL_USERNAME") or ""
SENDER_PASSWORD = settings.SENDER_PASSWORD or settings.MAIL_PASSWORD or os.getenv("SENDER_PASSWORD") or os.getenv("MAIL_PASSWORD") or ""
# Strip any trailing slash so appended paths never produce double slashes
BASE_URL = settings.BASE_URL.rstrip("/")
PROJECT_NAME = "EduLab ExamPrep"
DEV_MODE = bool(settings.DEV_MODE)


def generate_verification_token() -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)


def send_verification_email(email: str, name: str, token: str) -> tuple[bool, str]:
    """Send email verification link to user. Returns (success, link)"""
    # Points to the FRONTEND hash route — no backend path involved
    verification_link = f"{BASE_URL}/#verify-email?token={token}"

    try:
        # In development mode, just log the link
        if DEV_MODE:
            print(f"\n{'='*60}")
            print(f"DEV MODE: Email would be sent to {email}")
            print(f"Name: {name}")
            print(f"Verification Link: {verification_link}")
            print(f"{'='*60}\n")
            return True, verification_link

        if not SENDER_EMAIL or not SENDER_PASSWORD:
            raise ValueError("SMTP credentials missing: set SENDER_EMAIL and SENDER_PASSWORD (or MAIL_USERNAME/MAIL_PASSWORD)")

        first_name = name.split()[0] if name else "there"
        subject = f"Verify your {PROJECT_NAME} account ✅"
        html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your EduLab ExamPrep account</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header / Brand banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:40px 48px 36px;text-align:center;">
              <div style="display:inline-block;background:linear-gradient(135deg,#FCD34D,#F59E0B);border-radius:14px;padding:12px 20px;margin-bottom:20px;">
                <span style="font-size:28px;font-weight:900;color:#1a1a2e;letter-spacing:-0.5px;">Exam<span style="color:#1a1a2e;">Genius</span></span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.3px;">One step away from greatness</h1>
              <p style="margin:10px 0 0;color:#94a3b8;font-size:15px;">Confirm your email to activate your account</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 48px 32px;">
              <p style="margin:0 0 12px;font-size:17px;color:#1e293b;font-weight:600;">Hi {first_name} 👋</p>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
                Welcome to <strong style="color:#1a1a2e;">EduLab ExamPrep</strong>! We're thrilled to have you on board.
                To start acing your JAMB exams, please verify your email address by clicking the button below.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="{verification_link}"
                       style="display:inline-block;background:linear-gradient(135deg,#FCD34D,#F59E0B);color:#1a1a2e;font-size:16px;font-weight:700;padding:16px 48px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(245,158,11,0.35);">
                      ✅ &nbsp;Verify My Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;" />

              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Button not working? Copy and paste this link into your browser:</p>
              <p style="margin:0 0 24px;font-size:12px;word-break:break-all;">
                <a href="{verification_link}" style="color:#F59E0B;text-decoration:underline;">{verification_link}</a>
              </p>

              <!-- Info box -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background:#fafafa;border:1px solid #e2e8f0;border-left:4px solid #F59E0B;border-radius:8px;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                      ⏰ &nbsp;This link expires in <strong style="color:#1e293b;">24 hours</strong>.<br/>
                      🔒 &nbsp;If you didn't create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Feature highlights -->
          <tr>
            <td style="padding:0 48px 36px;">
              <p style="margin:0 0 16px;font-size:14px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">What's waiting for you</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="33%" style="padding:0 6px 0 0;vertical-align:top;">
                    <div style="background:#f8fafc;border-radius:10px;padding:16px;text-align:center;">
                      <div style="font-size:24px;margin-bottom:8px;">📚</div>
                      <p style="margin:0;font-size:13px;font-weight:600;color:#1e293b;">Past Questions</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#64748b;">All JAMB subjects</p>
                    </div>
                  </td>
                  <td width="33%" style="padding:0 3px;vertical-align:top;">
                    <div style="background:#f8fafc;border-radius:10px;padding:16px;text-align:center;">
                      <div style="font-size:24px;margin-bottom:8px;">🎯</div>
                      <p style="margin:0;font-size:13px;font-weight:600;color:#1e293b;">Smart Practice</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#64748b;">AI-powered CBT</p>
                    </div>
                  </td>
                  <td width="33%" style="padding:0 0 0 6px;vertical-align:top;">
                    <div style="background:#f8fafc;border-radius:10px;padding:16px;text-align:center;">
                      <div style="font-size:24px;margin-bottom:8px;">📈</div>
                      <p style="margin:0;font-size:13px;font-weight:600;color:#1e293b;">Progress Tracking</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#64748b;">Detailed analytics</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 48px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">
                © {datetime.utcnow().year} EduLab ExamPrep · All rights reserved
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                This email was sent to <strong>{email}</strong> because an account was created with this address.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = email

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        print(f"[OK] Verification email sent to {email}")
        return True, verification_link
    except smtplib.SMTPAuthenticationError:
        print(f"[ERROR] SMTP Authentication failed: Check email/password")
        print(f"[FALLBACK] Verification link for {email}: {verification_link}")
        return False, verification_link
    except smtplib.SMTPException as e:
        print(f"[ERROR] SMTP error: {e}")
        print(f"[FALLBACK] Verification link for {email}: {verification_link}")
        return False, verification_link
    except Exception as e:
        print(f"[ERROR] Error sending verification email: {e}")
        print(f"[FALLBACK] Verification link for {email}: {verification_link}")
        return False, verification_link


def send_password_reset_email(email: str, name: str, token: str) -> tuple[bool, str]:
    """Send password reset link to user. Returns (success, link)"""
    # Points to the FRONTEND hash route — no backend path involved
    reset_link = f"{BASE_URL}/#reset-password?token={token}"

    try:
        # In development mode, just log the link
        if DEV_MODE:
            print(f"\n{'='*60}")
            print(f"DEV MODE: Password reset email would be sent to {email}")
            print(f"Name: {name}")
            print(f"Reset Link: {reset_link}")
            print(f"{'='*60}\n")
            return True, reset_link

        if not SENDER_EMAIL or not SENDER_PASSWORD:
            raise ValueError("SMTP credentials missing: set SENDER_EMAIL and SENDER_PASSWORD (or MAIL_USERNAME/MAIL_PASSWORD)")

        first_name = name.split()[0] if name else "there"
        subject = f"Reset your {PROJECT_NAME} password 🔐"
        html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your EduLab ExamPrep password</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header / Brand banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:40px 48px 36px;text-align:center;">
              <div style="display:inline-block;background:linear-gradient(135deg,#FCD34D,#F59E0B);border-radius:14px;padding:12px 20px;margin-bottom:20px;">
                <span style="font-size:28px;font-weight:900;color:#1a1a2e;letter-spacing:-0.5px;">Exam<span style="color:#1a1a2e;">Genius</span></span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.3px;">Password Reset Request</h1>
              <p style="margin:10px 0 0;color:#94a3b8;font-size:15px;">We received a request to reset your account password</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 48px 32px;">
              <p style="margin:0 0 12px;font-size:17px;color:#1e293b;font-weight:600;">Hi {first_name} 👋</p>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
                Someone (hopefully you!) requested a password reset for your <strong style="color:#1a1a2e;">EduLab ExamPrep</strong> account.
                Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="{reset_link}"
                       style="display:inline-block;background:linear-gradient(135deg,#ef4444,#dc2626);color:#ffffff;font-size:16px;font-weight:700;padding:16px 48px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(220,38,38,0.35);">
                      🔐 &nbsp;Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;" />

              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Button not working? Copy and paste this link into your browser:</p>
              <p style="margin:0 0 24px;font-size:12px;word-break:break-all;">
                <a href="{reset_link}" style="color:#F59E0B;text-decoration:underline;">{reset_link}</a>
              </p>

              <!-- Info box -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background:#fafafa;border:1px solid #e2e8f0;border-left:4px solid #ef4444;border-radius:8px;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                      ⏰ &nbsp;This link expires in <strong style="color:#1e293b;">1 hour</strong>.<br/>
                      🔒 &nbsp;If you did <strong>not</strong> request this reset, your account is safe — simply ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security tip -->
          <tr>
            <td style="padding:0 48px 36px;">
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 18px;">
                <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                  🛡️ <strong>Security tip:</strong> EduLab ExamPrep will never ask for your password via email or phone.
                  Always make sure you're on <strong>examgenius.mooo.com</strong> before entering your credentials.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 48px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">
                © {datetime.utcnow().year} EduLab ExamPrep · All rights reserved
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                This email was sent to <strong>{email}</strong> because a password reset was requested for this address.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = email

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        print(f"[OK] Password reset email sent to {email}")
        return True, reset_link
    except smtplib.SMTPAuthenticationError:
        print(f"[ERROR] SMTP Authentication failed: Check email/password")
        print(f"[FALLBACK] Password reset link for {email}: {reset_link}")
        return False, reset_link
    except smtplib.SMTPException as e:
        print(f"[ERROR] SMTP error: {e}")
        print(f"[FALLBACK] Password reset link for {email}: {reset_link}")
        return False, reset_link
    except Exception as e:
        print(f"[ERROR] Error sending password reset email: {e}")
        print(f"[FALLBACK] Password reset link for {email}: {reset_link}")
        return False, reset_link


def send_role_change_email(email: str, name: str, old_role: str, new_role: str) -> bool:
    """Notify a user that their account role has been changed by an admin."""
    role_labels = {
        "student":   ("🎓 Student",   "#3B82F6"),
        "moderator": ("🛡️ Moderator", "#8B5CF6"),
        "admin":     ("⚙️ Admin",     "#EF4444"),
    }
    old_label, _ = role_labels.get(old_role, (old_role.capitalize(), "#64748b"))
    new_label, new_color = role_labels.get(new_role, (new_role.capitalize(), "#64748b"))
    first_name = name.split()[0] if name else "there"

    if DEV_MODE:
        print(f"\nDEV MODE: Role change email to {email}: {old_role} → {new_role}")
        return True

    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("[WARN] SMTP credentials missing — role change email skipped")
        return False

    subject = f"Your EduLab ExamPrep account role has been updated"
    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:40px 48px;text-align:center;">
            <div style="display:inline-block;background:linear-gradient(135deg,#FCD34D,#F59E0B);border-radius:14px;padding:10px 18px;margin-bottom:16px;">
              <span style="font-size:22px;font-weight:900;color:#1a1a2e;">EduLab ExamPrep</span>
            </div>
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Account Role Updated</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0 0 16px;font-size:16px;color:#1e293b;">Hi <strong>{first_name}</strong> 👋</p>
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
              Your <strong>EduLab ExamPrep</strong> account role has been updated by an administrator.
            </p>
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
              <tr>
                <td style="background:#f8fafc;border-radius:10px;padding:20px;text-align:center;">
                  <p style="margin:0 0 10px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Role Change</p>
                  <div style="display:inline-flex;align-items:center;gap:12px;font-size:18px;font-weight:700;">
                    <span style="color:#94a3b8;">{old_label}</span>
                    <span style="color:#64748b;font-size:20px;">→</span>
                    <span style="color:{new_color};">{new_label}</span>
                  </div>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:14px;color:#64748b;line-height:1.6;">
              If you believe this is a mistake, please contact support or log in to verify your account status.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 48px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">© {datetime.utcnow().year} EduLab ExamPrep · This email was sent to <strong>{email}</strong></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = email
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
        print(f"[OK] Role change email sent to {email}")
        return True
    except Exception as e:
        print(f"[ERROR] Role change email failed for {email}: {e}")
        return False


def send_ban_notification_email(email: str, name: str, banned: bool, reason: str = None) -> bool:
    """Notify a user that their account has been banned or unbanned."""
    first_name = name.split()[0] if name else "there"
    action_word = "Suspended" if banned else "Reinstated"
    action_color = "#EF4444" if banned else "#10B981"
    icon = "🚫" if banned else "✅"

    if DEV_MODE:
        print(f"\nDEV MODE: Ban notification to {email}: banned={banned}, reason={reason}")
        return True

    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("[WARN] SMTP credentials missing — ban notification email skipped")
        return False

    subject = f"Your EduLab ExamPrep account has been {action_word.lower()}"
    reason_block = f"""
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
              <tr>
                <td style="background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #ef4444;border-radius:8px;padding:14px 18px;">
                  <p style="margin:0;font-size:13px;color:#991b1b;"><strong>Reason:</strong> {reason}</p>
                </td>
              </tr>
            </table>""" if banned and reason else ""

    reinstate_note = """<p style="margin:0 0 16px;font-size:14px;color:#10B981;font-weight:600;">
              🎉 Your account has been reinstated. You can now log in and continue using EduLab ExamPrep.
            </p>""" if not banned else ""

    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:40px 48px;text-align:center;">
            <div style="display:inline-block;background:linear-gradient(135deg,#FCD34D,#F59E0B);border-radius:14px;padding:10px 18px;margin-bottom:16px;">
              <span style="font-size:22px;font-weight:900;color:#1a1a2e;">EduLab ExamPrep</span>
            </div>
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">{icon} Account {action_word}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0 0 16px;font-size:16px;color:#1e293b;">Hi <strong>{first_name}</strong>,</p>
            {reinstate_note}
            <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.7;">
              {'Your <strong>EduLab ExamPrep</strong> account has been <strong style="color:' + action_color + ';">temporarily suspended</strong> by an administrator.' if banned else 'Good news — your <strong>EduLab ExamPrep</strong> account has been <strong style="color:' + action_color + ';">reinstated</strong>.'}
            </p>
            {reason_block}
            <p style="margin:0;font-size:13px;color:#64748b;">
              If you have questions, please contact our support team by replying to this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 48px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">© {datetime.utcnow().year} EduLab ExamPrep · This email was sent to <strong>{email}</strong></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = email
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
        print(f"[OK] Ban notification email sent to {email}")
        return True
    except Exception as e:
        print(f"[ERROR] Ban notification email failed for {email}: {e}")
        return False
