"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Layers3,
  LogOut,
} from "lucide-react";

import { navigation } from "@/config/navigation.config";
import { useAuth } from "@/modules/authentication/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menu = navigation.filter((item) => {
    if (
      item.roles &&
      !item.roles.some((role) =>
        user?.roles?.includes(role)
      )
    ) {
      return false;
    }

    if (
      item.permissions &&
      !item.permissions.some((permission) =>
        user?.permissions?.includes(permission)
      )
    ) {
      return false;
    }

    return true;
  });

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase() || "U";

  return (
   <aside
  className="
    fixed
    inset-y-0
    left-0
    z-40
    flex
    h-dvh
    w-51.5
    flex-col
    border-r
    border-[#DDDED8]
    bg-[#EEEFEA]
  "
>
      {/* Workspace branding */}
      <div className="flex h-[82px] items-center gap-3 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#26342F] text-white">
          <Layers3 size={17} strokeWidth={1.7} />
        </div>

        <div className="min-w-0">
          <h2 className="text-[20px] font-semibold leading-tight text-[#202A26]">
            LPCS
          </h2>
          <p className="mt-0.5 text-[10px] text-[#929992]">
            Admin workspace
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 pt-4">
        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (
              item.href !== "/" &&
              pathname.startsWith(`${item.href}/`)
            );

          return (
            <Link
              key={`${item.title}-${item.href}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`
                flex h-[37px] items-center gap-3
                rounded-[10px] px-3
                text-[13px] font-medium
                transition-colors duration-150
                ${
                  active
                    ? "bg-[#DCE1DA] text-[#26342F]"
                    : "text-[#858D86] hover:bg-[#E2E5DF] hover:text-[#26342F]"
                }
              `}
            >
              <Icon size={16} strokeWidth={1.7} />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-4">
        <div className="mb-4 rounded-[14px] border border-[#D9DDD6] bg-[#F5F6F2] p-3">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-[#E0E6DE]">
            <Layers3 size={14} className="text-[#526B5D]" />
          </div>

          <p className="text-[12px] font-semibold text-[#27332C]">
            Workspace overview
          </p>

          <p className="mt-1 text-[11px] leading-relaxed text-[#929A93]">
            Manage your workspace and access controls.
          </p>
        </div>

        {/* User profile */}
        <div className="border-t border-[#D9DDD6] pt-3">
          <div className="flex items-center gap-2 rounded-lg px-1 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D8DFD8] text-[10px] font-semibold text-[#26342F]">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-[#26342F]">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-[10px] text-[#909890]">
                {user?.username ?? "Account"}
              </p>
            </div>

            <ChevronDown
              size={13}
              className="text-[#7F8880]"
            />
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] text-[#7F8880] transition-colors hover:bg-[#E2E5DF] hover:text-[#26342F]"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}