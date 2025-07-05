import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import authService from '../../services/auth.service';

// Component thanh điều hướng với responsive design và authentication
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const isAuthenticated = authService.isAuthenticated();
  
  // Xử lý click vào icon user (điều hướng đến settings hoặc login)
  const handleUserIconClick = () => {
    if (isAuthenticated) {
      navigate('/settings');
    } else {
      navigate('/login');
    }
  };

  // Đóng menu mobile
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navigationItems = [
    { to: "/", label: "Dashboard" },
    { to: "/transactions", label: "Transactions" },
    { to: "/categories", label: "Categories" },
    { to: "/goals", label: "Goals" },
    { to: "/reports", label: "Reports" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="hidden font-bold text-3xl text-primary-700 sm:inline-block">FinTrack</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-ebony transition-colors hover:text-primary-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* User Icon */}
          <button
            onClick={handleUserIconClick}
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors cursor-pointer"
            title={isAuthenticated ? "Go to Settings" : "Login"}
          >
            <User size={20} className="text-primary-700" />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid gap-2 bg-white p-6 shadow-lg animate-in slide-in-from-top-5 md:hidden">
          <nav className="grid gap-4">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 text-lg font-semibold text-ebony hover:text-primary-600"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            
            <button
              onClick={() => {
                handleUserIconClick();
                closeMobileMenu();
              }}
              className="flex items-center gap-2 text-lg font-semibold text-ebony hover:text-primary-600 text-left"
            >
              <User className="h-5 w-5" />
              {isAuthenticated ? "Settings" : "Login"}
            </button>
            
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" asChild>
                  <Link to="/register" onClick={closeMobileMenu}>Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;