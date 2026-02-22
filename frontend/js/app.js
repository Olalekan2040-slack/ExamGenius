// Main Application Entry Point

// Initialize app on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('ExamGenius Frontend Loading...');

    // Check URL hash for routes
    const hash = window.location.hash.slice(1);

    // Handle email verification from link
    if (hash.startsWith('verify-email')) {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            router.navigate('verify-email', { token });
            return;
        }
    }

    // Handle password reset from link
    if (hash.startsWith('reset-password')) {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            router.navigate('reset-password', { token });
            return;
        }
    }

    // Check if user is authenticated
    const refreshToken = localStorage.getItem('refresh_token');

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
                // Navigate to appropriate screen
                // Priority: URL hash > saved route > dashboard
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
