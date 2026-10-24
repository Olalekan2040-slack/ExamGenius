// Navigation Component

function createNavbar(user) {
    return `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <i class="fas fa-graduation-cap"></i>
                    <span>EduLab ExamPrep</span>
                </div>
            </div>
            
            <div class="sidebar-nav">
                <div class="nav-item ${router.currentRoute === 'dashboard' ? 'active' : ''}" onclick="router.navigate('dashboard')">
                    <i class="fas fa-home"></i>
                    <span>Dashboard</span>
                </div>
                
                <div class="nav-item ${router.currentRoute === 'guided-learn' ? 'active' : ''}" onclick="router.navigate('guided-learn')">
                    <i class="fas fa-road"></i>
                    <span>Learn Topics</span>
                </div>
                
                <div class="nav-item ${router.currentRoute === 'year-practice' ? 'active' : ''}" onclick="router.navigate('year-practice')">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Year Practice</span>
                </div>
                
                <div class="nav-item ${router.currentRoute === 'cbt' ? 'active' : ''}" onclick="router.navigate('cbt')">
                    <i class="fas fa-laptop"></i>
                    <span>Full CBT</span>
                </div>
                
                <div class="nav-item ${router.currentRoute === 'profile' ? 'active' : ''}" onclick="router.navigate('profile')">
                    <i class="fas fa-user"></i>
                    <span>Profile</span>
                </div>
            </div>
            
            ${user && user.role === 'admin' ? `
            <div class="nav-item ${router.currentRoute === 'admin' ? 'active' : ''}" onclick="router.navigate('admin')">
                <i class="fas fa-shield-alt"></i>
                <span>Admin Panel</span>
            </div>` : ''}
            <div class="sidebar-footer">
                <div class="nav-item" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    `;
}

function createTopBar(user) {
    const initials = utils.getUserInitials(user.name);

    return `
        <div class="top-bar">
            <button class="mobile-menu-toggle" onclick="utils.toggleMobileMenu()">
                <i class="fas fa-bars"></i>
            </button>
            
            <div class="user-menu">
                <div class="user-avatar">${initials}</div>
                <div>
                    <div style="font-weight: 600;">${user.name}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${user.email}</div>
                </div>
            </div>
        </div>
    `;
}

function createAppLayout(user, content) {
    return `
        <div class="app-layout">
            ${createNavbar(user)}
            <div class="main-content">
                ${createTopBar(user)}
                <div class="content-area">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

async function handleLogout() {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
        showLoading('Logging out...');
        await authManager.logout();
        hideLoading();
    }
}

// Export functions
window.createAppLayout = createAppLayout;
window.handleLogout = handleLogout;
