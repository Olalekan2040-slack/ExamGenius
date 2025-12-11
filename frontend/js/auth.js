// Authentication Manager

class AuthManager {
    constructor() {
        this.accessToken = null;
        this.refreshToken = localStorage.getItem('refresh_token');
        this.user = null;
    }

    // Set tokens after login
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('refresh_token', refreshToken);
    }

    // Get access token
    getAccessToken() {
        return this.accessToken;
    }

    // Get refresh token
    getRefreshToken() {
        return this.refreshToken;
    }

    // Set user data
    setUser(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Get user data
    getUser() {
        if (!this.user) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser);
            }
        }
        return this.user;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.accessToken && !!this.refreshToken;
    }

    // Refresh access token
    async refreshToken() {
        if (!this.refreshToken) {
            return false;
        }

        try {
            const response = await api.refreshToken(this.refreshToken);
            this.accessToken = response.access_token;
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    // Login
    async login(email, password) {
        try {
            const response = await api.login(email, password);

            this.setTokens(response.access_token, response.refresh_token);
            this.setUser(response.user);

            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Register
    async register(name, email, password) {
        try {
            const response = await api.register(name, email, password);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Verify email
    async verifyEmail(token) {
        try {
            const response = await api.verifyEmail(token);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Logout
    async logout() {
        try {
            if (this.refreshToken) {
                await api.logout(this.refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.accessToken = null;
            this.refreshToken = null;
            this.user = null;
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            router.navigate('landing');
        }
    }

    // Request password reset
    async requestPasswordReset(email) {
        try {
            const response = await api.requestPasswordReset(email);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Reset password
    async resetPassword(token, newPassword) {
        try {
            const response = await api.resetPassword(token, newPassword);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Load current user data
    async loadUserData() {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            const response = await api.getCurrentUser();
            this.setUser(response.profile);
            return true;
        } catch (error) {
            console.error('Failed to load user data:', error);
            return false;
        }
    }
}

// Create singleton instance
const authManager = new AuthManager();
window.authManager = authManager;
