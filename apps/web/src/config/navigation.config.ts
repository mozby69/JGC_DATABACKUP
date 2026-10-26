import {
    LayoutDashboard,
    Users,
    ClipboardList,
    Settings,
    SquareMenu,
    DatabaseBackup,

} from "lucide-react";

import { NavigationItem } from "@/types/navigation.types";
import { ROUTES } from "@/constants/route.constants";

export const navigation: NavigationItem[] = [
    {
        title: "Management",
        href: ROUTES.ADMIN.ACCESS_CONTROL,
        icon: LayoutDashboard,
        roles: ["ADMIN"],
    },
    {
        title: "Dashboard",
        href: ROUTES.ADMIN.DASHBOARD,
        icon: ClipboardList,
        roles: ["ADMIN"],
    },
    {
        title: "Daily Backup",
        href: "/user/backup",
        icon: DatabaseBackup,
        roles: ["USER"],
    },
    // {
    //     title: "Settings",
    //     href: ROUTES.UNAUTHORIZED, // temporary
    //     icon: Settings,
    //     roles: ["SUPER_ADMIN"],
    // },


    {
        title: "Dashboard",
        href: ROUTES.SUPER_ADMIN.DASHBOARD, // temporary
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN"],
    },
    {
        title: "Branches",
        href: ROUTES.SUPER_ADMIN.BRANCHES, // temporary
        icon: SquareMenu,
        roles: ["SUPER_ADMIN"],
    },
    {
        title: "Backup",
        href: ROUTES.SUPER_ADMIN.BACKUP, // temporary
        icon: DatabaseBackup,
        roles: ["SUPER_ADMIN"],
    },
];