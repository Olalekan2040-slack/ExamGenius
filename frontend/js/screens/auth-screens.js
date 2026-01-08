// Authentication Screens

// Show Login Screen
async function showLoginScreen() {
    const container = document.getElementById('auth-screens');
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <div class="logo mb-3" onclick="router.navigate('landing')" style="cursor: pointer;">
                        <i class="fas fa-graduation-cap"></i>
                        <span>ExamGenius</span>
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue your JAMB preparation</p>
                </div>
                
                <form id="login-form" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required placeholder="you@example.com">
                        <span class="error-message" id="email-error"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="password" name="password" required placeholder="Enter your password">
                            <button type="button" class="password-toggle" onclick="togglePassword('password')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <span class="error-message" id="password-error"></span>
                    </div>
                    
                    <div style="text-align: right; margin-bottom: 20px;">
                        <a href="#" onclick="router.navigate('request-reset'); return false;" style="color: var(--primary-yellow-dark); font-size: 14px;">
                            Forgot Password?
                        </a>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block btn-lg">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                </form>
                
                <div class="auth-footer">
                    <p>Don't have an account? <a href="#" onclick="router.navigate('register'); return false;">Create one</a></p>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous errors
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    // Validate
    if (!utils.validateEmail(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email';
        return;
    }

    showLoading('Signing in...');

    const result = await authManager.login(email, password);

    hideLoading();

    if (result.success) {
        showToast('Login successful! Welcome back.', 'success');
        router.navigate('dashboard');
    } else {
        // Check if error is email not verified
        if (result.error && result.error.toLowerCase().includes('not verified')) {
            showEmailNotVerifiedDialog(email);
        } else {
            showToast(result.error, 'error');
        }
    }
}

// Show dialog for unverified email with resend option
function showEmailNotVerifiedDialog(email) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    dialog.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        ">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 10px;">📧</div>
                <h2 style="margin-bottom: 10px; color: #333;">Email Not Verified</h2>
                <p style="color: #666; font-size: 14px; line-height: 1.5;">
                    Your email address hasn't been verified yet. Please check your inbox for the verification link.
                </p>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #666;">
                    <strong>Email:</strong> ${email}
                </p>
            </div>
            
            <button id="resend-btn" style="
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                margin-bottom: 10px;
                transition: transform 0.2s;
            ">
                Resend Verification Email
            </button>
            
            <button id="close-dialog-btn" style="
                width: 100%;
                padding: 14px;
                background: #f0f0f0;
                color: #333;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            ">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Handle resend
    document.getElementById('resend-btn').addEventListener('click', async () => {
        const btn = document.getElementById('resend-btn');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        
        const result = await authManager.resendVerificationEmail(email);
        
        if (result.success) {
            btn.textContent = '✓ Sent! Check your email';
            btn.style.background = '#10b981';
            showToast('Verification email sent! Please check your inbox.', 'success');
            setTimeout(() => {
                document.body.removeChild(dialog);
            }, 2000);
        } else {
            btn.disabled = false;
            btn.textContent = 'Resend Verification Email';
            showToast('Failed to send email. Please try again.', 'error');
        }
    });
    
    // Handle close
    document.getElementById('close-dialog-btn').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
    
    // Close on background click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
        }
    });
}

