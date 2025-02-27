import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import user1Img from '../assets/user1.jpg'
import userImg from '../assets/user-creation.png'
import { Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaUnlock, FaAddressBook, FaRegUserCircle, FaUpload } from 'react-icons/fa';

export default function Createnewuser() {
  const [fName, setfirstName] = useState('');
  const [lName, setlastName] = useState('');
  const [addres, setaddress] = useState('');
  const [userEmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(userImg);

  const navigate = useNavigate();

  var jwt = localStorage.getItem("jwt");

  const validateForm = () => {
    const newErrors = {};

    const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\.[a-z]{2,3}$/;
    if (!userEmail || !emailPattern.test(userEmail)) {
      newErrors.userEmail = "Invalid email address.";
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$/;
    if (!password || !passwordPattern.test(password)) {
      newErrors.password = "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
    }

    if (!fName) newErrors.fName = "First name is required.";
    if (!lName) newErrors.lName = "Last name is required.";
    if (!addres) newErrors.addres = "Address is required.";
    if (!type) newErrors.type = "User type is required.";

    if (!userImage) {
      newErrors.userImage = "Profile image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNewUser = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    console.log("Creating new user...");
    console.log(jwt);

    const formData = new FormData();
    formData.append("fName", fName);
    formData.append("lName", lName);
    formData.append("addres", addres);
    formData.append("userEmail", userEmail);
    formData.append("password", password);
    formData.append("type", type);
    if (userImage) formData.append("file", userImage);

    axios({
      method: "post",
      url: "http://localhost:8080/createbankusers",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      mode: "cors",
    })
      .then((res) => {
        console.log("Response:", res.data);
        if (res.data && res.data.body) {
          toast.success("User Created Successfully!");
          setTimeout(() => navigate("/admin"), 2000);
        } else {
          toast.error("Unexpected response structure.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error creating user: " + error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleImageChange = (e) => {
    setUserImage(e.target.files[0]);
  };

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={user1Img} alt="" />
      </div>
      <div className="bg-violet-200 flex flex-col justify-center">
        <form
          className="max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
          onSubmit={getNewUser}
        >
          <h2 className="text-3xl dark:text-black font-bold text-center">Please Enter the Details</h2>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Profile Image</label>
            <div className="mt-2">
              <center>
                <img
                  src={userImage ? URL.createObjectURL(userImage) : userImg}
                  className="w-40 h-40 object-cover rounded-full border-4 border-violet-500 hover:scale-105 shadow-xl"
                  alt="User Profile"
                />
              </center>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="mt-2 p-2 rounded-lg bg-violet-200 focus:outline-none cursor-pointer block text-center"
              >
                {userImage ? userImage.name : imageUrl ? 'Upload Image' : 'No file chosen'}
                <FaUpload className="absolute right-60 mt-25 transform -translate-y-1/2 text-gray-500" />
              </label>
            </div>
            {errors.userImage && <p className="text-red-500 text-sm">{errors.userImage}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>First Name</label>
            <FaUser className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="text"
              required
              placeholder="Enter First Name"
              value={fName}
              onChange={(e) => setfirstName(e.target.value)}
            />
            {errors.fName && <p className="text-red-500 text-sm">{errors.fName}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Last Name</label>
            <FaUser className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="text"
              required
              placeholder="Enter Last Name"
              value={lName}
              onChange={(e) => setlastName(e.target.value)}
            />
            {errors.lName && <p className="text-red-500 text-sm">{errors.lName}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Address</label>
            <FaAddressBook className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="text"
              required
              placeholder="Enter Address"
              value={addres}
              onChange={(e) => setaddress(e.target.value)}
            />
            {errors.addres && <p className="text-red-500 text-sm">{errors.addres}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>User Email</label>
            <FaEnvelope className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="email"
              required
              placeholder="Enter User Email"
              value={userEmail}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.userEmail && <p className="text-red-500 text-sm">{errors.userEmail}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Password</label>
            <div onClick={togglePasswordVisibility} className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500 cursor-pointer">
              {passwordVisible ? <FaUnlock size={20} /> : <FaLock size={20} />}
            </div>
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type={passwordVisible ? "text" : "password"}
              required
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>User Type</label>
            <FaRegUserCircle className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <select
              required
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled selected hidden className="text-gray">Select User Type</option>
              <option value="A">A</option>
              <option value="C">C</option>
              <option value="E">E</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>
          <div>
            <button
              className={`w-full my-5 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating User...' : 'Submit'}
              <ToastContainer />
            </button>
          </div>
          <Link to="/admin">
            <button className="w-full my-1 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg">
              Back
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}