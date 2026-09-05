import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, Search } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { initialsFromName } from "@/utils/formatters";

export function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-base grid-bg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-signal-gradient focus:text-white focus:text-sm"
      >
        Skip to content
      </a>

      <Sidebar isMobileOpen={isMobileNavOpen} onCloseMobile={() => setIsMobileNavOpen(false)} />

      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-border bg-surface/40 backdrop-blur-xl sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden text-ink-muted hover:text-ink transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-ink-muted text-sm w-full max-w-sm bg-surface-elevated border border-border rounded-lg px-3 py-2 hover:border-accent-indigo/30 transition-colors cursor-pointer">
            <Search size={15} />
            <span className="hidden sm:inline">Search files, endpoints, questions...</span>
            <span className="sm:hidden">Search...</span>
            <kbd className="ml-auto hidden sm:inline text-[10px] font-mono text-ink-faint border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="text-ink-muted hover:text-ink transition-colors" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-signal-gradient flex items-center justify-center text-xs font-medium text-white shrink-0">
              {initialsFromName(user?.displayName ?? "Guest")}
            </div>
          </div>
        </header>
        <main id="main-content" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