// Show Register Screen
async function showRegisterScreen() {
    const container = document.getElementById('auth-screens');
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <div class="logo mb-3" onclick="router.navigate('landing')" style="cursor: pointer;">
                        <i class="fas fa-graduation-cap"></i>
                        <span>ExamGenius</span>
                    </div>
                    <h1>Create Account</h1>
                    <p>Start your journey to JAMB success</p>
                </div>
                
                <form id="register-form" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" name="name" required placeholder="John Doe">
                        <span class="error-message" id="name-error"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-email">Email Address</label>
                        <input type="email" id="reg-email" name="email" required placeholder="you@example.com">
                        <span class="error-message" id="reg-email-error"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-password">Password</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="reg-password" name="password" required placeholder="Min. 8 characters">
                            <button type="button" class="password-toggle" onclick="togglePassword('reg-password')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <span class="error-message" id="reg-password-error"></span>
                        <small style="display: block; margin-top: 4px; color: var(--text-secondary);">
                            Must include uppercase, number, and special character
                        </small>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm-password">Confirm Password</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="confirm-password" name="confirmPassword" required placeholder="Re-enter password">
                            <button type="button" class="password-toggle" onclick="togglePassword('confirm-password')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <span class="error-message" id="confirm-password-error"></span>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block btn-lg mt-2">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                </form>
                
                <div class="auth-footer">
                    <p>Already have an account? <a href="#" onclick="router.navigate('login'); return false;">Sign in</a></p>
                </div>
            </div>
        </div>
    `;
}

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Clear previous errors
    ['name-error', 'reg-email-error', 'reg-password-error', 'confirm-password-error'].forEach(id => {
        document.getElementById(id).textContent = '';
    });

    // Validate
    let hasError = false;

    if (name.length < 3) {
        document.getElementById('name-error').textContent = 'Name must be at least 3 characters';
        hasError = true;
    }

    if (!utils.validateEmail(email)) {
        document.getElementById('reg-email-error').textContent = 'Please enter a valid email';
        hasError = true;
    }

    if (!utils.validatePassword(password)) {
        document.getElementById('reg-password-error').textContent = 'Password must be at least 8 characters with uppercase, number, and special character';
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
        hasError = true;
    }

    if (hasError) return;

    showLoading('Creating account...');

    const result = await authManager.register(name, email, password);

    hideLoading();

    if (result.success) {
        showToast('Account created! Please check your email to verify.', 'success');
        showVerificationNotice(email);
    } else {
        showToast(result.error, 'error');
    }
}

// Show Email Verification Notice
function showVerificationNotice(email) {
    const container = document.getElementById('auth-screens');
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card text-center">
                <i class="fas fa-envelope" style="font-size: 64px; color: var(--primary-yellow); margin-bottom: 20px;"></i>
                <h1>Check Your Email</h1>
                <p style="margin: 20px 0;">We've sent a verification link to:</p>
                <p style="font-weight: 600; color: var(--primary-yellow-dark); margin-bottom: 20px;">${email}</p>
                <p style="color: var(--text-secondary); margin-bottom: 32px;">
                    Click the link in the email to verify your account and start using ExamGenius.
                </p>
                <button class="btn btn-primary" onclick="router.navigate('login')">
                    Go to Login
                </button>
            </div>
        </div>
    `;
}

