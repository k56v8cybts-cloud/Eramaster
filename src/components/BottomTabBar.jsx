import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

// Paths where the tab bar should be hidden (game screens)
const HIDDEN_PREFIXES = ['/game/', '/bigfive/', '/creatures/', '/milestones/', '/olderthan/', '/knowledge', '/leaderboard/', '/mode/'];

export default function BottomTabBar() {
  const { pathname } = useLocation();

  const isHidden = HIDDEN_PREFIXES.some(p => pathname.startsWith(p));
  if (isHidden) return null;

  // Only show on sub-pages (erfolge, profil) — home handles its own tabs
  const isSubPage = pathname === '/erfolge' || pathname === '/profil';
  if (!isSubPage) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border"
      style={{ userSelect: 'none', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch max-w-md mx-auto h-14">
        <Link
          to="/"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors text-muted-foreground hover:text-foreground select-none"
        >
          <Home className="h-5 w-5" strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Start</span>
        </Link>
      </div>
    </nav>
  );
}