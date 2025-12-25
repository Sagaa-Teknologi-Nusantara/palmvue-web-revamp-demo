import { ReactNode } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <Sidebar />
      <main className="min-h-screen pl-64">
        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </main>
    </ProtectedRoute>
  );
}
