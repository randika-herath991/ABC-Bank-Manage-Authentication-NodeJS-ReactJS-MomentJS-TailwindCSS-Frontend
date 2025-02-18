import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Forgot1Img from "../assets/forgot1.jpg";
import { FaEnvelope } from 'react-icons/fa';

export default function ForgotPassword() {
  const [userEmail, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail) {
      setEmailError("Email is required.");
      toast.error("Email is required.");
      return;
    }
    if (!emailRegex.test(userEmail)) {
      setEmailError("Invalid email address.");
      toast.error("Invalid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset email sent!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send email. Please try again later.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={Forgot1Img} alt="" />
      </div>
      <div className="w-full h-full object-cover bg-violet-200 flex flex-col justify-center">
        <form
          className="max-w-[400px] w-full mx-auto bg-violet-300 p-10 px-10 rounded-lg shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl dark:text-black font-bold text-center">
            Forgot Your Password
          </h2>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Enter Your Email</label>
            <FaEnvelope className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="email"
              value={userEmail}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <button
            className="w-full my-5 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg"
            type="submit"
          >
            Send
          </button>

          <Link to="/">
            <button className="w-full my-1 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg">
              Back<ToastContainer />
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}