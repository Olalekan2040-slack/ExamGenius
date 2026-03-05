// Utility Functions

// Show loading overlay
function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        const text = overlay.querySelector('p');
        if (text) text.textContent = message;
        overlay.classList.remove('hidden');
    }
}

// Hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format time
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Get user initials
function getUserInitials(name) {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password (min 8 chars, 1 uppercase, 1 number, 1 special)
function validatePassword(password) {
    if (password.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    return hasUppercase && hasNumber && hasSpecial;
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Toggle mobile menu
function toggleMobileMenu() {
    // Handle sidebar for logged-in app
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
        return;
    }

    // Handle landing page navigation
    const landingNav = document.querySelector('.landing-nav');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    if (landingNav) {
        // Create overlay if it doesn't exist
        if (!mobileOverlay) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-nav-overlay';
            overlay.innerHTML = `
                <div class="mobile-nav-content">
                    <button class="mobile-nav-close" onclick="utils.toggleMobileMenu()">
                        <i class="fas fa-times"></i>
                    </button>
                    <nav class="mobile-nav-menu">
                        <a href="#features" onclick="utils.toggleMobileMenu()">Features</a>
                        <a href="#about" onclick="utils.toggleMobileMenu()">About</a>
                        <button class="btn btn-outline btn-block" onclick="router.navigate('login'); utils.toggleMobileMenu();">Login</button>
                        <button class="btn btn-primary btn-block" onclick="router.navigate('register'); utils.toggleMobileMenu();">Get Started</button>
                    </nav>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const overlay = document.querySelector('.mobile-nav-overlay');
        overlay.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    }
}

// Calculate accuracy percentage
function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100 * 100) / 100;
}

// Add CSS animation for slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Format question text with proper HTML rendering:
 *  - English "underlined word" questions: auto-detect and underline the key word
 *  - Chemistry questions: fix superscripts that should be subscripts in formulas
 *  - All subjects: ensures HTML tags like <sub>,<sup>,<u>,<b>,<i> are rendered
 *
 * @param {string} text - Raw question or option text
 * @param {string} subject - Subject name (e.g. "English", "Chemistry")
 * @returns {string} HTML-safe formatted text
 */
function formatQuestionText(text, subject) {
    if (!text) return '';

    // ── Chemistry fix: <sup>digit(s)-without-sign</sup> → <sub>digit(s)</sub>
    // In chemical formulas, pure-digit superscripts are atom counts (subscripts).
    // Charges always include a sign: Fe³⁺ → Fe<sup>3+</sup>, so those are untouched.
    if (subject && subject.toLowerCase() === 'chemistry') {
        text = text.replace(/<sup>(\d+)<\/sup>/g, '<sub>$1</sub>');
    }

    // ── English underlined-word detection ───────────────────────────────────
    if (subject && subject.toLowerCase() === 'english' &&
        /underlined word/i.test(text)) {

        // Typical format: "[Instruction sentence]. [Sentence with key word.]"
        // Split on ". " to separate instruction from question sentence.
        const dotIdx = text.indexOf('. ');
        if (dotIdx !== -1 && dotIdx < text.length - 2) {
            const instruction = text.substring(0, dotIdx + 1);
            let sentence = text.substring(dotIdx + 2);

            // 1st: look for a word followed by " ." (trailing space before period)
            //      — a scraping artefact that marks the underlined word boundary
            const trailingMatch = sentence.match(/(\b[\w'-]+\b)\s\.\s*$/);
            if (trailingMatch) {
                const word = trailingMatch[1];
                // Replace last occurrence of "word ." with "<u>word</u>."
                sentence = sentence.replace(
                    new RegExp('(\\b' + escapeRegex(word) + '\\b)\\s\\.\\s*$'),
                    '<u>$1</u>.'
                );
            } else {
                // 2nd fallback: underline the last non-stopword in the sentence
                const STOPWORDS = new Set([
                    'a', 'an', 'the', 'of', 'to', 'in', 'by', 'for', 'from', 'at', 'on',
                    'with', 'and', 'or', 'but', 'that', 'this', 'these', 'those',
                    'it', 'its', 'his', 'her', 'their', 'our', 'my', 'your', 'he', 'she',
                    'is', 'was', 'were', 'are', 'be', 'been', 'has', 'had', 'have',
                    'do', 'did', 'does', 'will', 'would', 'could', 'should', 'may',
                    'might', 'can', 'shall', 'any', 'some', 'into', 'out', 'up',
                    'about', 'not', 'no', 'nor', 'as', 'if', 'when', 'while', 'then',
                    'there', 'here', 'just', 'very', 'so', 'such', 'more', 'most'
                ]);

                // Strip punctuation, split into words
                const words = sentence.replace(/[.!?]$/, '').split(/\s+/);
                // Walk backwards to find last non-stopword (min 4 chars to avoid short words)
                let targetWord = null;
                for (let i = words.length - 1; i >= 0; i--) {
                    const clean = words[i].replace(/[^a-zA-Z'-]/g, '');
                    if (clean.length >= 4 && !STOPWORDS.has(clean.toLowerCase())) {
                        targetWord = clean;
                        break;
                    }
                }

                if (targetWord) {
                    // Underline the LAST occurrence of this word in the sentence
                    const lastIdx = sentence.lastIndexOf(targetWord);
                    if (lastIdx !== -1) {
                        sentence = sentence.substring(0, lastIdx) +
                            '<u>' + targetWord + '</u>' +
                            sentence.substring(lastIdx + targetWord.length);
                    }
                }
            }

            text = instruction + ' ' + sentence;
        }
    }

    return text;
}

/** Escape special regex characters in a string */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Export utilities
window.utils = {
    showLoading,
    hideLoading,
    showToast,
    formatDate,
    formatTime,
    getUserInitials,
    validateEmail,
    validatePassword,
    shuffleArray,
    debounce,
    toggleMobileMenu,
    calculateAccuracy,
    formatQuestionText
};
