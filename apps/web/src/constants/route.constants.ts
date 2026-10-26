export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    UNAUTHORIZED: "/unauthorized",

    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        ACCESS_CONTROL: "/admin/access-control",
    },
    SUPER_ADMIN:{
        DASHBOARD:"/superadmin/dashboard",
        BRANCHES: "/superadmin/branches",
        BACKUP: "/superadmin/backup",
    }
} as const;