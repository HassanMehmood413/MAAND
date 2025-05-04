import React from "react";
import SignInForm from "../Components/SignInForm.jsx"; 
import placeholderGraphic from "../assets/signinpageside.png";

const SignInPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
        <SignInForm />
    </div>
  );
};

export default SignInPage;
