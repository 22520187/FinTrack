
import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "../ui/button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-card-dark dark:border-primary-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="hidden font-bold text-xl text-primary-700 sm:inline-block">FinTrack</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-ebony dark:text-white-smoke transition-colors hover:text-primary-600">
            Dashboard
          </Link>
          <Link to="/transactions" className="text-sm font-medium text-ebony dark:text-white-smoke transition-colors hover:text-primary-600">
            Transactions
          </Link>
          <Link to="/categories" className="text-sm font-medium text-ebony dark:text-white-smoke transition-colors hover:text-primary-600">
            Categories
          </Link>
          <Link to="/goals" className="text-sm font-medium text-ebony dark:text-white-smoke transition-colors hover:text-primary-600">
            Goals
          </Link>
          <Link to="/reports" className="text-sm font-medium text-ebony dark:text-white-smoke transition-colors hover:text-primary-600">
            Reports
          </Link>
          <Link to="/settings" className="text-sm font-medium text-ebony dark:text-white-smoke transition-colors hover:text-primary-600">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
          {/* Avatar (shown when logged in) */}
          {/* <Avatar className="h-8 w-8">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar> */}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid gap-2 bg-white dark:bg-card-dark p-6 shadow-lg animate-in slide-in-from-top-5 md:hidden">
          <nav className="grid gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold text-ebony dark:text-white-smoke hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className="flex items-center gap-2 text-lg font-semibold text-ebony dark:text-white-smoke hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Transactions
            </Link>
            <Link
              to="/categories"
              className="flex items-center gap-2 text-lg font-semibold text-ebony dark:text-white-smoke hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link to="/goals" className="text-sm font-medium text-ebony dark:text-white-smoke transition-colors hover:text-primary-600">
            Goals
          </Link>
            <Link
              to="/reports"
              className="flex items-center gap-2 text-lg font-semibold text-ebony dark:text-white-smoke hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reports
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 text-lg font-semibold text-ebony dark:text-white-smoke hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;