"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Focus", href: "/" },
  { name: "Active", href: "/active" },
  { name: "Parked", href: "/parked" },
  { name: "Completed", href: "/completed" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border">
      {/* App name */}
      <div className="px-5 py-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          plandeck
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
