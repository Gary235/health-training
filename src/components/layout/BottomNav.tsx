import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, ShoppingCart, User } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, path: '/' },
  { label: 'Daily Log', icon: Calendar, path: '/daily' },
  { label: 'Shopping', icon: ShoppingCart, path: '/shopping-list' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-50">
      <div className="flex justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-current={active ? 'page' : undefined}
              className={`
                flex flex-col items-center justify-center
                flex-1 gap-1 min-w-11
                transition-colors duration-150
                cursor-pointer
                ${active
                  ? 'text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
                }
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
