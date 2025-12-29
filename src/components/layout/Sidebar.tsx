"use client";

import {
  BarChart3,
  Bot,
  Box,
  Boxes,
  GitBranch,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import { useEntityTypeOptionsQuery } from "@/hooks/queries";
import { cn } from "@/lib/cn";
import { getColorByLabel } from "@/lib/colors";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Entity Types", href: "/entity-types", icon: Boxes },
  { name: "Entities", href: "/entities", icon: Box },
  { name: "Workflows", href: "/workflows", icon: GitBranch },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { options: entityTypeOptions } = useEntityTypeOptionsQuery();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r">
      <div className="border-sidebar-border flex h-16 items-center gap-2 border-b px-6">
        <div className="bg-sidebar-accent text-sidebar-accent-foreground flex h-8 w-8 items-center justify-center rounded-lg font-bold">
          P
        </div>
        <span className="text-lg font-semibold">PalmVue Demo</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        {entityTypeOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sidebar-foreground/50 mb-2 px-2 text-xs font-semibold uppercase">
              Entity Types
            </h3>
            <div className="flex flex-col gap-1">
              {entityTypeOptions.map((type) => {
                const typeHref = `/entities?type=${type.id}`;
                const isActive =
                  pathname === "/entities" &&
                  searchParams.get("type") === type.id;

                return (
                  <Link
                    key={type.id}
                    href={typeHref}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded"
                      style={{
                        backgroundColor: getColorByLabel(type.color).bg,
                      }}
                    >
                      <DynamicIcon
                        name={(type.icon as IconName) || "box"}
                        className="h-3 w-3"
                        style={{ color: getColorByLabel(type.color).fg }}
                      />
                    </div>
                    {type.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="border-sidebar-border border-t p-4">
        <button
          onClick={handleLogout}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
