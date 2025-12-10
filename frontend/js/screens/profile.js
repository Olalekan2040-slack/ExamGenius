// Profile Screen

async function showProfileScreen() {
    showLoading('Loading profile...');
    
    try {
        const user = authManager.getUser();
        const profileData = await api.getCurrentUser();
        
        const content = `
            <div class="profile-screen">
                <h1><i class="fas fa-user"></i> My Profile</h1>
                
                <!-- Profile Card -->
                <div class="card mt-3">
                    <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 24px;">
                        <div class="user-avatar" style="width: 80px; height: 80px; font-size: 32px;">
                            ${utils.getUserInitials(profileData.profile.name)}
                        </div>
                        <div style="flex: 1;">
                            <h2 style="margin-bottom: 4px;">${profileData.profile.name}</h2>
                            <p style="color: var(--text-secondary); margin-bottom: 8px;">${profileData.profile.email}</p>
                            <p style="font-size: 14px; color: var(--text-secondary);">
                                <i class="fas fa-calendar"></i> Joined ${utils.formatDate(profileData.profile.joined_date)}
                            </p>
                        </div>
                        <button class="btn btn-outline" onclick="showEditProfile()">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                    </div>
                </div>
                
                <!-- Stats Summary -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h2><i class="fas fa-chart-bar"></i> Performance Statistics</h2>
                    </div>
                    <div class="stats-grid">
                        ${createStatCard('Total Attempts', profileData.stats_summary.total_questions_answered, 'fa-question-circle', 'var(--info)')}
                        ${createStatCard('Correct Answers', profileData.stats_summary.correct_answers, 'fa-check-circle', 'var(--success)')}
                        ${createStatCard('Incorrect', profileData.stats_summary.incorrect_answers, 'fa-times-circle', 'var(--error)')}
                        ${createStatCard('Overall Accuracy', profileData.stats_summary.accuracy.toFixed(1) + '%', 'fa-bullseye', 'var(--primary-yellow-dark)')}
                    </div>
                </div>
                
                <!-- Subject Performance -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h2><i class="fas fa-book"></i> Subjects Studied</h2>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <p style="color: var(--text-secondary);">${profileData.stats_summary.subjects_studied} subjects practiced</p>
                    </div>
                </div>
                
                <!-- Account Actions -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h2><i class="fas fa-cog"></i> Account Settings</h2>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button class="btn btn-outline" onclick="showChangePassword()">
                            <i class="fas fa-key"></i> Change Password
                        </button>
                        <button class="btn btn-outline" onclick="handleLogout()" style="color: var(--error); border-color: var(--error);">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const mainApp = document.getElementById('main-app');
        mainApp.innerHTML = createAppLayout(user, content);
        mainApp.classList.remove('hidden');
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showToast('Failed to load profile: ' + error.message, 'error');
    }
}

async function showEditProfile() {
    const user = authManager.getUser();
    
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>Edit Profile</h2>
                    <button class="close-modal" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-profile-form" onsubmit="handleUpdateProfile(event)">
                        <div class="form-group">
                            <label for="edit-name">Full Name</label>
                            <input type="text" id="edit-name" value="${user.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-email">Email (read-only)</label>
                            <input type="email" id="edit-email" value="${user.email}" disabled>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    
    const name = document.getElementById('edit-name').value.trim();
    
    if (name.length < 3) {
        showToast('Name must be at least 3 characters', 'warning');
        return;
    }
    
    showLoading('Updating profile...');
    
    try {
        const result = await api.updateProfile(name);
        
        // Update stored user data
        const user = authManager.getUser();
        user.name = result.profile.name;
        authManager.setUser(user);
        
        closeModal();
        hideLoading();
        showToast('Profile updated successfully!', 'success');
        showProfileScreen();
    } catch (error) {
        hideLoading();
        showToast('Failed to update profile: ' + error.message, 'error');
    }
}

function showChangePassword() {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>Change Password</h2>
                    <button class="close-modal" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">
                        To change your password, please use the "Forgot Password" option on the login page.
                    </p>
                    <button class="btn btn-primary btn-block" onclick="closeModal()">
                        Got it
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal(event) {
    if (event && event.target.className !== 'modal-overlay' && event.target.className !== 'close-modal') {
        return;
    }
    
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Export
window.showProfileScreen = showProfileScreen;
window.showEditProfile = showEditProfile;
window.handleUpdateProfile = handleUpdateProfile;
window.showChangePassword = showChangePassword;
window.closeModal = closeModal;
