// Main Application Entry Point

/**
 * Decode a JWT payload without verifying the signature.
 * Returns null if the token is malformed.
 */
function decodeJwtPayload(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        // base64url → base64 → JSON
        const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(padded.padEnd(padded.length + (4 - padded.length % 4) % 4, '='));
        return JSON.parse(json);
    } catch (_) {
        return null;
    }
}

/**
 * Returns true if the JWT token is expired (or malformed / missing exp).
 * Adds a 30-second buffer so we don't use a token that's about to expire.
 */
function isJwtExpired(token) {
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.exp) return true;
    return (payload.exp - 30) < (Date.now() / 1000);
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('ExamGenius Frontend Loading...');

    // Check URL hash for routes
    const hash = window.location.hash.slice(1);

    // Handle email verification from link
    // The link format is /#verify-email?token=... so the token lives
    // inside the hash fragment, NOT in window.location.search.
    if (hash.startsWith('verify-email')) {
        const hashQuery = new URLSearchParams(hash.split('?')[1] || '');
        const token = hashQuery.get('token');
        if (token) {
            router.navigate('verify-email', { token });
            return;
        }
    }

    // Handle password reset from link (same pattern)
    if (hash.startsWith('reset-password')) {
        const hashQuery = new URLSearchParams(hash.split('?')[1] || '');
        const token = hashQuery.get('token');
        if (token) {
            router.navigate('reset-password', { token });
            return;
        }
    }

    // Check if user is authenticated
    const refreshToken = localStorage.getItem('refresh_token');

    // Skip network call entirely if the token is already expired
    if (refreshToken && isJwtExpired(refreshToken)) {
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('last_route');
        localStorage.removeItem('last_route_params');
        router.navigate('landing');
        return;
    }

    if (refreshToken) {
        // Try to refresh access token
        showLoading('Restoring session...');

        try {
            const response = await api.refreshToken(refreshToken);
            authManager.setTokens(response.access_token, refreshToken);

            // Load user data
            await authManager.loadUserData();

            hideLoading();

            // Check if profile is completed before navigating
            let profileCompleted = true;
            try {
                const profileCheck = await api.request('/profile/check-completion', { requireAuth: true });
                profileCompleted = !profileCheck.requires_completion;
            } catch (e) {
                console.log('Profile completion check failed:', e);
            }

            if (!profileCompleted) {
                router.navigate('profile-setup');
            } else if (hash && router.routes[hash]) {
                router.navigate(hash);
            } else {
                const savedRoute = router.getSavedRoute();
                if (savedRoute) {
                    router.navigate(savedRoute.route, savedRoute.params);
                } else {
                    router.navigate('dashboard');
                }
            }
        } catch (error) {
            hideLoading();
            console.log('Session restore failed:', error);
            // Clear invalid tokens
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            localStorage.removeItem('last_route');
            localStorage.removeItem('last_route_params');
            router.navigate('landing');
        }
    } else {
        // Not authenticated
        if (hash && router.routes[hash]) {
            router.navigate(hash);
        } else {
            // Check if there's a saved route (user might have been logged in before)
            const savedRoute = router.getSavedRoute();
            if (savedRoute) {
                // Clear saved route since user is not authenticated
                localStorage.removeItem('last_route');
                localStorage.removeItem('last_route_params');
            }
            router.navigate('landing');
        }
    }

    console.log('ExamGenius Frontend Ready!');
});

// Handle browser navigation
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash && router.routes[hash]) {
        router.navigate(hash);
    } else {
        router.navigate(authManager.isAuthenticated() ? 'dashboard' : 'landing');
    }
});

// Prevent accidental page refresh during exams
window.addEventListener('beforeunload', (event) => {
    if (router.currentRoute === 'cbt' || router.currentRoute === 'year-practice' || router.currentRoute === 'learn') {
        if (currentLearnState?.questions?.length > 0 || yearPracticeState?.questions?.length > 0 || cbtState?.questions?.length > 0) {
            event.preventDefault();
            event.returnValue = '';
            return '';
        }
    }
});

// Service Worker for offline support (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (event.error && event.error.message) {
        showToast('An error occurred: ' + event.error.message, 'error');
    }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (event.reason && event.reason.message) {
        showToast('An error occurred: ' + event.reason.message, 'error');
    }
});

console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║         ExamGenius Frontend           ║
║     JAMB CBT Preparation Platform     ║
║                                       ║
║         Version 1.0.0                 ║
║         © 2025 ExamGenius             ║
║                                       ║
╚═══════════════════════════════════════╝
`);
