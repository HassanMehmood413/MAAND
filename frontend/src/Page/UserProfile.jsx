// src/components/UserProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  // Retrieve userInfo from localStorage
  const stored = localStorage.getItem("userInfo");
  const userInfo = stored ? JSON.parse(stored) : null;
  const token = userInfo?.token;
  const email = userInfo?.email;

  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [guests, setGuests] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!token || !email) {
      navigate("/signin");
    }
  }, [token, email, navigate]);

  // Fetch user profile by email
  useEffect(() => {
    if (!token || !email) return;
    (async () => {
      try {
        const res = await axios.get(
          `https://maand-backend.vercel.app/api/users/email/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          gender: data.gender || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          phone: data.phone || "",
          location: data.location || "",
          cnic: data.cnic || "",
        });
      } catch (err) {
        console.error(err);
        setError("Error loading profile");
      }
    })();
  }, [token, email]);

  // Fetch all services and filter for this user
  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const res = await axios.get("https://maand-backend.vercel.app/api/provider/all");
        const allServices = res.data;
        const mine = allServices.filter(
          (s) => String(s.user) === String(user._id)
        );
        setUserServices(mine);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    })();
  }, [user]);

  // Fetch invited guests
  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const res = await axios.get(
          `https://maand-backend.vercel.app/api/guestToHome/invites/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGuests(res.data.invites || []);
      } catch (err) {
        console.error("Error fetching guests:", err);
      }
    })();
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updates = { ...formData };
      delete updates.email; // prevent email change

      const res = await axios.put(
        `https://maand-backend.vercel.app/api/users/${user._id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError("Update failed");
    }
  };

  if (!user) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          User Profile
        </h1>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Profile Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                disabled={!editMode}
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                disabled
                value={formData.email}
                className="w-full mt-1 p-2 border bg-gray-100 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                disabled
                type="password"
                value="********"
                className="w-full mt-1 p-2 border bg-gray-100 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <input
                disabled={!editMode}
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">CNIC</label>
              <input
                disabled
                value={formData.cnic}
                className="w-full mt-1 p-2 border bg-gray-100 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                disabled={!editMode}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <select
                disabled={!editMode}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Location</label>
              <input
                disabled={!editMode}
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Edit/Save Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Services Provided */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Services Provided
          </h2>
          {userServices.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {userServices.map((s) => (
                <li key={s._id}>
                  {s.service} — {s.category} @ {s.price} PKR
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">
              You haven't provided any services yet.
            </p>
          )}
        </div>

        {/* Guests You Invited */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Guests You Invited
          </h2>
          {guests.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {guests.map((g) => (
                <li key={g._id}>{g.guestName}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No guests invited yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