// Show Email Verification Screen (from email link)
async function showVerifyEmailScreen(token) {
    if (!token) {
        showToast('Invalid verification link', 'error');
        router.navigate('login');
        return;
    }

    const container = document.getElementById('auth-screens');
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card text-center">
                <div class="spinner" style="margin: 0 auto 20px;"></div>
                <h1>Verifying Email...</h1>
                <p>Please wait while we verify your email address.</p>
            </div>
        </div>
    `;

    const result = await authManager.verifyEmail(token);

    if (result.success) {
        container.innerHTML = `
            <div class="auth-container">
                <div class="auth-card text-center">
                    <i class="fas fa-check-circle" style="font-size: 64px; color: var(--success); margin-bottom: 20px;"></i>
                    <h1>Email Verified!</h1>
                    <p style="margin: 20px 0;">Your email has been successfully verified.</p>
                    <p style="color: var(--text-secondary); margin-bottom: 32px;">
                        You can now login and start preparing for your JAMB exam.
                    </p>
                    <button class="btn btn-primary btn-lg" onclick="router.navigate('login')">
                        <i class="fas fa-sign-in-alt"></i> Continue to Login
                    </button>
                </div>
            </div>
        `;
        showToast('Email verified successfully!', 'success');
    } else {
        container.innerHTML = `
            <div class="auth-container">
                <div class="auth-card text-center">
                    <i class="fas fa-times-circle" style="font-size: 64px; color: var(--error); margin-bottom: 20px;"></i>
                    <h1>Verification Failed</h1>
                    <p style="margin: 20px 0; color: var(--error);">${result.error}</p>
                    <button class="btn btn-primary" onclick="router.navigate('login')">
                        Go to Login
                    </button>
                </div>
            </div>
        `;
        showToast(result.error, 'error');
    }
}

// Show Reset Password Screen
async function showResetPasswordScreen(token) {
    if (!token) {
        showRequestResetScreen();
        return;
    }

    const container = document.getElementById('auth-screens');
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter your new password</p>
                </div>
                
                <form id="reset-password-form" onsubmit="handleResetPassword(event, '${token}')">
                    <div class="form-group">
                        <label for="new-password">New Password</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="new-password" required placeholder="Min. 8 characters">
                            <button type="button" class="password-toggle" onclick="togglePassword('new-password')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <span class="error-message" id="new-password-error"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm-new-password">Confirm New Password</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="confirm-new-password" required placeholder="Re-enter password">
                            <button type="button" class="password-toggle" onclick="togglePassword('confirm-new-password')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <span class="error-message" id="confirm-new-password-error"></span>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block btn-lg mt-2">
                        Reset Password
                    </button>
                </form>
                
                <div class="auth-footer">
                    <a href="#" onclick="router.navigate('login'); return false;">Back to Login</a>
                </div>
            </div>
        </div>
    `;
}

function showRequestResetScreen() {
    const container = document.getElementById('auth-screens');
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter your email to receive a reset link</p>
                </div>
                
                <form id="request-reset-form" onsubmit="handleRequestReset(event)">
                    <div class="form-group">
                        <label for="reset-email">Email Address</label>
                        <input type="email" id="reset-email" required placeholder="you@example.com">
                        <span class="error-message" id="reset-email-error"></span>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block btn-lg">
                        Send Reset Link
                    </button>
                </form>
                
                <div class="auth-footer">
                    <a href="#" onclick="router.navigate('login'); return false;">Back to Login</a>
                </div>
            </div>
        </div>
    `;
}

router.register('request-reset', showRequestResetScreen);

async function handleRequestReset(event) {
    event.preventDefault();

    const email = document.getElementById('reset-email').value.trim();
    document.getElementById('reset-email-error').textContent = '';

    if (!utils.validateEmail(email)) {
        document.getElementById('reset-email-error').textContent = 'Please enter a valid email';
        return;
    }

    showLoading('Sending reset link...');
    const result = await authManager.requestPasswordReset(email);
    hideLoading();

    if (result.success) {
        showToast('Reset link sent! Check your email.', 'success');
        showVerificationNotice(email);
    } else {
        showToast(result.error, 'error');
    }
}

async function handleResetPassword(event, token) {
    event.preventDefault();

    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;

    document.getElementById('new-password-error').textContent = '';
    document.getElementById('confirm-new-password-error').textContent = '';

    if (!utils.validatePassword(newPassword)) {
        document.getElementById('new-password-error').textContent = 'Password must be at least 8 characters with uppercase, number, and special character';
        return;
    }

    if (newPassword !== confirmPassword) {
        document.getElementById('confirm-new-password-error').textContent = 'Passwords do not match';
        return;
    }

    showLoading('Resetting password...');
    const result = await authManager.resetPassword(token, newPassword);
    hideLoading();

    if (result.success) {
        showToast('Password reset successful!', 'success');
        router.navigate('login');
    } else {
        showToast(result.error, 'error');
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Export functions
window.showLoginScreen = showLoginScreen;
window.showRegisterScreen = showRegisterScreen;
window.showVerifyEmailScreen = showVerifyEmailScreen;
window.showResetPasswordScreen = showResetPasswordScreen;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.togglePassword = togglePassword;
