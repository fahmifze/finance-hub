import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PiggyBank,
  TrendingUp,
  Briefcase,
  DollarSign,
  Newspaper,
  RefreshCw,
  Tags,
  User,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const navGroups = [
  {
    label: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Finance',
    items: [
      { path: '/expenses', label: 'Expenses', icon: Receipt },
      { path: '/income', label: 'Income', icon: Wallet },
      { path: '/budget', label: 'Budget', icon: PiggyBank },
      { path: '/recurring', label: 'Recurring', icon: RefreshCw },
    ],
  },
  {
    label: 'Investing',
    items: [
      { path: '/stocks', label: 'Stocks', icon: TrendingUp },
      { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
    ],
  },
  {
    label: 'Tools',
    items: [
      { path: '/currency', label: 'Currency', icon: DollarSign },
      { path: '/news', label: 'News', icon: Newspaper },
      { path: '/categories', label: 'Categories', icon: Tags },
    ],
  },
];

// Flat list for mobile
const mobileNavItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/income', label: 'Income', icon: Wallet },
  { path: '/stocks', label: 'Stocks', icon: TrendingUp },
  { path: '/budget', label: 'Budget', icon: PiggyBank },
];

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 shadow-sm border-b transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-600 hidden sm:block">Finance Hub</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* User dropdown */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <Link
                to="/profile"
                className={`flex items-center gap-2 hover:text-primary-600 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <span className="text-sm font-medium">{user?.firstName}</span>
              </Link>
              <button
                onClick={logout}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {mobileMenuOpen ? (
                <X className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
              ) : (
                <Menu className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 top-[57px]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className={`absolute top-0 left-0 w-64 h-full overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <nav className="p-4 space-y-6">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 px-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {group.label}
                  </p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                          isActive
                            ? isDark
                              ? 'bg-primary-900/30 text-primary-400'
                              : 'bg-primary-50 text-primary-700'
                            : isDark
                              ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}

              {/* Profile link in mobile */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-50'}`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <nav className="hidden md:block w-56 shrink-0">
            <div className={`sticky top-24 rounded-xl shadow-sm border transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {navGroups.map((group, groupIndex) => (
                <div key={group.label} className={groupIndex > 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''}>
                  <p className={`text-xs font-semibold uppercase tracking-wider px-4 pt-4 pb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {group.label}
                  </p>
                  <div className="px-2 pb-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all ${
                            isActive
                              ? isDark
                                ? 'bg-primary-900/30 text-primary-400 font-medium'
                                : 'bg-primary-50 text-primary-700 font-medium'
                              : isDark
                                ? 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Profile at bottom */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    location.pathname === '/profile'
                      ? isDark
                        ? 'bg-primary-900/30 text-primary-400 font-medium'
                        : 'bg-primary-50 text-primary-700 font-medium'
                      : isDark
                        ? 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <User className="w-5 h-5 opacity-70" />
                  <span className="text-sm">Profile</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile Bottom Navigation */}
          <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-40 transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-around py-2">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                      isActive
                        ? isDark ? 'text-primary-400' : 'text-primary-600'
                        : isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
