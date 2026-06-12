export const CONFIG = {
  APP_NAME: "Virtual Rewards SaaS",
  STORAGE_KEYS: {
    USERS: "vr_users",
    CURRENT_USER: "vr_current_user",
    THEME: "vr_theme"
  },
  VIP_LEVELS: [
    { level: 1, name: "Bronze", threshold: 0 },
    { level: 2, name: "Silver", threshold: 500 },
    { level: 3, name: "Gold", threshold: 1500 },
    { level: 4, name: "Platinum", threshold: 3000 },
    { level: 5, name: "Diamond", threshold: 6000 }
  ]
};
