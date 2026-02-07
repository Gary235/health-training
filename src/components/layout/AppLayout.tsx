import type { ReactNode } from 'react';
import BottomNav from './BottomNav';
import SideNav from './SideNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <SideNav />

      {/* Main content */}
      <div className="md:pl-64 pb-16 md:pb-0">
        {children}
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
