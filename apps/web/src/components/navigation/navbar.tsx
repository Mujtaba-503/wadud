"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Bell, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationStore } from "@/stores/notifications.store";

const NAV_LINKS = [
  { href: "/doctors", label: "Find Doctors" },
  { href: "/consultations", label: "My Consultations" },
  { href: "/chat", label: "Messages" },
  { href: "/records", label: "Health Records" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { isAuthenticated, session } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="page-container flex h-16 items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Wadud home">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block">Wadud</span>
        </Link>

        {/* Desktop nav */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link",
                  pathname?.startsWith(link.href) && "active"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {["About", "Doctors", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                )}
              </Link>

              {/* Avatar menu */}
              <Link href="/profile">
                <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
                  <AvatarImage src={session?.user.avatar} />
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {session?.user.firstName?.[0]}{session?.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="page-container py-4 space-y-1">
              {(isAuthenticated ? NAV_LINKS : [
                { href: "/about", label: "About" },
                { href: "/doctors", label: "Find Doctors" },
                { href: "/pricing", label: "Pricing" },
              ]).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn("nav-link block", pathname?.startsWith(link.href) && "active")}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-3 border-t border-border mt-3">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
