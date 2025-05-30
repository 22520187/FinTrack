import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ebony">
      <Navbar />
      <main className="flex-1 container py-6 md:py-10 mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;