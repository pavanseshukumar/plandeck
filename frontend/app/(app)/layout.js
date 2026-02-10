import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-svh bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">{children}</main>
    </div>
  );
}
