import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('All');

  useEffect(() => {
    axios.get('https://backend-gdg.vercel.app/api/users').then(res => setUsers(res.data));
  }, []);

  const filtered = users.filter(u =>
    filterRole === 'All' ? true : u.role === filterRole
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>
      <div className="mb-4">
        <label className="mr-2">Filter by Role:</label>
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          <option>User</option>
          <option>Service-Provider</option>
          <option>Guard</option>
        </select>
      </div>
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
