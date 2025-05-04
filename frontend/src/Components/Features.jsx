// src/components/Features.js
import React from "react";

const Features = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-gray-900">Expert Doctors</h3>
            <p className="mt-4 text-gray-600">Our team consists of experienced professionals committed to your health.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-gray-900">Advanced Equipment</h3>
            <p className="mt-4 text-gray-600">We use state-of-the-art technology to ensure accurate diagnoses.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-gray-900">Caring Environment</h3>
            <p className="mt-4 text-gray-600">Our friendly staff creates a welcoming and supportive environment.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
