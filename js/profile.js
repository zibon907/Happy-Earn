// =========================================
// PROFILE SERVICES - SAAS v3 (Refactored)
// =========================================

/**
 * UserService - Data/Service Layer
 * Responsible for all data fetching, normalization, and storage interactions.
 * Single Responsibility: User data management.
 */
class UserService {
    #storageKey = 'currentUser';

    /**
     * Simulates real-world async API call with latency
     * @returns {Promise<Object|null>}
     */
    async fetchCurrentUser() {
        try {
            // Simulate network latency (real API would be here)
            await new Promise(resolve => setTimeout(resolve, 150));

            const userData = StorageService.getCurrentUser?.() || null;

            if (!userData) return null;

            // Data normalization & defensive defaults
            return {
                fullName: userData.fullName || 'Unknown User',
                username: userData.username || '',
                email: userData.email || '',
                points: Number(userData.points) || 0,
                vipLevel: Number(userData.vipLevel) || 0,
                referralCode: userData.referralCode || 'NO-CODE',
                activities: Array.isArray(userData.activities) ? userData.activities : [],
                securityScore: Number(userData.securityScore) || 100,
                ...userData // Preserve any additional fields
            };
        } catch (error) {
            console.error('UserService: Failed to fetch user:', error);
            throw new Error('Failed to load user profile. Please try again.');
        }
    }

    /**
     * Optional: Future extension point for saving profile changes
     */
    async saveUser(updatedData) {
        // Implementation stub for future use
        console.warn('UserService.saveUser not yet implemented');
    }
}

/**
 * ProfileView - UI/View Layer
 * Responsible ONLY for DOM interactions, rendering, and animations.
 * Single Responsibility: Presentation concerns.
 * Uses BEM naming convention for JS-manipulated classes.
 */
class ProfileView {
    #elements = {};

    constructor() {
        this.#bindElements();
    }

    #bindElements() {
        // Defensive selection with null-safety
        const safeGet = (id) => document.getElementById(id) || null;

        this.#elements = {
            fullName: safeGet('fullName'),
            username: safeGet('username'),
            email: safeGet('accountEmail'),
            points: safeGet('totalPoints'),
            vip: safeGet('accountVip'),
            referral: safeGet('referralCode'),
            activityCount: safeGet('activityCount'),
            securityScore: safeGet('securityScore'),
            vipProgress: safeGet('vipProgressFill'),
            vipText: safeGet('vipProgressText'),
            // BEM containers for cards
            cards: document.querySelectorAll('.profile__card, .profile__stat-card')
        };
    }

    /**
     * Batch DOM updates for better performance
     * @param {Object} user
     */
    render(user) {
        if (!user) return;

        // Use DocumentFragment for batching complex updates (future-proof)
        const fragment = document.createDocumentFragment();

        this.#safeSetText(this.#elements.fullName, user.fullName);
        this.#safeSetText(this.#elements.username, `@${user.username}`);
        this.#safeSetText(this.#elements.email, user.email);
        this.#safeSetText(this.#elements.points, user.points.toLocaleString());
        this.#safeSetText(this.#elements.vip, this.#getVipName(user.vipLevel));
        this.#safeSetText(this.#elements.referral, user.referralCode);
        this.#safeSetText(this.#elements.activityCount, user.activities.length);
        this.#safeSetText(this.#elements.securityScore, user.securityScore);

        this.#renderVipProgress(user.vipLevel);
    }

    #safeSetText(element, value) {
        if (element) {
            element.textContent = value ?? '';
        }
    }

    #getVipName(level) {
        const vipMap = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
        return vipMap[level] || "Bronze";
    }

    #renderVipProgress(level = 0) {
        const progress = Math.min(Math.max((level / 4) * 100, 0), 100);

        if (this.#elements.vipProgress) {
            this.#elements.vipProgress.style.width = `${progress}%`;
        }
        if (this.#elements.vipText) {
            this.#elements.vipText.textContent = `${Math.round(progress)}%`;
        }
    }

    /**
     * Smooth animations using requestAnimationFrame
     */
    animateUI() {
        const cards = Array.from(this.#elements.cards);

        cards.forEach((card, index) => {
            if (!card) return;

            // Reset initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'none';

            // Trigger reflow
            void card.offsetWidth;

            requestAnimationFrame(() => {
                setTimeout(() => {
                    card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 60);
            });
        });
    }
}

/**
 * ProfileController - Orchestration Layer
 * Thin coordinator. Injects dependencies for testability (DI).
 * Single Responsibility: Flow control between service and view.
 */
class ProfileController {
    #userService;
    #profileView;
    #user = null;

    constructor(userService = new UserService(), profileView = new ProfileView()) {
        this.#userService = userService;
        this.#profileView = profileView;
        this.#init();
    }

    async #init() {
        try {
            await this.#loadUser();
            this.#profileView.render(this.#user);
            this.#profileView.animateUI();
        } catch (error) {
            this.#handleError(error);
        }
    }

    async #loadUser() {
        this.#user = await this.#userService.fetchCurrentUser();

        if (!this.#user) {
            window.location.href = "index.html";
            return;
        }
    }

    #handleError(error) {
        console.error('ProfileController Error:', error);
        // Production: Show user-friendly toast/notification
        const errorEl = document.getElementById('profile-error');
        if (errorEl) {
            errorEl.textContent = error.message || 'An unexpected error occurred.';
            errorEl.style.display = 'block';
        } else {
            alert('Profile loading failed. Please refresh the page.'); // Fallback
        }
    }

    // Public API for future extensions (e.g., refresh profile)
    async refresh() {
        try {
            this.#user = await this.#userService.fetchCurrentUser();
            this.#profileView.render(this.#user);
        } catch (error) {
            this.#handleError(error);
        }
    }
}

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    // eslint-disable-next-line no-unused-vars
    const controller = new ProfileController();
    // Expose globally only if needed for debugging/legacy
    // window.profileController = controller;
});
