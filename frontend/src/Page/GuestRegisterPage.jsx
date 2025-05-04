// src/components/GuestRegisterPage.jsx
import React from 'react';
import GuestRegisterForm from '../Components/GuestRegisterForm.jsx'; // adjust path
import placeholderImage from '../assets/guest_invite.png'; // adjust path

const GuestRegisterPage = () => (
  <div className="flex flex-col md:flex-row min-h-screen">
    <div className="md:w-1/2 bg-white flex items-center justify-center">
      <GuestRegisterForm />
    </div>
    <div className="md:w-1/2 bg-purple-100 flex items-center justify-center p-8">
      <img src={placeholderImage} alt="Guest Invitation" className="max-w-full h-auto" />
    </div>
  </div>
);

export default GuestRegisterPage;