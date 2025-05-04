// src/components/ProviderRegisterPage.jsx
import React from "react";
import ProviderRegisterForm from "../Components/ProviderRegisterForm.jsx";
import placeholderGraphic from "../assets/serviceprovider.png"; // Adjust the path if needed

const ProviderRegisterPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section: Form */}
      <div className="md:w-1/2 bg-white flex items-center justify-center">
        <ProviderRegisterForm />
      </div>
      {/* Right Section: Illustration */}
      <div className="md:w-1/2 bg-purple-100 flex items-center justify-center p-8">
        <img
          src={placeholderGraphic}
          alt="Illustration"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default ProviderRegisterPage;
