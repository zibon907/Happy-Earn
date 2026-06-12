<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaSForge • Dashboard</title>
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --bg: #0f172a;
            --surface: #1e2937;
            --text: #e2e8f0;
            --text-muted: #94a3b8;
        }
        
        [data-theme="light"] {
            --bg: #f8fafc;
            --surface: #ffffff;
            --text: #0f172a;
            --text-muted: #64748b;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: var(--bg);
            color: var(--text);
            height: 100vh;
            overflow: hidden;
        }
        
        .dashboard {
            display: flex;
            height: 100vh;
        }
        
        .sidebar {
            width: 260px;
            background: var(--surface);
            border-right: 1px solid rgba(148, 163, 184, 0.2);
            display: flex;
            flex-direction: column;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .logo {
            padding: 1.5rem 1.25rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }
        
        .nav-menu {
            flex: 1;
            padding: 1rem 0;
        }
        
        .nav-item {
            padding: 0.75rem 1.25rem;
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .nav-item:hover, .nav-item.active {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
        }
        
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .header {
            height: 70px;
            background: var(--surface);
            border-bottom: 1px solid rgba(148, 163, 184, 0.2);
            display: flex;
            align-items: center;
            padding: 0 2rem;
            justify-content: space-between;
            z-index: 10;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .header-right {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        
        .content {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
            background: var(--bg);
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 1.5rem;
        }
        
        .card {
            background: var(--surface);
            border-radius: 16px;
            padding: 1.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 0.3s;
        }
        
        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .stat-value {
            font-size: 2.25rem;
            font-weight: 700;
            margin: 0.5rem 0;
        }
        
        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--surface);
            color: var(--text);
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 280px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        
        .modal-content {
            background: var(--surface);
            border-radius: 16px;
            width: 100%;
            max-width: 480px;
            padding: 2rem;
        }
        
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background: var(--primary);
            color: white;
        }
        
        .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
        }
        
        .vip-badge {
            background: linear-gradient(90deg, #f59e0b, #fbbf24);
            color: #000;
            padding: 2px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="dashboard" id="dashboard">
        <!-- Sidebar will be injected by JS -->
        <!-- Main content injected by JS -->
    </div>

    <!-- Toast Container -->
    <div id="toast-container"></div>

    <!-- Modals -->
    <div id="modal" class="modal">
        <div class="modal-content" id="modal-content"></div>
    </div>

    <script>
        // ========================================
        // SaaSForge Dashboard - Production Module
        // Full-featured vanilla JS implementation
        // Author: Senior Software Engineer
        // ========================================

        // ========================================
        // 1. CONSTANTS & CONFIG
        // ========================================
        const CONFIG = {
            APP_NAME: "SaaSForge",
            VERSION: "2.4.1",
            THEME_KEY: "saasforge_theme",
            USER_KEY: "saasforge_user",
            TOKEN_KEY: "saasforge_token",
            ACTIVITY_KEY: "saasforge_activity",
            NOTIF_KEY: "saasforge_notifications",
            REFERRAL_KEY: "saasforge_referrals",
            API_BASE: "/api/v1", // Ready for backend integration
            REFRESH_INTERVAL: 45000,
            ANIMATION_DURATION: 300
        };

        const MODULES = {
            WALLET: true,
            REFERRALS: true,
            ACHIEVEMENTS: true,
            SECURITY: true,
            ACTIVITY: true
        };

        // ========================================
        // 2. UTILITIES
        // ========================================
        class Utils {
            static generateId() {
                return 'id-' + Math.random().toString(36).substr(2, 9);
            }

            static formatNumber(num) {
                return new Intl.NumberFormat('en-US').format(num);
            }

            static formatCurrency(amount) {
                return '$' + this.formatNumber(amount);
            }

            static debounce(fn, delay = 300) {
                let timeout;
                return (...args) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => fn(...args), delay);
                };
            }

            static throttle(fn, limit = 200) {
                let inThrottle;
                return (...args) => {
                    if (!inThrottle) {
                        fn(...args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            }

            static animate(element, keyframes, duration = CONFIG.ANIMATION_DURATION) {
                return element.animate(keyframes, {
                    duration,
                    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
                });
            }

            static saveToLocalStorage(key, data) {
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                    return true;
                } catch (e) {
                    console.error("LocalStorage save failed:", e);
                    return false;
                }
            }

            static loadFromLocalStorage(key, defaultValue = null) {
                try {
                    const data = localStorage.getItem(key);
                    return data ? JSON.parse(data) : defaultValue;
                } catch (e) {
                    console.error("LocalStorage load failed:", e);
                    return defaultValue;
                }
            }

            static deepClone(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
        }

        // ========================================
        // 3. SERVICES
        // ========================================
        class AuthService {
            constructor() {
                this.token = null;
                this.user = null;
                this.init();
            }

            init() {
                this.token = Utils.loadFromLocalStorage(CONFIG.TOKEN_KEY);
                this.user = Utils.loadFromLocalStorage(CONFIG.USER_KEY);
            }

            validateSession() {
                if (!this.token || !this.user) {
                    this.logout();
                    return false;
                }
                // Simulate backend validation
                if (Date.now() - this.user.lastLogin > 1000 * 60 * 60 * 24 * 7) {
                    console.warn("Session expired");
                    this.logout();
                    return false;
                }
                return true;
            }

            login(email, password) {
                // Mock login
                const mockUser = {
                    id: "user_98765",
                    name: "Alex Rivera",
                    email: email || "alex@saasforge.dev",
                    avatar: "https://picsum.photos/id/64/128/128",
                    role: "pro",
                    vipLevel: 3,
                    points: 12480,
                    wallet: 2450.75,
                    securityScore: 92,
                    joinDate: "2024-03-12",
                    lastLogin: Date.now()
                };
                
                this.user = mockUser;
                this.token = "mock_jwt_token_" + Date.now();
                
                Utils.saveToLocalStorage(CONFIG.USER_KEY, this.user);
                Utils.saveToLocalStorage(CONFIG.TOKEN_KEY, this.token);
                
                return this.user;
            }

            logout() {
                localStorage.removeItem(CONFIG.USER_KEY);
                localStorage.removeItem(CONFIG.TOKEN_KEY);
                window.location.reload();
            }

            getCurrentUser() {
                return this.user;
            }
        }

        class UserService {
            constructor(authService) {
                this.auth = authService;
                this.user = null;
            }

            loadUser() {
                this.user = this.auth.getCurrentUser();
                return this.user;
            }

            updateProfile(updates) {
                if (!this.user) return null;
                this.user = { ...this.user, ...updates };
                Utils.saveToLocalStorage(CONFIG.USER_KEY, this.user);
                return this.user;
            }

            changeTheme(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                Utils.saveToLocalStorage(CONFIG.THEME_KEY, theme);
            }
        }

        class WalletService {
            constructor() {
                this.balance = 2450.75;
                this.transactions = [
                    { id: 1, type: "credit", amount: 450, desc: "Referral bonus", date: "2025-06-10" },
                    { id: 2, type: "debit", amount: 120, desc: "Pro plan renewal", date: "2025-06-08" }
                ];
            }

            getBalance() {
                return this.balance;
            }

            addFunds(amount) {
                this.balance += amount;
                this.transactions.unshift({
                    id: Date.now(),
                    type: "credit",
                    amount: amount,
                    desc: "Manual deposit",
                    date: new Date().toISOString().split('T')[0]
                });
                return this.balance;
            }

            getRecentTransactions(limit = 5) {
                return this.transactions.slice(0, limit);
            }
        }

        class ReferralService {
            constructor() {
                this.referrals = Utils.loadFromLocalStorage(CONFIG.REFERRAL_KEY, [
                    { id: 1, name: "Sarah Chen", email: "sarah@example.com", status: "active", joined: "2025-05-22", reward: 180 },
                    { id: 2, name: "Marcus Okoro", email: "marcus@startup.io", status: "pending", joined: null, reward: 0 }
                ]);
                this.referralCode = "FORGE-ALEX92";
            }

            getStats() {
                const active = this.referrals.filter(r => r.status === "active").length;
                const totalReward = this.referrals.reduce((sum, r) => sum + r.reward, 0);
                return { total: this.referrals.length, active, totalReward };
            }

            getReferrals() {
                return this.referrals;
            }

            getCode() {
                return this.referralCode;
            }
        }

        class NotificationService {
            constructor() {
                this.notifications = Utils.loadFromLocalStorage(CONFIG.NOTIF_KEY, [
                    { id: 1, type: "success", title: "VIP Level Up!", message: "You reached Level 3. +500 points awarded.", time: "2h ago", read: false },
                    { id: 2, type: "info", title: "Security Alert", message: "New login from San Francisco detected.", time: "5h ago", read: true }
                ]);
            }

            getAll() {
                return this.notifications;
            }

            markAsRead(id) {
                const notif = this.notifications.find(n => n.id === id);
                if (notif) notif.read = true;
                Utils.saveToLocalStorage(CONFIG.NOTIF_KEY, this.notifications);
            }

            add(notification) {
                this.notifications.unshift({
                    id: Date.now(),
                    ...notification,
                    time: "Just now",
                    read: false
                });
                Utils.saveToLocalStorage(CONFIG.NOTIF_KEY, this.notifications);
                return this.notifications[0];
            }
        }

        class ActivityLogService {
            constructor() {
                this.logs = Utils.loadFromLocalStorage(CONFIG.ACTIVITY_KEY, [
                    { id: 1, action: "Profile updated", timestamp: "2025-06-11T14:22:10Z", ip: "192.168.1.45" },
                    { id: 2, action: "Withdrew $250 to bank", timestamp: "2025-06-10T09:15:33Z", ip: "192.168.1.45" }
                ]);
            }

            getLogs(limit = 10) {
                return this.logs.slice(0, limit);
            }

            logAction(action) {
                const entry = {
                    id: Date.now(),
                    action,
                    timestamp: new Date().toISOString(),
                    ip: "127.0.0.1"
                };
                this.logs.unshift(entry);
                if (this.logs.length > 50) this.logs.pop();
                Utils.saveToLocalStorage(CONFIG.ACTIVITY_KEY, this.logs);
            }
        }

        class SecurityService {
            constructor() {
                this.score = 92;
                this.factors = [
                    { name: "2FA Enabled", status: true, strength: "strong" },
                    { name: "Password Age", status: "28 days", strength: "good" },
                    { name: "Devices", status: "3 active", strength: "medium" }
                ];
            }

            getScore() {
                return this.score;
            }

            getFactors() {
                return this.factors;
            }
        }

        // ========================================
        // 4. EVENT BUS (Event-driven architecture)
        // ========================================
        class EventBus {
            constructor() {
                this.events = {};
            }

            on(event, callback) {
                if (!this.events[event]) this.events[event] = [];
                this.events[event].push(callback);
            }

            emit(event, data) {
                if (this.events[event]) {
                    this.events[event].forEach(callback => callback(data));
                }
            }

            off(event, callback) {
                if (this.events[event]) {
                    this.events[event] = this.events[event].filter(cb => cb !== callback);
                }
            }
        }

        // ========================================
        // 5. UI COMPONENTS & RENDERERS
        // ========================================
        class ToastManager {
            constructor() {
                this.container = document.getElementById('toast-container');
            }

            show(message, type = 'info', duration = 4000) {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.innerHTML = `
                    <div style="flex:1">
                        <strong>${message}</strong>
                    </div>
                    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem;">×</button>
                `;
                
                this.container.appendChild(toast);
                
                setTimeout(() => {
                    if (toast.parentNode) toast.remove();
                }, duration);
            }
        }

        class SidebarRenderer {
            constructor(eventBus) {
                this.eventBus = eventBus;
            }

            render() {
                const sidebarHTML = `
                    <div class="sidebar">
                        <div class="logo">${CONFIG.APP_NAME}</div>
                        <div class="nav-menu">
                            <div class="nav-item active" data-module="dashboard">
                                <span>📊</span> Dashboard
                            </div>
                            <div class="nav-item" data-module="wallet">
                                <span>💰</span> Wallet
                            </div>
                            <div class="nav-item" data-module="referrals">
                                <span>🔗</span> Referrals
                            </div>
                            <div class="nav-item" data-module="activity">
                                <span>📜</span> Activity
                            </div>
                            <div class="nav-item" data-module="security">
                                <span>🛡️</span> Security
                            </div>
                            ${MODULES.ACHIEVEMENTS ? `
                            <div class="nav-item" data-module="achievements">
                                <span>🏆</span> Achievements
                            </div>` : ''}
                        </div>
                        <div style="padding: 1.25rem; border-top: 1px solid rgba(148,163,184,0.2);">
                            <div onclick="window.dashboard.logout()" style="cursor:pointer;color:#ef4444;font-size:0.9rem;display:flex;align-items:center;gap:8px;">
                                <span>🚪</span> Logout
                            </div>
                        </div>
                    </div>
                `;
                
                const dashboardEl = document.getElementById('dashboard');
                dashboardEl.innerHTML = sidebarHTML + `
                    <div class="main-content">
                        <div class="header" id="header"></div>
                        <div class="content" id="main-content"></div>
                    </div>
                `;
                
                this.attachNavListeners();
            }

            attachNavListeners() {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.addEventListener('click', () => {
                        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                        
                        const module = item.getAttribute('data-module');
                        window.dashboard.switchModule(module);
                    });
                });
            }
        }

        class HeaderRenderer {
            constructor(userService, notificationService, toastManager) {
                this.userService = userService;
                this.notificationService = notificationService;
                this.toastManager = toastManager;
            }

            render(user) {
                const header = document.getElementById('header');
                if (!header) return;
                
                header.innerHTML = `
                    <div class="header-left">
                        <h1 style="font-size:1.4rem;font-weight:600;">Welcome back, ${user.name.split(' ')[0]}</h1>
                    </div>
                    <div class="header-right">
                        <div onclick="window.dashboard.toggleNotifications()" style="cursor:pointer;position:relative;">
                            🛎️
                            <span id="notif-count" style="position:absolute;top:-6px;right:-6px;background:#ef4444;color:white;font-size:10px;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;">${this.notificationService.getAll().filter(n => !n.read).length}</span>
                        </div>
                        <div onclick="window.dashboard.showProfileModal()" style="cursor:pointer;display:flex;align-items:center;gap:10px;">
                            <img src="${user.avatar}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);" alt="avatar">
                            <div>
                                <div style="font-weight:600;font-size:0.95rem;">${user.name}</div>
                                <div class="vip-badge" style="font-size:10px;">VIP ${user.vipLevel}</div>
                            </div>
                        </div>
                        <div onclick="window.dashboard.toggleTheme()" style="cursor:pointer;font-size:1.3rem;">☀️</div>
                    </div>
                `;
            }
        }

        // ========================================
        // 6. DASHBOARD CONTROLLER
        // ========================================
        class DashboardController {
            constructor() {
                this.authService = new AuthService();
                this.userService = new UserService(this.authService);
                this.walletService = new WalletService();
                this.referralService = new ReferralService();
                this.notificationService = new NotificationService();
                this.activityService = new ActivityLogService();
                this.securityService = new SecurityService();
                
                this.eventBus = new EventBus();
                this.toastManager = new ToastManager();
                this.sidebarRenderer = new SidebarRenderer(this.eventBus);
                this.headerRenderer = new HeaderRenderer(this.userService, this.notificationService, this.toastManager);
                
                this.currentModule = 'dashboard';
                this.isDarkTheme = true;
            }

            init() {
                if (!this.authService.validateSession()) {
                    // Redirect logic would go here in real app
                    this.authService.login();
                }
                
                const savedTheme = Utils.loadFromLocalStorage(CONFIG.THEME_KEY, 'dark');
                document.documentElement.setAttribute('data-theme', savedTheme);
                this.isDarkTheme = savedTheme === 'dark';
                
                this.sidebarRenderer.render();
                this.renderHeader();
                this.renderDashboard();
                
                this.setupAutoRefresh();
                this.setupEventListeners();
                
                // Welcome toast
                setTimeout(() => {
                    this.toastManager.show("Welcome to SaaSForge Dashboard", "success");
                }, 800);
                
                // Log initial activity
                this.activityService.logAction("Dashboard initialized");
            }

            setupAutoRefresh() {
                setInterval(() => {
                    this.syncData();
                }, CONFIG.REFRESH_INTERVAL);
            }

            syncData() {
                // Simulate data sync
                this.eventBus.emit('data-synced', { timestamp: new Date() });
            }

            setupEventListeners() {
                this.eventBus.on('data-synced', () => {
                    if (this.currentModule === 'dashboard') {
                        this.renderDashboard();
                    }
                });
                
                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key === '/' && document.activeElement.tagName !== "INPUT") {
                        e.preventDefault();
                        this.toastManager.show("Global search activated (demo)", "info");
                    }
                });
            }

            renderHeader() {
                const user = this.userService.loadUser();
                this.headerRenderer.render(user);
            }

            renderDashboard() {
                const content = document.getElementById('main-content');
                if (!content) return;
                
                const user = this.userService.loadUser();
                const walletBalance = this.walletService.getBalance();
                const securityScore = this.securityService.getScore();
                const referralStats = this.referralService.getStats();
                
                content.innerHTML = `
                    <div class="grid">
                        <!-- Stat Cards -->
                        <div class="card">
                            <div style="display:flex;justify-content:space-between;align-items:start;">
                                <div>
                                    <div style="color:var(--text-muted);font-size:0.9rem;">TOTAL POINTS</div>
                                    <div class="stat-value" style="color:#a5b4fc;">${Utils.formatNumber(user.points)}</div>
                                </div>
                                <div style="font-size:2.5rem;opacity:0.3;">🏅</div>
                            </div>
                            <div style="margin-top:1rem;font-size:0.875rem;color:var(--success);">↑12% this month</div>
                        </div>
                        
                        <div class="card">
                            <div style="display:flex;justify-content:space-between;align-items:start;">
                                <div>
                                    <div style="color:var(--text-muted);font-size:0.9rem;">WALLET BALANCE</div>
                                    <div class="stat-value" style="color:#67e8f9;">${Utils.formatCurrency(walletBalance)}</div>
                                </div>
                                <div style="font-size:2.5rem;opacity:0.3;">💵</div>
                            </div>
                            <button onclick="window.dashboard.showAddFundsModal()" class="btn btn-primary" style="margin-top:1rem;width:100%;">Add Funds</button>
                        </div>
                        
                        <div class="card">
                            <div style="display:flex;justify-content:space-between;align-items:start;">
                                <div>
                                    <div style="color:var(--text-muted);font-size:0.9rem;">SECURITY SCORE</div>
                                    <div class="stat-value" style="color:#34d399;">${securityScore}</div>
                                </div>
                                <div style="font-size:2.5rem;opacity:0.3;">🛡️</div>
                            </div>
                            <div onclick="window.dashboard.switchModule('security')" style="margin-top:1rem;color:var(--primary);cursor:pointer;font-size:0.9rem;">View details →</div>
                        </div>
                        
                        <div class="card">
                            <div style="display:flex;justify-content:space-between;align-items:start;">
                                <div>
                                    <div style="color:var(--text-muted);font-size:0.9rem;">REFERRALS</div>
                                    <div class="stat-value">\( {referralStats.active}/ \){referralStats.total}</div>
                                </div>
                                <div style="font-size:2.5rem;opacity:0.3;">👥</div>
                            </div>
                            <div style="margin-top:1rem;color:var(--warning);font-size:0.9rem;">Earned \[ {referralStats.totalReward}</div>
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div style="margin-top:2rem;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                            <h2 style="font-size:1.35rem;">Recent Activity</h2>
                            <span onclick="window.dashboard.switchModule('activity')" style="color:var(--primary);cursor:pointer;">View all</span>
                        </div>
                        <div class="card">
                            ${this.activityService.getLogs(4).map(log => `
                                <div style="padding:1rem 0;border-bottom:1px solid rgba(148,163,184,0.15);display:flex;justify-content:space-between;">
                                    <div>
                                        <div>${log.action}</div>
                                        <div style="font-size:0.8rem;color:var(--text-muted);">${new Date(log.timestamp).toLocaleString()}</div>
                                    </div>
                                    <div style="color:var(--text-muted);font-size:0.8rem;">${log.ip}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            switchModule(module) {
                this.currentModule = module;
                const content = document.getElementById('main-content');
                
                if (module === 'dashboard') {
                    this.renderDashboard();
                } else if (module === 'wallet') {
                    this.renderWallet(content);
                } else if (module === 'referrals') {
                    this.renderReferrals(content);
                } else if (module === 'activity') {
                    this.renderActivity(content);
                } else if (module === 'security') {
                    this.renderSecurity(content);
                } else if (module === 'achievements') {
                    this.renderAchievements(content);
                }
                
                this.activityService.logAction(`Navigated to ${module}`);
            }

            renderWallet(content) {
                const balance = this.walletService.getBalance();
                const txs = this.walletService.getRecentTransactions(8);
                
                content.innerHTML = `
                    <div class="card" style="max-width:800px;margin:0 auto;">
                        <h2 style="margin-bottom:1.5rem;">Wallet Overview</h2>
                        <div style="text-align:center;padding:2rem 0;border:2px dashed rgba(99,102,241,0.3);border-radius:16px;margin-bottom:2rem;">
                            <div style="font-size:0.95rem;color:var(--text-muted);">AVAILABLE BALANCE</div>
                            <div style="font-size:3.5rem;font-weight:700;color:#67e8f9;margin:1rem 0;">${Utils.formatCurrency(balance)}</div>
                            <button onclick="window.dashboard.showAddFundsModal()" class="btn btn-primary">Deposit Funds</button>
                        </div>
                        
                        <h3 style="margin:1.5rem 0 1rem;">Recent Transactions</h3>
                        ${txs.map(tx => `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid rgba(148,163,184,0.2);">
                                <div>
                                    <div style="font-weight:500;">${tx.desc}</div>
                                    <div style="font-size:0.8rem;color:var(--text-muted);">${tx.date}</div>
                                </div>
                                <div style="color:${tx.type === 'credit' ? '#10b981' : '#ef4444'};font-weight:600;">
                                    \( {tx.type === 'credit' ? '+' : '-'} \){Utils.formatCurrency(tx.amount)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            renderReferrals(content) {
                const referrals = this.referralService.getReferrals();
                const code = this.referralService.getCode();
                
                content.innerHTML = `
                    <div class="card">
                        <h2>Referral Program</h2>
                        <div style="background:rgba(99,102,241,0.1);padding:1.5rem;border-radius:12px;margin:1.5rem 0;">
                            <div style="font-size:0.9rem;color:var(--text-muted);">Your referral link</div>
                            <div style="display:flex;align-items:center;gap:12px;margin-top:8px;">
                                <code style="flex:1;background:#1e2937;padding:0.75rem;border-radius:8px;font-family:monospace;">https://saasforge.dev/ref/${code}</code>
                                <button onclick="navigator.clipboard.writeText('https://saasforge.dev/ref/${code}');window.dashboard.toastManager.show('Link copied!')" class="btn btn-primary">Copy</button>
                            </div>
                        </div>
                        
                        <h3>Referred Users (${referrals.length})</h3>
                        <table style="width:100%;margin-top:1rem;border-collapse:collapse;">
                            <thead>
                                <tr style="border-bottom:2px solid rgba(148,163,184,0.3);">
                                    <th style="text-align:left;padding:12px 8px;">Name</th>
                                    <th style="text-align:left;padding:12px 8px;">Status</th>
                                    <th style="text-align:right;padding:12px 8px;">Reward</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${referrals.map(ref => `
                                    <tr style="border-bottom:1px solid rgba(148,163,184,0.15);">
                                        <td style="padding:12px 8px;">${ref.name}</td>
                                        <td style="padding:12px 8px;">
                                            <span style="padding:2px 10px;background:\( {ref.status==='active'?'#10b981':'#f59e0b'};color:white;border-radius:9999px;font-size:0.75rem;"> \){ref.status}</span>
                                        </td>
                                        <td style="padding:12px 8px;text-align:right;font-weight:600;color:#10b981;"> \]{ref.reward}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            renderActivity(content) {
                const logs = this.activityService.getLogs(20);
                
                content.innerHTML = `
                    <div class="card">
                        <h2>Activity Log</h2>
                        <div style="max-height:620px;overflow-y:auto;">
                            ${logs.map(log => `
                                <div style="padding:1.1rem 0;border-bottom:1px solid rgba(148,163,184,0.2);display:flex;justify-content:space-between;align-items:center;">
                                    <div style="flex:1">
                                        <div style="font-weight:500;">${log.action}</div>
                                        <div style="color:var(--text-muted);font-size:0.85rem;">${new Date(log.timestamp).toLocaleString()}</div>
                                    </div>
                                    <div style="color:var(--text-muted);font-family:monospace;font-size:0.8rem;">${log.ip}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            renderSecurity(content) {
                const score = this.securityService.getScore();
                const factors = this.securityService.getFactors();
                
                content.innerHTML = `
                    <div class="card">
                        <div style="display:flex;justify-content:space-between;">
                            <div>
                                <h2>Account Security</h2>
                                <div style="font-size:4rem;font-weight:700;color:#34d399;margin:1rem 0;">${score}</div>
                                <div style="color:var(--success);">Excellent Protection</div>
                            </div>
                            <div style="width:180px;height:180px;border-radius:50%;border:18px solid #34d399;display:flex;align-items:center;justify-content:center;font-size:2.5rem;">🛡️</div>
                        </div>
                        
                        <div style="margin-top:2rem;">
                            ${factors.map(f => `
                                <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid rgba(148,163,184,0.2);">
                                    <div>${f.name}</div>
                                    <div style="color:\( {f.strength === 'strong' ? '#10b981' : '#f59e0b'};"> \){f.status}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            renderAchievements(content) {
                content.innerHTML = `
                    <div class="card">
                        <h2>Achievements</h2>
                        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:1rem;margin-top:1.5rem;">
                            <div style="text-align:center;padding:1.5rem;background:rgba(99,102,241,0.1);border-radius:12px;">
                                <div style="font-size:3rem;margin-bottom:0.5rem;">🔥</div>
                                <div style="font-weight:600;">First Deposit</div>
                                <div style="font-size:0.8rem;color:var(--text-muted);">Completed</div>
                            </div>
                            <div style="text-align:center;padding:1.5rem;background:rgba(16,185,129,0.1);border-radius:12px;">
                                <div style="font-size:3rem;margin-bottom:0.5rem;">🌟</div>
                                <div style="font-weight:600;">VIP Pioneer</div>
                                <div style="font-size:0.8rem;color:var(--text-muted);">Level 3</div>
                            </div>
                            <div style="text-align:center;padding:1.5rem;background:rgba(245,158,11,0.1);border-radius:12px;">
                                <div style="font-size:3rem;margin-bottom:0.5rem;">👥</div>
                                <div style="font-weight:600;">Network Builder</div>
                                <div style="font-size:0.8rem;color:var(--text-muted);">5 referrals</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            showAddFundsModal() {
                const modal = document.getElementById('modal');
                const modalContent = document.getElementById('modal-content');
                
                modalContent.innerHTML = `
                    <h3 style="margin-bottom:1.5rem;">Add Funds</h3>
                    <input type="number" id="fund-amount" placeholder="Amount" value="500" style="width:100%;padding:1rem;background:var(--bg);border:1px solid rgba(148,163,184,0.4);border-radius:8px;color:var(--text);margin-bottom:1.5rem;">
                    <div style="display:flex;gap:1rem;">
                        <button onclick="window.dashboard.closeModal()" class="btn" style="flex:1;background:#334155;">Cancel</button>
                        <button onclick="window.dashboard.confirmAddFunds()" class="btn btn-primary" style="flex:1;">Deposit</button>
                    </div>
                `;
                modal.style.display = 'flex';
            }

            confirmAddFunds() {
                const amount = parseFloat(document.getElementById('fund-amount').value) || 250;
                this.walletService.addFunds(amount);
                this.closeModal();
                this.toastManager.show(`\[ {amount} added to wallet`, "success");
                this.activityService.logAction(`Added \]{amount} to wallet`);
                this.renderDashboard();
            }

            toggleNotifications() {
                this.toastManager.show("Notifications panel would open here", "info");
                // Full implementation would show a dropdown or modal with list
            }

            showProfileModal() {
                const user = this.userService.loadUser();
                const modal = document.getElementById('modal');
                const modalContent = document.getElementById('modal-content');
                
                modalContent.innerHTML = `
                    <div style="text-align:center;">
                        <img src="${user.avatar}" style="width:120px;height:120px;border-radius:50%;border:6px solid var(--primary);margin-bottom:1rem;" alt="">
                        <h2>${user.name}</h2>
                        <p style="color:var(--text-muted);">${user.email}</p>
                        <div style="margin:1.5rem 0;display:flex;justify-content:center;gap:2rem;">
                            <div style="text-align:center;">
                                <div style="font-size:2rem;font-weight:700;color:#a5b4fc;">${user.vipLevel}</div>
                                <div style="font-size:0.8rem;">VIP LEVEL</div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-size:2rem;font-weight:700;color:#67e8f9;">${Utils.formatNumber(user.points)}</div>
                                <div style="font-size:0.8rem;">POINTS</div>
                            </div>
                        </div>
                        <button onclick="window.dashboard.closeModal()" class="btn btn-primary" style="width:100%;">Close Profile</button>
                    </div>
                `;
                modal.style.display = 'flex';
            }

            toggleTheme() {
                this.isDarkTheme = !this.isDarkTheme;
                const newTheme = this.isDarkTheme ? 'dark' : 'light';
                this.userService.changeTheme(newTheme);
                this.toastManager.show(`${newTheme.toUpperCase()} theme activated`, "info");
            }

            closeModal() {
                document.getElementById('modal').style.display = 'none';
            }

            logout() {
                if (confirm("Sign out of SaaSForge?")) {
                    this.authService.logout();
                }
            }
        }

        // ========================================
        // 7. GLOBAL INITIALIZATION
        // ========================================
        function initializeDashboard() {
            window.dashboard = new DashboardController();
            window.dashboard.init();
            
            // Expose some methods globally for onclick handlers
            window.dashboard.toastManager = window.dashboard.toastManager;
            window.dashboard.closeModal = () => window.dashboard.closeModal();
            window.dashboard.confirmAddFunds = () => window.dashboard.confirmAddFunds();
            window.dashboard.showProfileModal = () => window.dashboard.showProfileModal();
            window.dashboard.toggleTheme = () => window.dashboard.toggleTheme();
            window.dashboard.logout = () => window.dashboard.logout();
            window.dashboard.switchModule = (m) => window.dashboard.switchModule(m);
            window.dashboard.showAddFundsModal = () => window.dashboard.showAddFundsModal();
        }

        // Auto-start
        window.addEventListener('load', initializeDashboard);

        // PWA / offline ready hooks
        console.log('%cSaaSForge Dashboard v' + CONFIG.VERSION + ' initialized successfully', 'color:#6366f1;font-weight:700;');
    </script>
</body>
</html>
