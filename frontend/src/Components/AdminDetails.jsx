// src/pages/AdminDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Briefcase, FileText, Home } from 'lucide-react';

const AdminDetails = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [uRes, pRes, bRes, gRes] = await Promise.all([
          axios.get('https://backend-gdg.vercel.app/api/users', { withCredentials: true }),
          axios.get('https://backend-gdg.vercel.app/api/provider/all', { withCredentials: true }),
          axios.get('https://backend-gdg.vercel.app/api/blogs', { withCredentials: true }),
          axios.get('https://backend-gdg.vercel.app/api/guests', { withCredentials: true })
        ]);
        setUsers(uRes.data);
        setProviders(pRes.data);
        setBlogs(bRes.data);
        setGuests(gRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      let url = '';
      if (type === 'user') url = `/api/users/${id}`;
      if (type === 'provider') url = `/api/provider/${id}`;
      if (type === 'blog') url = `/api/blogs/${id}`;
      if (type === 'guest') url = `/api/guests/${id}`;
      await axios.delete(url, { withCredentials: true });
      // refresh
      setUsers(prev => prev.filter(u => type !== 'user' || u._id !== id));
      setProviders(prev => prev.filter(p => type !== 'provider' || p._id !== id));
      setBlogs(prev => prev.filter(b => type !== 'blog' || b._id !== id));
      setGuests(prev => prev.filter(g => type !== 'guest' || g._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleAuthorize = async (type, id) => {
    try {
      let url = '';
      let data = {};
      if (type === 'user') {
        url = `/api/users/${id}`;
        data = { authorized: true };
        await axios.put(url, data, { withCredentials: true });
      }
      if (type === 'provider') {
        url = `/api/provider/${id}/authorize`;
        await axios.patch(url, {}, { withCredentials: true });
      }
      // update state
      if (type === 'user') {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, authorized: true } : u));
      }
      if (type === 'provider') {
        setProviders(prev => prev.map(p => p._id === id ? { ...p, authorized: true } : p));
      }
    } catch (err) {
      console.error(err);
      alert('Authorization failed');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const renderTable = (items, type) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2 capitalize">{type}</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name/Title</th>
              <th className="px-4 py-2 text-left">Extra</th>
              <th className="px-4 py-2 text-left">Authorized</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const id = item._id;
              const authorized = item.authorized;
              let name = '';
              let extra = '';
              switch (type) {
                case 'users': name = item.name; extra = item.email; break;
                case 'providers': name = item.service; extra = item.category; break;
                case 'blogs': name = item.title || item._id.slice(-6); extra = new Date(item.createdAt).toLocaleDateString(); break;
                case 'guests': name = item.name; extra = item.houseId; break;
                default: break;
              }
              return (
                <tr key={id} className="border-t">
                  <td className="px-4 py-2">{id.slice(-6)}</td>
                  <td className="px-4 py-2">{name}</td>
                  <td className="px-4 py-2">{extra}</td>
                  <td className="px-4 py-2">{authorized ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 space-x-2">
                    {['users','providers'].includes(type) && !authorized && (
                      <button
                        onClick={() => handleAuthorize(type.slice(0,-1), id)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >Approve</button>
                    )}
                    <button
                      onClick={() => handleDelete(type.slice(0,-1), id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >Delete</button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center">No {type} found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Details</h1>
      {renderTable(users, 'users')}
      {renderTable(providers, 'providers')}
      {renderTable(blogs, 'blogs')}
      {renderTable(guests, 'guests')}
    </div>
  );
};

export default AdminDetails;
