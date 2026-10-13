export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    UNAUTHORIZED: "/unauthorized",

    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        ACCESS_CONTROL: "/admin/access-control",
    },
    SSP: {
        DASHBOARD: "/ssp/dashboard",
        PENSIONER:"/ssp/pensionerMasterList",
        COMPUTATION_SLIP: "/ssp/computationSlip",
        COLLECTION:"/ssp/collection",
    },
} as const;