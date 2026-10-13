import {
    LayoutDashboard,
    Users,
    Truck,
    ClipboardList,
    Settings,
    BookText,
    Library
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
        title: "Users",
        href: ROUTES.UNAUTHORIZED, // temporary
        icon: Users,
        roles: ["USER"],
    },
     {
        title: "Dashboard",
        href: ROUTES.SSP.DASHBOARD, // temporary
        icon: LayoutDashboard,
        roles: ["BRANCH","ADMIN"],
    },
    {
        title: "Pensioner List",
        href: ROUTES.SSP.PENSIONER, // temporary
        icon: Users,
        roles: ["BRANCH","ADMIN"],
    },
    {
        title: "Computation Slip",
        href: ROUTES.SSP.COMPUTATION_SLIP, // temporary
        icon: BookText,
        roles: ["BRANCH","ADMIN"],
    },
     {
        title: "Collection",
        href: ROUTES.SSP.COLLECTION, // temporary
        icon: Library,
        roles: ["BRANCH","ADMIN"],
    },
    {
        title: "Settings",
        href: ROUTES.UNAUTHORIZED, // temporary
        icon: Settings,
        roles: ["SUPER_ADMIN"],
    },
];