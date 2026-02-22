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
    calculateAccuracy
};
