/**
 * Profile Manager
 * Handles user profile page
 */

class ProfileManager {
    constructor() {
        this.user = null;
        this.init();
    }

    /**
     * Initialize profile
     */
    init() {
        // Check authentication
        if (!authManager.isLoggedIn()) {
            window.location.href = '/login.html';
            return;
        }

        this.user = authManager.getCurrentUser();
        this.setupUI();
        this.attachEventListeners();
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        // Profile hero
        if (document.getElementById('fullName')) {
            document.getElementById('fullName').textContent = this.user.username || 'Player';
        }

        if (document.getElementById('username')) {
            document.getElementById('username').textContent = '@' + (this.user.username || 'player');
        }

        if (document.getElementById('profileAvatar')) {
            const avatar = document.getElementById('profileAvatar');
            avatar.textContent = (this.user.username || 'P')[0].toUpperCase();
        }

        // Account info
        if (document.getElementById('accountFullName')) {
            document.getElementById('accountFullName').textContent = this.user.username || '-';
        }

        if (document.getElementById('accountUsername')) {
            document.getElementById('accountUsername').textContent = this.user.username || '-';
        }

        if (document.getElementById('accountEmail')) {
            document.getElementById('accountEmail').textContent = this.user.email || '-';
        }

        if (document.getElementById('accountVip')) {
            const vipLevel = CONFIG.VIP_LEVELS[this.user.vipLevel || 0];
            document.getElementById('accountVip').textContent = vipLevel?.name || 'Bronze';
        }

        // Stats
        if (document.getElementById('totalPoints')) {
            document.getElementById('totalPoints').textContent = this.user.wallet || '0';
        }

        if (document.getElementById('totalReferrals')) {
            document.getElementById('totalReferrals').textContent = '0';
        }

        if (document.getElementById('activityCount')) {
            document.getElementById('activityCount').textContent = '0';
        }

        if (document.getElementById('securityScore')) {
            document.getElementById('securityScore').textContent = '100';
        }

        // VIP Progress
        if (document.getElementById('vipProgressText')) {
            const progress = Math.min((this.user.xp || 0) % 1000) / 10;
            document.getElementById('vipProgressText').textContent = Math.floor(progress) + '%';
        }

        if (document.getElementById('vipProgressFill')) {
            const progress = Math.min((this.user.xp || 0) % 1000) / 10;
            document.getElementById('vipProgressFill').style.width = progress + '%';
        }

        // Referral code
        if (document.getElementById('referralDisplay')) {
            document.getElementById('referralDisplay').textContent = this.user.referralCode || 'VGP-XXXXXX';
        }

        // Join date
        if (document.getElementById('joinDate')) {
            const joinDate = new Date(this.user.createdAt);
            document.getElementById('joinDate').textContent = 'Joined ' + joinDate.toLocaleDateString();
        }

        // VIP Badge
        if (document.getElementById('vipBadge')) {
            const vipLevel = CONFIG.VIP_LEVELS[this.user.vipLevel || 0];
            document.getElementById('vipBadge').textContent = vipLevel?.name || 'Bronze';
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Copy referral code
        const copyBtn = document.getElementById('copyReferralBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyReferralCode());
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Load achievements
        this.loadAchievements();

        // Load activities
        this.loadActivities();
    }

    /**
     * Copy referral code
     */
    copyReferralCode() {
        const code = this.user.referralCode || 'VGP-XXXXXX';
        navigator.clipboard.writeText(code).then(() => {
            alert('Referral code copied: ' + code);
        });
    }

    /**
     * Load achievements
     */
    loadAchievements() {
        const achievementGrid = document.getElementById('achievementGrid');
        if (!achievementGrid) return;

        const achievements = [
            { id: 1, name: 'First Login', emoji: '🎮' },
            { id: 2, name: 'First Win', emoji: '🏆' },
            { id: 3, name: 'Referral Master', emoji: '👥' },
            { id: 4, name: 'VIP Member', emoji: '⭐' }
        ];

        achievementGrid.innerHTML = achievements.map(a => `
            <div style="padding:20px; background: #1f2937; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 8px;">${a.emoji}</div>
                <div style="font-weight: 600;">${a.name}</div>
            </div>
        `).join('');
    }

    /**
     * Load activities
     */
    loadActivities() {
        const timeline = document.getElementById('activityTimeline');
        if (!timeline) return;

        const activities = [
            { date: 'Today', action: 'Joined the platform' },
            { date: 'Yesterday', action: 'Completed first game' }
        ];

        timeline.innerHTML = activities.map(a => `
            <div style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="color: #60a5fa; font-size: 12px; margin-bottom: 4px;">${a.date}</div>
                <div>${a.action}</div>
            </div>
        `).join('');
    }

    /**
     * Show notifications
     */
    showNotifications() {
        alert('Notifications:\n- Welcome to your profile!\n- Keep playing to earn more rewards!');
    }

    /**
     * Logout user
     */
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            authManager.logout();
            window.location.href = '/index.html';
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.profile = new ProfileManager();
    });
} else {
    window.profile = new ProfileManager();
}
