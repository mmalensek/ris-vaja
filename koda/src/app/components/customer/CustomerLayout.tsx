import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { storage } from "../../lib/storage";
import { Customer } from "../../lib/types";
import { Button } from "../ui/button";
import { ShoppingBag, Home, CreditCard, Gift, ShoppingCart, LogOut, Menu } from "lucide-react";
import { Badge } from "../ui/badge";

interface CustomerLayoutProps {
  children: ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser || storage.isAdmin()) {
      navigate('/login');
      return;
    }

    const customerData = storage.getCustomerByEmail(currentUser);
    if (!customerData) {
      navigate('/login');
      return;
    }

    setCustomer(customerData);
  }, [navigate]);

  const handleLogout = () => {
    storage.logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'gold': return 'bg-yellow-500';
      case 'silver': return 'bg-gray-400';
      case 'bronze': return 'bg-orange-600';
      default: return 'bg-blue-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'gold': return 'Zlati';
      case 'silver': return 'Srebrni';
      case 'bronze': return 'Bronasti';
      default: return 'Osnovni';
    }
  };

  const navItems = [
    { path: '/customer', icon: Home, label: 'Nadzorna plošča' },
    { path: '/customer/points', icon: CreditCard, label: 'Točke zvestobe' },
    { path: '/customer/redeem', icon: Gift, label: 'Unovči točke' },
    { path: '/customer/purchases', icon: ShoppingCart, label: 'Nakupi' },
  ];

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/customer" className="flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Maestro Loyalty</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
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
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                  <Badge className={`${getStatusColor(customer.status)} text-white`}>
                    {getStatusLabel(customer.status)}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

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
                <div className="border-t mt-2 pt-2">
                  <p className="text-sm font-semibold text-gray-900 px-3">{customer.name}</p>
                  <p className="text-xs text-gray-500 px-3">Status: {getStatusLabel(customer.status)}</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Odjava
                  </Button>
                </div>
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
