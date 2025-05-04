import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './Page/SignInPage.jsx'; // Adjust the path based on your folder structure
import SignUpPage from './Page/SignUpPage.jsx';
import Home from './Page/Home.jsx';
import ProviderRegisterPage from './Page/ProviderRegisterPage.jsx';
import AdminDashboard from './Page/AdminDashboard.jsx';
import ChatbotPage from './Page/ChatbotPage.jsx';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import UserProfile from './Page/UserProfile.jsx'; // Import the UserProfile component
import SingleUser from './Page/SingleUser.jsx';
import Contact from './Page/Contact.jsx';
import FindService from './Page/FindService.jsx';
import ChatPage from './Page/ChatPage.jsx';
import ChatBox from './Page/ChatBox.jsx';
import AnalysisAdminDashboard from './Page/AnalysisAdminDashboard.jsx';
import AdminDetails from './Components/AdminDetails.jsx';
import FreeMaand from './Components/FreeMaand';
import PersonalizedMaand from './Components/PersonalizedMaand';
import AvatarMaand from './Components/AvatarMaand';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="font-GoogleSans">
        <Navbar />
        <Routes>
          {/* Set the sign in page as the default/homepage  */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<Home />} />

          <Route path="/services" element={<FindService />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route
            path="/provider-register"
            element={
              <ProtectedRoute>
                <ProviderRegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/free-maand"
            element={
              <ProtectedRoute>
                <FreeMaand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personalized-maand"
            element={
              <ProtectedRoute>
                <PersonalizedMaand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/avatar-maand"
            element={
              <ProtectedRoute>
                <AvatarMaand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/:userId"
            element={
              <ProtectedRoute>
                <SingleUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Shaulat"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminDashboard/analysis"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AnalysisAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminDashboard/details"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatting"
            element={
              <ProtectedRoute>
                <ChatBox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/chats"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
//Deploymeny Progress
export default App;
