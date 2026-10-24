// Profile Setup Screen - Mandatory first-time setup after signup/login

// Department-to-subjects mapping
const DEPARTMENT_SUBJECTS = {
    Science: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
    Commercial: ['Commerce', 'Accounting', 'Economics', 'Mathematics'],
    Art: ['Government', 'Literature in English', 'Economics', 'History', 'Geography', 'Hausa', 'Igbo', 'French', 'Music', 'Art']
};

const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

async function showProfileSetupScreen() {
    const user = authManager.getUser();

    const container = document.getElementById('auth-screens');
    document.getElementById('landing-page')?.classList.add('hidden');
    document.getElementById('main-app')?.classList.add('hidden');

    container.innerHTML = `
        <div class="profile-setup-container">
            <div class="profile-setup-card">
                <div class="profile-setup-header">
                    <div class="logo mb-2" style="justify-content: center;">
                        <i class="fas fa-graduation-cap"></i>
                        <span>EduLab ExamPrep</span>
                    </div>
                    <h1>Complete Your Profile</h1>
                    <p>Welcome, <strong>${user?.name || 'Student'}</strong>! Set up your profile to get personalized recommendations.</p>
                </div>

                <!-- Step Indicator -->
                <div class="setup-steps">
                    <div class="setup-step active" id="step-ind-1">
                        <div class="step-number">1</div>
                        <span>Personal Info</span>
                    </div>
                    <div class="setup-step-line"></div>
                    <div class="setup-step" id="step-ind-2">
                        <div class="step-number">2</div>
                        <span>Department</span>
                    </div>
                    <div class="setup-step-line"></div>
                    <div class="setup-step" id="step-ind-3">
                        <div class="step-number">3</div>
                        <span>Subjects</span>
                    </div>
                </div>

                <!-- Step 1: Personal Info -->
                <div class="setup-step-content" id="step-1">
                    <div class="form-group">
                        <label for="setup-name">Full Name <span class="required">*</span></label>
                        <input type="text" id="setup-name" value="${user?.name || ''}" required placeholder="Enter your full name">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="setup-phone">Phone Number</label>
                            <input type="tel" id="setup-phone" placeholder="08012345678">
                        </div>
                        <div class="form-group">
                            <label for="setup-class">Class Level <span class="required">*</span></label>
                            <select id="setup-class" required>
                                <option value="">Select Class</option>
                                <option value="SS1">SS1</option>
                                <option value="SS2">SS2</option>
                                <option value="SS3">SS3</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="setup-gender">Gender</label>
                            <select id="setup-gender">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="setup-age">Age</label>
                            <input type="number" id="setup-age" min="10" max="100" placeholder="Your age">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="setup-state">State</label>
                            <select id="setup-state">
                                <option value="">Select State</option>
                                ${NIGERIAN_STATES.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="setup-lga">Local Government</label>
                            <input type="text" id="setup-lga" placeholder="Enter LGA">
                        </div>
                    </div>
                    <button class="btn btn-primary btn-block btn-lg mt-2" onclick="goToSetupStep(2)">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

                <!-- Step 2: Department -->
                <div class="setup-step-content hidden" id="step-2">
                    <h2 style="text-align: center; margin-bottom: 8px;">Choose Your Department</h2>
                    <p style="text-align: center; color: var(--text-secondary); margin-bottom: 24px;">
                        This determines which subjects will be recommended to you
                    </p>
                    <div class="department-grid">
                        <div class="department-card" onclick="selectDepartment('Science', this)">
                            <div class="department-icon"><i class="fas fa-flask"></i></div>
                            <h3>Science</h3>
                            <p>Physics, Chemistry, Biology, Mathematics</p>
                        </div>
                        <div class="department-card" onclick="selectDepartment('Commercial', this)">
                            <div class="department-icon"><i class="fas fa-chart-line"></i></div>
                            <h3>Commercial</h3>
                            <p>Commerce, Accounting, Economics, Mathematics</p>
                        </div>
                        <div class="department-card" onclick="selectDepartment('Art', this)">
                            <div class="department-icon"><i class="fas fa-palette"></i></div>
                            <h3>Art</h3>
                            <p>Government, Literature, Economics, History & more</p>
                        </div>
                    </div>
                    <div id="selected-department-info" class="hidden" style="margin-top: 16px; text-align: center;">
                        <p style="color: var(--success); font-weight: 600;"><i class="fas fa-check-circle"></i> <span id="dept-label"></span> selected</p>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button class="btn btn-outline btn-block" onclick="goToSetupStep(1)">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                        <button class="btn btn-primary btn-block btn-lg" id="step2-next" onclick="goToSetupStep(3)" disabled>
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- Step 3: Subjects -->
                <div class="setup-step-content hidden" id="step-3">
                    <h2 style="text-align: center; margin-bottom: 8px;">Select Your 4 JAMB Subjects</h2>
                    <p style="text-align: center; color: var(--text-secondary); margin-bottom: 8px;">
                        English is compulsory. Choose 3 more from your department.
                    </p>
                    <div class="selected-count" id="subject-count">
                        <span id="count-num">1</span>/4 subjects selected
                    </div>
                    <div class="subject-grid" id="subject-grid">
                        <!-- Will be populated dynamically -->
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button class="btn btn-outline btn-block" onclick="goToSetupStep(2)">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                        <button class="btn btn-primary btn-block btn-lg" id="setup-complete-btn" onclick="handleProfileSetupComplete()" disabled>
                            <i class="fas fa-check"></i> Complete Setup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let selectedDepartment = null;
let selectedSubjects = ['English'];  // English is always selected

function selectDepartment(dept, element) {
    selectedDepartment = dept;

    // Highlight selected
    document.querySelectorAll('.department-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');

    // Show info
    document.getElementById('selected-department-info').classList.remove('hidden');
    document.getElementById('dept-label').textContent = dept;

    // Enable next button
    document.getElementById('step2-next').disabled = false;
}

function goToSetupStep(step) {
    // Validate current step before proceeding
    if (step === 2) {
        const name = document.getElementById('setup-name').value.trim();
        const classLevel = document.getElementById('setup-class').value;
        if (!name || name.length < 3) {
            showToast('Please enter your full name (at least 3 characters)', 'warning');
            return;
        }
        if (!classLevel) {
            showToast('Please select your class level', 'warning');
            return;
        }
    }

    if (step === 3) {
        if (!selectedDepartment) {
            showToast('Please select your department first', 'warning');
            return;
        }
        // Reset subjects when entering step 3 (in case dept changed)
        selectedSubjects = ['English'];
        populateSubjectGrid();
    }

    // Hide all steps
    document.querySelectorAll('.setup-step-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`step-${step}`).classList.remove('hidden');

    // Update step indicators
    for (let i = 1; i <= 3; i++) {
        const indicator = document.getElementById(`step-ind-${i}`);
        indicator.classList.remove('active', 'completed');
        if (i < step) indicator.classList.add('completed');
        if (i === step) indicator.classList.add('active');
    }
}

function populateSubjectGrid() {
    const grid = document.getElementById('subject-grid');
    const deptSubjects = DEPARTMENT_SUBJECTS[selectedDepartment] || [];

    // English is always included and locked
    let html = `
        <div class="subject-chip selected locked">
            <i class="fas fa-check-circle"></i> English <span class="chip-badge">Compulsory</span>
        </div>
    `;

    deptSubjects.forEach(sub => {
        const isSelected = selectedSubjects.includes(sub);
        html += `
            <div class="subject-chip ${isSelected ? 'selected' : ''}" onclick="toggleSubject('${sub}', this)">
                <i class="fas ${isSelected ? 'fa-check-circle' : 'fa-circle'}"></i> ${sub}
            </div>
        `;
    });

    grid.innerHTML = html;
    updateSubjectCount();
}

function toggleSubject(subject, element) {
    if (subject === 'English') return; // Can't deselect English

    const idx = selectedSubjects.indexOf(subject);
    if (idx > -1) {
        // Deselect
        selectedSubjects.splice(idx, 1);
        element.classList.remove('selected');
        element.querySelector('i').className = 'fas fa-circle';
    } else {
        // Select (max 4 total)
        if (selectedSubjects.length >= 4) {
            showToast('You can only select 4 subjects. Deselect one first.', 'warning');
            return;
        }
        selectedSubjects.push(subject);
        element.classList.add('selected');
        element.querySelector('i').className = 'fas fa-check-circle';
    }

    updateSubjectCount();
}

function updateSubjectCount() {
    const countEl = document.getElementById('count-num');
    const btn = document.getElementById('setup-complete-btn');
    countEl.textContent = selectedSubjects.length;

    const countContainer = document.getElementById('subject-count');
    if (selectedSubjects.length === 4) {
        btn.disabled = false;
        countContainer.classList.add('complete');
    } else {
        btn.disabled = true;
        countContainer.classList.remove('complete');
    }
}

async function handleProfileSetupComplete() {
    const fullName = document.getElementById('setup-name').value.trim();
    const phone = document.getElementById('setup-phone').value.trim();
    const classLevel = document.getElementById('setup-class').value;
    const gender = document.getElementById('setup-gender').value;
    const age = document.getElementById('setup-age').value;
    const state = document.getElementById('setup-state').value;
    const lga = document.getElementById('setup-lga').value.trim();

    if (selectedSubjects.length !== 4) {
        showToast('Please select exactly 4 subjects', 'warning');
        return;
    }

    showLoading('Completing your profile...');

    try {
        const payload = {
            full_name: fullName,
            phone_number: phone || '',
            class_level: classLevel,
            gender: gender || null,
            age: age ? parseInt(age) : null,
            department: selectedDepartment,
            state: state || null,
            local_government: lga || null,
            subjects: selectedSubjects
        };

        await api.request('/profile/complete', {
            method: 'POST',
            body: payload,
            requireAuth: true
        });

        hideLoading();
        showToast('Profile setup complete! Welcome to EduLab ExamPrep!', 'success');

        // Navigate to dashboard
        router.navigate('dashboard');
    } catch (error) {
        hideLoading();
        showToast('Setup failed: ' + error.message, 'error');
    }
}

// Export
window.showProfileSetupScreen = showProfileSetupScreen;
window.selectDepartment = selectDepartment;
window.goToSetupStep = goToSetupStep;
window.toggleSubject = toggleSubject;
window.handleProfileSetupComplete = handleProfileSetupComplete;
