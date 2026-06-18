import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarOpen} onToggle={toggleSidebar} />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]'}`}>
        <Header onMenuToggle={toggleSidebar} />

        <main className="p-6 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
