// src/components/MainLayout.jsx
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className='h-screen w-screen flex flex-row font-sans'>
      <Sidebar />
      <div className='flex-1 flex flex-col h-full w-full'>
        <Header />
        {/* Outlet renders the child routes (/dashboard, /analytics, etc.) */}
        <Outlet />
      </div>
    </div>
  );
}