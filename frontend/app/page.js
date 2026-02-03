import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Hello world</h1>
          <ThemeToggle />
        </div>
        <div className="space-y-4">
          <div className="p-6 rounded-lg bg-card text-card-foreground border border-border">
            <h2 className="text-2xl font-semibold mb-2">Theme Demo</h2>
            <p className="text-muted-foreground">
              Use the theme toggle above to switch between light, dark, and
              system theme.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary text-primary-foreground">
              <h3 className="font-semibold">Primary</h3>
              <p className="text-sm">Primary colors</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
              <h3 className="font-semibold">Secondary</h3>
              <p className="text-sm">Secondary colors</p>
            </div>
            <div className="p-4 rounded-lg bg-accent text-accent-foreground">
              <h3 className="font-semibold">Accent</h3>
              <p className="text-sm">Accent colors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
