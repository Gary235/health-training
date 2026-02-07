import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Utensils, Dumbbell, Calendar, ShoppingCart, TrendingUp, History, BarChart3, User } from 'lucide-react';

type ColorTheme = 'slate' | 'amber' | 'blue' | 'teal' | 'orange' | 'purple' | 'gray' | 'indigo';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: ColorTheme;
}

// Complete color classes for each theme - must be full strings for Tailwind
const COLOR_THEMES = {
  slate: {
    icon: 'text-slate-600',
    activeBg: 'bg-slate-100',
    activeBorder: 'border-slate-600',
    activeText: 'text-slate-900',
    activeIcon: 'text-slate-700'
  },
  amber: {
    icon: 'text-amber-600',
    activeBg: 'bg-amber-100',
    activeBorder: 'border-amber-600',
    activeText: 'text-amber-900',
    activeIcon: 'text-amber-700'
  },
  blue: {
    icon: 'text-blue-600',
    activeBg: 'bg-blue-100',
    activeBorder: 'border-blue-600',
    activeText: 'text-blue-900',
    activeIcon: 'text-blue-700'
  },
  teal: {
    icon: 'text-teal-600',
    activeBg: 'bg-teal-100',
    activeBorder: 'border-teal-600',
    activeText: 'text-teal-900',
    activeIcon: 'text-teal-700'
  },
  orange: {
    icon: 'text-orange-600',
    activeBg: 'bg-orange-100',
    activeBorder: 'border-orange-600',
    activeText: 'text-orange-900',
    activeIcon: 'text-orange-700'
  },
  purple: {
    icon: 'text-purple-600',
    activeBg: 'bg-purple-100',
    activeBorder: 'border-purple-600',
    activeText: 'text-purple-900',
    activeIcon: 'text-purple-700'
  },
  gray: {
    icon: 'text-gray-600',
    activeBg: 'bg-gray-100',
    activeBorder: 'border-gray-600',
    activeText: 'text-gray-900',
    activeIcon: 'text-gray-700'
  },
  indigo: {
    icon: 'text-indigo-600',
    activeBg: 'bg-indigo-100',
    activeBorder: 'border-indigo-600',
    activeText: 'text-indigo-900',
    activeIcon: 'text-indigo-700'
  }
} as const;

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, path: '/', color: 'slate' },
  { label: 'Meal Plans', icon: Utensils, path: '/plans/meal', color: 'amber' },
  { label: 'Training Plans', icon: Dumbbell, path: '/plans/training', color: 'blue' },
  { label: 'Daily Log', icon: Calendar, path: '/daily', color: 'teal' },
  { label: 'Shopping List', icon: ShoppingCart, path: '/shopping-list', color: 'orange' },
  { label: 'Metrics', icon: TrendingUp, path: '/metrics', color: 'purple' },
  { label: 'History', icon: History, path: '/history', color: 'gray' },
  { label: 'Analysis', icon: BarChart3, path: '/adherence-analysis', color: 'indigo' },
];

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Don't show on onboarding
  if (location.pathname === '/onboarding') {
    return null;
  }

  return (
    <aside className="
      hidden md:flex
      fixed left-0 top-0 bottom-0
      w-64
      bg-neutral-50
      border-r border-neutral-200
      flex-col
      z-40
    ">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <h1 className="text-lg font-semibold text-neutral-900">
          Health System
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          AI-Powered Planning
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const theme = COLOR_THEMES[item.color];

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`
                  flex items-center gap-3
                  w-full px-3 py-2.5 rounded-lg
                  text-sm font-medium
                  transition-colors duration-150
                  cursor-pointer
                  border
                  ${active
                    ? `${theme.activeBg} ${theme.activeBorder} ${theme.activeText}`
                    : 'text-neutral-700 hover:bg-neutral-100 border-transparent'
                  }
                `}
              >
                <Icon className={`
                  w-5 h-5
                  ${active ? theme.activeIcon : theme.icon}
                `} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer - Profile link */}
      <div className="p-4 border-t border-neutral-200 space-y-1">
        <button
          onClick={() => navigate('/profile')}
          className={`
            flex items-center gap-3
            w-full px-3 py-2.5 rounded-lg
            text-sm font-medium
            transition-colors duration-150
            cursor-pointer
            border
            ${location.pathname.startsWith('/profile')
              ? 'bg-emerald-100 border-emerald-600 text-emerald-900'
              : 'text-neutral-700 hover:bg-neutral-100 border-transparent'
            }
          `}
        >
          <User className={`w-5 h-5 ${location.pathname.startsWith('/profile') ? 'text-emerald-700' : 'text-emerald-600'}`} />
          <span>Profile</span>
        </button>
        <div className="text-xs text-neutral-400 text-center mt-3">
          v1.0.0 • Offline-First
        </div>
      </div>
    </aside>
  );
}
