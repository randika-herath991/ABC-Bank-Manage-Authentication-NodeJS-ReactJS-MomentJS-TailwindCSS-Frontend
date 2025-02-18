import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userEditImg from '../assets/user_update1.jpg'
import user1Img from '../assets/free-user.png'
import { Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaUnlock, FaAddressBook, FaRegUserCircle, FaUpload } from 'react-icons/fa';

export default function Edituser() {
    const [fName, setfirstName] = useState('');
    const [lName, setlastName] = useState('');
    const [addres, setaddress] = useState('');
    const [userEmail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(user1Img);
    const { uId } = useParams();
    const [userImage, setUserImage] = useState(null);

    const navigate = useNavigate();

    var jwt = localStorage.getItem("jwt");

    const fetchUserImage = (userId) => {
        axios.get(`http://localhost:8080/bankusers/${userId}/image`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            responseType: 'arraybuffer',
        })
            .then((response) => {
                const imageBlob = new Blob([response.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);
            })
            .catch((error) => {
                console.error('Error fetching user image:', error);
            });
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/bankusers/${uId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            }
        })
            .then((response) => {
                const user = response.data;
                console.log(response.data);
                setfirstName(user.fName);
                setlastName(user.lName);
                setaddress(user.addres);
                setEmail(user.userEmail);
                setType(user.type);
                setPassword(user.password);
                fetchUserImage(user.uId);
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
                toast.error('Failed to fetch user data!');
            });
    }, [uId]);

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

    const handleUpdate = () => {
        if (!validateForm()) return;

        const updatedUser = new FormData();
        updatedUser.append("fName", fName);
        updatedUser.append("lName", lName);
        updatedUser.append("addres", addres);
        updatedUser.append("userEmail", userEmail);
        updatedUser.append("password", password);
        updatedUser.append("type", type);
        if (userImage) updatedUser.append("file", userImage);

        setIsLoading(true);
        axios.put(`http://localhost:8080/updatebankusers/${uId}`, updatedUser, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                setIsLoading(false);
                toast.success('User updated successfully!');
                setTimeout(() => navigate("/user"), 2000);
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('Error updating user:', error.response || error.message);
                toast.error('Failed to update user!');
            });

    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUserImage(file);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
            <div className="hidden sm:block">
                <img className="w-full h-full object-cover" src={userEditImg} alt="" />
            </div>
            <div className="bg-violet-200 flex flex-col justify-center">
                <form
                    className="max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate();
                    }}
                >
                    <h2 className="text-3xl dark:text-black font-bold text-center">Update User Details</h2>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>Profile Image</label>
                        <center>
                            <img
                                src={userImage ? URL.createObjectURL(userImage) : imageUrl}
                                className="w-40 h-40 object-cover rounded-full border-4 border-violet-500 hover:scale-105 shadow-xl"
                                alt="User Profile"
                            />
                        </center>
                        <div className="mt-2">
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
                                {userImage ? userImage.name : imageUrl ? 'Change Image' : 'No file chosen'}
                                <FaUpload className="absolute right-60 mt-25 transform -translate-y-1/2 text-gray-500" />
                            </label>
                        </div>
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
                            {isLoading ? 'Updating User...' : 'Submit'}
                            <ToastContainer />
                        </button>
                    </div>
                    <Link to="/user">
                        <button className="w-full my-1 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg">
                            Back
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    )
}