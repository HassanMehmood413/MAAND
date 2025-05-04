// src/components/ProviderRegisterForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProviderRegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    cnic: "",
    cnicPicFront: null,
    cnicPicBack: null,
    userPic: null,
    service: "",
    category: "",
    price: ""
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Simple validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.cnic.trim()) {
      newErrors.cnic = "CNIC is required";
    } else if (!/^[0-9]{5}-[0-9]{7}-[0-9]$/.test(formData.cnic)) {
      newErrors.cnic = "Invalid CNIC format (XXXXX-XXXXXXX-X)";
    }
    if (!formData.cnicPicFront) {
      newErrors.cnicPicFront = "CNIC front image is required";
    }
    if (!formData.cnicPicBack) {
      newErrors.cnicPicBack = "CNIC back image is required";
    }
    if (!formData.userPic) {
      newErrors.userPic = "User picture is required";
    }
    if (!formData.service.trim()) {
      newErrors.service = "Service is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }
    return newErrors;
  };

  // Handle form submission using FormData to upload files
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      const dataToSend = new FormData();
      dataToSend.append("email", formData.email);
      dataToSend.append("cnic", formData.cnic);
      dataToSend.append("cnicPicFront", formData.cnicPicFront);
      dataToSend.append("cnicPicBack", formData.cnicPicBack);
      dataToSend.append("userPic", formData.userPic);
      dataToSend.append("service", formData.service);
      dataToSend.append("category", formData.category);
      dataToSend.append("price", formData.price);

      try {
        const res = await axios.post("https://backend-gdg.vercel.app/api/provider/register", dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        console.log("Provider Registration Submitted:", res.data);
        setShowModal(true);
      } catch (error) {
        console.error("Error registering provider:", error.response?.data || error.message);
        setErrors({ submit: error.response?.data.message || "Registration failed" });
      }
    }
  };

  // Handle modal OK click: close modal and navigate to Home page
  const handleModalOk = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="w-full max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Register as Service Provider</h1>
      <p className="text-gray-600 mb-8">Fill in your details to get started</p>
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={`mb-4 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email}</p>}

        {/* CNIC Field */}
        <label htmlFor="cnic" className="block mb-2 text-sm font-medium text-gray-700">
          CNIC
        </label>
        <input
          type="text"
          id="cnic"
          name="cnic"
          placeholder="XXXXX-XXXXXXX-X"
          value={formData.cnic}
          onChange={handleChange}
          className={`mb-4 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.cnic ? "border-red-500" : ""}`}
        />
        {errors.cnic && <p className="text-red-500 text-xs mb-2">{errors.cnic}</p>}

        {/* CNIC Picture Front */}
        <label htmlFor="cnicPicFront" className="block mb-2 text-sm font-medium text-gray-700">
          CNIC Picture (Front)
        </label>
        <input
          type="file"
          id="cnicPicFront"
          name="cnicPicFront"
          onChange={handleChange}
          className={`mb-4 w-full ${errors.cnicPicFront ? "border-red-500" : ""}`}
        />
        {errors.cnicPicFront && <p className="text-red-500 text-xs mb-2">{errors.cnicPicFront}</p>}

        {/* CNIC Picture Back */}
        <label htmlFor="cnicPicBack" className="block mb-2 text-sm font-medium text-gray-700">
          CNIC Picture (Back)
        </label>
        <input
          type="file"
          id="cnicPicBack"
          name="cnicPicBack"
          onChange={handleChange}
          className={`mb-4 w-full ${errors.cnicPicBack ? "border-red-500" : ""}`}
        />
        {errors.cnicPicBack && <p className="text-red-500 text-xs mb-2">{errors.cnicPicBack}</p>}

        {/* User Picture */}
        <label htmlFor="userPic" className="block mb-2 text-sm font-medium text-gray-700">
          Your Picture
        </label>
        <input
          type="file"
          id="userPic"
          name="userPic"
          onChange={handleChange}
          className={`mb-4 w-full ${errors.userPic ? "border-red-500" : ""}`}
        />
        {errors.userPic && <p className="text-red-500 text-xs mb-2">{errors.userPic}</p>}

        {/* Service Provided */}
        <label htmlFor="service" className="block mb-2 text-sm font-medium text-gray-700">
          Service Provided
        </label>
        <input
          type="text"
          id="service"
          name="service"
          placeholder="e.g., Plumbing, Cleaning"
          value={formData.service}
          onChange={handleChange}
          className={`mb-4 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.service ? "border-red-500" : ""}`}
        />
        {errors.service && <p className="text-red-500 text-xs mb-2">{errors.service}</p>}

        {/* Category */}
        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`mb-4 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.category ? "border-red-500" : ""}`}
        >
          <option value="">Select Category</option>
          <option value="household">House Hold Work</option>
          <option value="outside">Outside Work</option>
          <option value="automechanics">AutoMechanics Work</option>
          <option value="electric">Electric Work</option>
        </select>
        {errors.category && <p className="text-red-500 text-xs mb-2">{errors.category}</p>}

        {/* Price */}
        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="text"
          id="price"
          name="price"
          placeholder="Enter your price range"
          value={formData.price}
          onChange={handleChange}
          className={`mb-6 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.price ? "border-red-500" : ""}`}
        />
        {errors.price && <p className="text-red-500 text-xs mb-2">{errors.price}</p>}

        {/* Register Button */}
        <button
          type="submit"
          className="w-full py-2 mb-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Become Service Provider
        </button>
      </form>

      {/* (Optional) Display submission error */}
      {errors.submit && <p className="text-red-500 text-xs mb-2">{errors.submit}</p>}

      {/* Verification Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white rounded-lg p-6 z-10 max-w-sm mx-auto text-center">
            <p className="text-gray-800 mb-4">
              Verification has been sent to the authority.
            </p>
            <button
              onClick={handleModalOk}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderRegisterForm;