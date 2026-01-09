// Authentication Manager

class AuthManager {
    constructor() {
        this.accessToken = null;
        this._refreshToken = localStorage.getItem('refresh_token');
        this.user = null;
    }

    // Set tokens after login
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this._refreshToken = refreshToken;
        localStorage.setItem('refresh_token', refreshToken);
    }

    // Get access token
    getAccessToken() {
        return this.accessToken;
    }

    // Get refresh token
    getRefreshToken() {
        return this._refreshToken;
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
        return !!this.accessToken && !!this._refreshToken;
    }

    // Refresh access token - renamed to avoid conflict with _refreshToken property
    async refreshToken() {
        if (!this._refreshToken) {
            return false;
        }

        try {
            const response = await api.refreshToken(this._refreshToken);
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
            if (this._refreshToken) {
                await api.logout(this._refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.accessToken = null;
            this._refreshToken = null;
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

    // Resend verification email
    async resendVerificationEmail(email) {
        try {
            const response = await api.resendVerificationEmail(email);
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
