// src/components/Contact.jsx
import React from "react";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Contact Us
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="text"
                disabled
                value="03098273508"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value="mr.faizan.asim@gmail.com"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600">
          Feel free to reach out if you have any questions or need further assistance.
        </p>
      </main>
    </div>
  );
};

export default Contact;
