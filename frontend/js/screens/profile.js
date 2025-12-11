// Profile Screen

async function showProfileScreen() {
    showLoading('Loading profile...');

    try {
        const user = authManager.getUser();
        const profileData = await api.getProfile();

        const content = `
            <div class="profile-screen">
                <h1><i class="fas fa-user"></i> My Profile</h1>
                
                <!-- Profile Card -->
                <div class="card mt-3">
                    <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 24px;">
                        <div class="user-avatar" style="width: 80px; height: 80px; font-size: 32px;">
                            ${utils.getUserInitials(profileData.name)}
                        </div>
                        <div style="flex: 1;">
                            <h2 style="margin-bottom: 4px;">${profileData.full_name || profileData.name}</h2>
                            <p style="color: var(--text-secondary); margin-bottom: 8px;">${profileData.email}</p>
                            ${profileData.class_level ? `<p style="font-size: 14px; color: var(--text-secondary);"><i class="fas fa-graduation-cap"></i> ${profileData.class_level} Student</p>` : ''}
                        </div>
                        <button class="btn btn-outline" onclick="showEditProfile()">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                    </div>
                    
                    <!-- Profile Details Grid -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                        ${createProfileField('Phone', profileData.phone_number || 'Not set', 'fa-phone')}
                        ${createProfileField('Gender', profileData.gender || 'Not set', 'fa-venus-mars')}
                        ${createProfileField('Age', profileData.age ? `${profileData.age} years` : 'Not set', 'fa-birthday-cake')}
                        ${createProfileField('Department', profileData.department || 'Not set', 'fa-book-reader')}
                        ${createProfileField('State', profileData.state || 'Not set', 'fa-map-marker-alt')}
                        ${createProfileField('LGA', profileData.local_government || 'Not set', 'fa-map-pin')}
                    </div>
                </div>
                
                <!-- Stats Summary -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h2><i class="fas fa-chart-bar"></i> Performance Statistics</h2>
                    </div>
                    <div class="stats-grid">
                        ${createStatCard('Total Attempts', profileData.stats.total_attempts, 'fa-question-circle', 'var(--info)')}
                        ${createStatCard('Correct Answers', profileData.stats.correct_attempts, 'fa-check-circle', 'var(--success)')}
                        ${createStatCard('Accuracy', profileData.stats.accuracy.toFixed(1) + '%', 'fa-bullseye', 'var(--primary-yellow-dark)')}
                        ${createStatCard('Current Streak', profileData.stats.current_streak + ' days', 'fa-fire', 'var(--error)')}
                    </div>
                </div>
                
                <!-- Subjects -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h2><i class="fas fa-book"></i> My Subjects</h2>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        ${profileData.subjects.map(s => `
                            <div style="padding: 12px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; text-align: center;">
                                <p style="font-weight: 600;">${s.subject}</p>
                            </div>
                        `).join('')}
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

function createProfileField(label, value, icon) {
    return `
        <div style="padding: 12px; background: var(--bg-primary); border-radius: 8px;">
            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">
                <i class="fas ${icon}"></i> ${label}
            </p>
            <p style="font-weight: 600;">${value}</p>
        </div>
    `;
}

async function showEditProfile() {
    showLoading('Loading profile...');
    
    try {
        const profileData = await api.getProfile();
        hideLoading();
        
        const states = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

        const modalHTML = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal" onclick="event.stopPropagation()" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
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
                                <input type="text" id="edit-name" value="${profileData.full_name || profileData.name}" required>
                            </div>

                            <div class="form-group">
                                <label for="edit-avatar">Profile Picture</label>
                                <input type="file" id="edit-avatar" accept="image/*">
                                <button type="button" class="btn btn-outline" style="margin-top: 8px;" onclick="handleUploadAvatar()">
                                    <i class="fas fa-upload"></i> Upload Picture
                                </button>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-phone">Phone Number</label>
                                <input type="tel" id="edit-phone" value="${profileData.phone_number || ''}" placeholder="08012345678">
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-class">Class Level</label>
                                <select id="edit-class" required>
                                    <option value="">Select Class</option>
                                    <option value="SS1" ${profileData.class_level === 'SS1' ? 'selected' : ''}>SS1</option>
                                    <option value="SS2" ${profileData.class_level === 'SS2' ? 'selected' : ''}>SS2</option>
                                    <option value="SS3" ${profileData.class_level === 'SS3' ? 'selected' : ''}>SS3</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-gender">Gender</label>
                                <select id="edit-gender">
                                    <option value="">Select Gender</option>
                                    <option value="Male" ${profileData.gender === 'Male' ? 'selected' : ''}>Male</option>
                                    <option value="Female" ${profileData.gender === 'Female' ? 'selected' : ''}>Female</option>
                                    <option value="Other" ${profileData.gender === 'Other' ? 'selected' : ''}>Other</option>
                                    <option value="Prefer not to say" ${profileData.gender === 'Prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-age">Age</label>
                                <input type="number" id="edit-age" value="${profileData.age || ''}" min="10" max="100" placeholder="Enter your age">
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-department">Department</label>
                                <select id="edit-department">
                                    <option value="">Select Department</option>
                                    <option value="Science" ${profileData.department === 'Science' ? 'selected' : ''}>Science</option>
                                    <option value="Commercial" ${profileData.department === 'Commercial' ? 'selected' : ''}>Commercial</option>
                                    <option value="Art" ${profileData.department === 'Art' ? 'selected' : ''}>Art</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-state">State</label>
                                <select id="edit-state" onchange="updateLGAs()">
                                    <option value="">Select State</option>
                                    ${states.map(state => `<option value="${state}" ${profileData.state === state ? 'selected' : ''}>${state}</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-lga">Local Government Area</label>
                                <input type="text" id="edit-lga" value="${profileData.local_government || ''}" placeholder="Enter LGA">
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
    } catch (error) {
        hideLoading();
        showToast('Failed to load profile: ' + error.message, 'error');
    }
}

