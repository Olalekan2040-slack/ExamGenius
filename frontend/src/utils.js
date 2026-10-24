// Utility functions (pure — no DOM dependency)

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export function getUserInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  if (password.length < 8) return false;
  return /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password);
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function calculateAccuracy(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 10000) / 100;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatQuestionText(text, subject) {
  if (!text) return '';

  if (subject && subject.toLowerCase() === 'chemistry') {
    text = text.replace(/<sup>(\d+)<\/sup>/g, '<sub>$1</sub>');
  }

  if (subject && subject.toLowerCase() === 'english' && /underlined word/i.test(text)) {
    const dotIdx = text.indexOf('. ');
    if (dotIdx !== -1 && dotIdx < text.length - 2) {
      const instruction = text.substring(0, dotIdx + 1);
      let sentence = text.substring(dotIdx + 2);

      const trailingMatch = sentence.match(/(\b[\w'-]+\b)\s\.\s*$/);
      if (trailingMatch) {
        const word = trailingMatch[1];
        sentence = sentence.replace(
          new RegExp('(\\b' + escapeRegex(word) + '\\b)\\s\\.\\s*$'),
          '<u>$1</u>.'
        );
      } else {
        const STOPWORDS = new Set([
          'a','an','the','of','to','in','by','for','from','at','on','with','and','or','but',
          'that','this','these','those','it','its','his','her','their','our','my','your',
          'he','she','is','was','were','are','be','been','has','had','have','do','did',
          'does','will','would','could','should','may','might','can','shall','any','some',
          'into','out','up','about','not','no','nor','as','if','when','while','then',
          'there','here','just','very','so','such','more','most',
        ]);
        const words = sentence.replace(/[.!?]$/, '').split(/\s+/);
        let targetWord = null;
        for (let i = words.length - 1; i >= 0; i--) {
          const clean = words[i].replace(/[^a-zA-Z'-]/g, '');
          if (clean.length >= 4 && !STOPWORDS.has(clean.toLowerCase())) {
            targetWord = clean;
            break;
          }
        }
        if (targetWord) {
          const lastIdx = sentence.lastIndexOf(targetWord);
          if (lastIdx !== -1) {
            sentence =
              sentence.substring(0, lastIdx) + '<u>' + targetWord + '</u>' + sentence.substring(lastIdx + targetWord.length);
          }
        }
      }
      text = instruction + ' ' + sentence;
    }
  }

  return text;
}

export function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(padded.padEnd(padded.length + (4 - padded.length % 4) % 4, '='));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isJwtExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return payload.exp - 30 < Date.now() / 1000;
}
