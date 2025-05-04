import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  const links = [
    { to: 'analysis', label: 'Analysis' },
    { to: 'details', label: 'Details' },
  ];

  return (
    <div className="flex h-full">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <nav className="space-y-2">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}