async function handleUpdateProfile(event) {
    event.preventDefault();

    const fullName = document.getElementById('edit-name').value.trim();
    const phoneNumber = document.getElementById('edit-phone').value.trim();
    const classLevel = document.getElementById('edit-class').value;
    const gender = document.getElementById('edit-gender').value;
    const age = document.getElementById('edit-age').value;
    const department = document.getElementById('edit-department').value;
    const state = document.getElementById('edit-state').value;
    const lga = document.getElementById('edit-lga').value.trim();

    if (fullName.length < 3) {
        showToast('Name must be at least 3 characters', 'warning');
        return;
    }

    if (!classLevel) {
        showToast('Please select your class level', 'warning');
        return;
    }

    showLoading('Updating profile...');

    try {
        const updateData = {
            full_name: fullName,
            class_level: classLevel
        };

        if (phoneNumber) updateData.phone_number = phoneNumber;
        if (gender) updateData.gender = gender;
        if (age) updateData.age = parseInt(age);
        if (department) updateData.department = department;
        if (state) updateData.state = state;
        if (lga) updateData.local_government = lga;

        await api.updateProfile(updateData);

        // Update stored user data
        const user = authManager.getUser();
        user.name = fullName;
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

// Simple LGA helper (keeps placeholder contextual)
function updateLGAs() {
    const stateSelect = document.getElementById('edit-state');
    const lgaInput = document.getElementById('edit-lga');
    if (!stateSelect || !lgaInput) return;

    const state = stateSelect.value;
    lgaInput.placeholder = state ? `Enter LGA in ${state}` : 'Enter LGA';
}

// Handle avatar upload
async function handleUploadAvatar() {
    const fileInput = document.getElementById('edit-avatar');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
        showToast('Please select an image to upload', 'warning');
        return;
    }

    const file = fileInput.files[0];

    // Basic size check (max ~2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image must be less than 2MB', 'warning');
        return;
    }

    showLoading('Uploading profile picture...');

    try {
        await api.uploadAvatar(file);
        hideLoading();
        showToast('Profile picture updated!', 'success');
        showProfileScreen();
    } catch (error) {
        hideLoading();
        showToast('Failed to upload picture: ' + error.message, 'error');
    }
}

function createStatCard(label, value, icon, color) {
    return `
        <div class="stat-card" style="border-left: 4px solid ${color};">
            <i class="fas ${icon}" style="color: ${color};"></i>
            <div>
                <p class="stat-label">${label}</p>
                <p class="stat-value">${value}</p>
            </div>
        </div>
    `;
}

// Export
window.showProfileScreen = showProfileScreen;
window.showEditProfile = showEditProfile;
window.handleUpdateProfile = handleUpdateProfile;
window.showChangePassword = showChangePassword;
window.closeModal = closeModal;
window.createProfileField = createProfileField;
window.updateLGAs = updateLGAs;
window.handleUploadAvatar = handleUploadAvatar;
