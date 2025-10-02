export const APP_NAME = "Gym Management System";

export const ROUTES = {
  user: {
    home: "/",
    login: "/login",
    signup: "/signup",
    dashboard: "/dashboard",
  },
  admin: {
    home: "/",
    login: "/login",
    dashboard: "/dashboard",
  },
} as const;

export const MEMBERSHIP_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "expired",
} as const;
