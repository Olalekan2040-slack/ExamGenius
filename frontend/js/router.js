// Router - Handles navigation between screens

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = 'landing';
    }

    // Register a route
    register(name, handler) {
        this.routes[name] = handler;
    }

    // Navigate to a route
    async navigate(name, params = {}) {
        const handler = this.routes[name];

        if (!handler) {
            console.error(`Route '${name}' not found`);
            return;
        }

        // Check authentication for protected routes
        const protectedRoutes = ['dashboard', 'year-practice', 'cbt', 'profile', 'guided-learn', 'profile-setup', 'admin'];
        // Note: 'verify-email' and 'reset-password' are intentionally excluded from authRoutes
        // because they must be accessible even when logged in (token links from emails)
        const authRoutes = ['login', 'register'];

        if (protectedRoutes.includes(name) && !authManager.isAuthenticated()) {
            this.navigate('login');
            showToast('Please login to continue', 'warning');
            return;
        }

        if (authRoutes.includes(name) && authManager.isAuthenticated()) {
            this.navigate('dashboard');
            return;
        }

        // Hide all screens
        this.hideAllScreens();

        // Execute route handler
        this.currentRoute = name;
        await handler(params);

        // Update URL hash.
        // Important: only change the hash when the base route actually differs.
        // If we're already on e.g. #verify-email?token=abc, setting hash to
        // 'verify-email' would strip the token, fire hashchange, and re-run
        // the handler with no token — causing an "Invalid link" redirect loop.
        const currentHashBase = window.location.hash.slice(1).split('?')[0];
        if (currentHashBase !== name) {
            window.location.hash = name;
        }
        
        // Save current route to localStorage for refresh persistence
        localStorage.setItem('last_route', name);
        if (params && Object.keys(params).length > 0) {
            localStorage.setItem('last_route_params', JSON.stringify(params));
        } else {
            localStorage.removeItem('last_route_params');
        }
    }

    hideAllScreens() {
        document.getElementById('landing-page')?.classList.add('hidden');
        document.getElementById('auth-screens').innerHTML = '';
        document.getElementById('main-app').innerHTML = '';
        document.getElementById('main-app').classList.add('hidden');
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    // Get last saved route from localStorage
    getSavedRoute() {
        const savedRoute = localStorage.getItem('last_route');
        const savedParams = localStorage.getItem('last_route_params');
        
        if (savedRoute && this.routes[savedRoute]) {
            return {
                route: savedRoute,
                params: savedParams ? JSON.parse(savedParams) : {}
            };
        }
        
        return null;
    }
}

// Create singleton instance
const router = new Router();
window.router = router;

// Handle browser back/forward
window.addEventListener('hashchange', () => {
    const fullHash = window.location.hash.slice(1);
    // Support hashes like #verify-email?token=abc or #reset-password?token=xyz
    const [hashBase, hashSearch] = fullHash.split('?');
    if (hashBase && router.routes[hashBase]) {
        const hashParams = new URLSearchParams(hashSearch || '');
        const token = hashParams.get('token');
        router.navigate(hashBase, token ? { token } : {});
    }
});

// Register routes (will be set up in individual screen files)
router.register('landing', async () => {
    document.getElementById('landing-page').classList.remove('hidden');
});

router.register('login', async () => {
    await showLoginScreen();
});

router.register('register', async () => {
    await showRegisterScreen();
});

router.register('verify-email', async (params) => {
    await showVerifyEmailScreen(params.token);
});

router.register('reset-password', async (params) => {
    await showResetPasswordScreen(params.token);
});

router.register('dashboard', async () => {
    await showDashboard();
});

router.register('guided-learn', async (params) => {
    await showGuidedLearnScreen(params);
});

router.register('year-practice', async (params) => {
    await showYearPracticeScreen(params);
});

router.register('cbt', async (params) => {
    await showCBTScreen(params);
});

router.register('profile', async () => {
    await showProfileScreen();
});

router.register('profile-setup', async () => {
    await showProfileSetupScreen();
});

router.register('admin', async () => {
    await showAdminDashboard();
});
