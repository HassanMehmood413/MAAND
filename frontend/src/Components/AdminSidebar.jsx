// src/Components/AdminSidebar.jsx
import React from "react";

const AdminSidebar = ({ selectedOption, setSelectedOption }) => {
  const menuItems = [
    { id: "users", label: "Registered Users" },
    { id: "userRequests", label: "User Requests" },
    { id: "providers", label: "Service Providers" },
    { id: "providerApplications", label: "Provider Applications" },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-purple-600">Admin Panel</h2>
      </div>
      <ul className="mt-4">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setSelectedOption(item.id)}
            className={`cursor-pointer p-4 border-b hover:bg-gray-200 ${
              selectedOption === item.id ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
