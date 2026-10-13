// src/app/(protected)/layout.tsx

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
   return (
    <div className="h-dvh overflow-hidden bg-[#F8F9F6]">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main workspace */}
      <div className="ml-51.5 flex h-full min-w-0 flex-col">
        {/* Fixed within workspace */}
        <Header />

        {/* Only this section scrolls */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1600px] px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}