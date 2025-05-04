// src/pages/FindServicePage.jsx
import React from "react";
import FindServiceForm from "../Components/FindServiceForm.jsx"; // Adjust the path based on your folder structure
import findServiceIllustration from "../assets/finder.png"; // Add your own placeholder image

const FindServicePage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section: Form */}
      <div className="md:w-1/2 bg-white flex items-center justify-center">
        <FindServiceForm />
      </div>
      {/* Right Section: Illustration / Results */}
      <div className="md:w-1/2 bg-purple-100 flex items-center justify-center p-8">
        <img
          src={findServiceIllustration}
          alt="Find Service Illustration"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default FindServicePage;
