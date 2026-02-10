"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function AuthLayout({ children }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-5 sm:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          plandeck
        </Link>
        {mounted ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        ) : (
          <div className="size-8" />
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16 sm:px-8">
        <div className="w-full max-w-[380px]">{children}</div>
      </main>
    </div>
  );
}
