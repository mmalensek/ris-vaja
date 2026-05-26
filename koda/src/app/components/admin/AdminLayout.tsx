import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { storage } from "../../lib/storage";
import { Button } from "../ui/button";
import { ShoppingBag, Home, Users, BarChart3, Gift, Settings, LogOut, Menu } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser || !storage.isAdmin()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    storage.logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', icon: Home, label: 'Nadzorna plošča' },
    { path: '/admin/customers', icon: Users, label: 'Stranke' },
    { path: '/admin/statistics', icon: BarChart3, label: 'Statistika' },
    { path: '/admin/rewards', icon: Gift, label: 'Nagrade' },
    { path: '/admin/rules', icon: Settings, label: 'Pravila' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-indigo-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">Maestro Loyalty</span>
                <span className="block text-xs text-gray-500">Administracija</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
                <LogOut className="w-4 h-4" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start mt-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Odjava
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
