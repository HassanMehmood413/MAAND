import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [guests, setGuests] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async (key, url, config = {}) => {
      try {
        const res = await axios.get(url, config);
        return res.data;
      } catch (err) {
        console.error(`Error fetching ${key}:`, err);
        setErrors(prev => ({ ...prev, [key]: err }));
        return [];
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      const [u, p, b, g] = await Promise.all([
        fetchResource('users', 'https://maand-backend.vercel.app/api/users', { withCredentials: true }),
        fetchResource('providers', 'https://maand-backend.vercel.app/api/provider/all'),
        fetchResource('blogs', 'https://maand-backend.vercel.app/api/blogs'),
        fetchResource('guests', 'https://maand-backend.vercel.app/api/guests'),
      ]);
      setUsers(u);
      setProviders(p);
      setBlogs(b);
      setGuests(g);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const renderSection = (title, key, data, renderChart) => (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : errors[key] ? (
        <p className="text-red-500">Failed to load {key}.</p>
      ) : (
        renderChart(data)
      )}
    </div>
  );

  // Compute data
  const providerCategoryData = providers.reduce((acc, prov) => {
    const cat = prov.category || 'Uncategorized';
    const found = acc.find(item => item.category === cat);
    if (found) found.count += 1;
    else acc.push({ category: cat, count: 1 });
    return acc;
  }, []);

  const blogMonthlyData = blogs.reduce((acc, blog) => {
    const month = new Date(blog.createdAt).toLocaleString('default', { month: 'short' });
    const found = acc.find(item => item.month === month);
    if (found) found.count += 1;
    else acc.push({ month, count: 1 });
    return acc;
  }, []);

  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

  return (
    <motion.div
      className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderSection('Total Users', 'users', users, data => (
        <>
          <p className="text-2xl font-bold mb-4">{data.length}</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-5).map(u => (
                <tr key={u._id} className="border-t">
                  <td className="border px-2 py-1">{u._id.slice(-6)}</td>
                  <td className="border px-2 py-1">{u.name}</td>
                  <td className="border px-2 py-1">{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ))}

      {renderSection('Providers by Category', 'providers', providerCategoryData, data => (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}

      {renderSection('Blogs per Month', 'blogs', blogMonthlyData, data => (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="month" outerRadius={60} label>
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}

      {renderSection('Recent Guests', 'guests', guests, data => (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">House ID</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(-5).map(g => (
              <tr key={g._id} className="border-t">
                <td className="border px-2 py-1">{g._id.slice(-6)}</td>
                <td className="border px-2 py-1">{g.name}</td>
                <td className="border px-2 py-1">{g.houseId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </motion.div>
  );
};

export default AdminDashboard;
