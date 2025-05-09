import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-primary-200 bg-white dark:bg-card-dark">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row">
        <p className="text-sm text-primary-600 dark:text-primary-300">
          © {currentYear} MoneyMind. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm text-primary-600 dark:text-primary-300">
          <Link 
            to="/privacy" 
            className="hover:text-primary-800 dark:hover:text-primary-100 transition-colors hover:underline"
          >
            Privacy
          </Link>
          <Link 
            to="/terms" 
            className="hover:text-primary-800 dark:hover:text-primary-100 transition-colors hover:underline"
          >
            Terms
          </Link>
          <Link 
            to="/contact" 
            className="hover:text-primary-800 dark:hover:text-primary-100 transition-colors hover:underline"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;