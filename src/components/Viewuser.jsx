import React, { useState, useEffect } from 'react';
import userViewImg from '../assets/user_view1.jpg'
import user1Img from '../assets/profile.png'
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegIdCard, FaUser, FaEnvelope, FaAddressBook, FaRegUserCircle } from 'react-icons/fa';

export default function Viewuser() {
    const [uIds, setUId] = useState('');
    const [fName, setfirstName] = useState('');
    const [lName, setlastName] = useState('');
    const [addres, setaddress] = useState('');
    const [userEmail, setEmail] = useState('');
    const [type, setType] = useState('');
    const [imageUrl, setImageUrl] = useState(user1Img);
    const { uId } = useParams();

    var jwt = localStorage.getItem("jwt");

    useEffect(() => {
        axios.get(`http://localhost:8080/bankusers/${uId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            }
        })
            .then((response) => {
                const user = response.data;
                console.log(response.data);
                setUId(user.uId);
                setfirstName(user.fName);
                setlastName(user.lName);
                setaddress(user.addres);
                setEmail(user.userEmail);
                setType(user.type);
                fetchUserImage(user.uId);
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
                toast.error('Failed to fetch user data!');
            });
    }, [uId]);

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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
            <div className="hidden sm:block">
                <img className="w-full h-full object-cover" src={userViewImg} alt="" />
            </div>
            <div className="bg-violet-200 flex flex-col justify-center">
                <form
                    className="max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
                >
                    <h2 className="text-3xl dark:text-black font-bold text-center">View User Details</h2>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>User Image</label>
                        <center><img
                            src={imageUrl}
                            className="w-40 h-40 object-cover rounded-full border-4 border-violet-500 hover:scale-105 shadow-xl"
                            alt="User Profile"
                        /></center>
                    </div>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>User ID</label>
                        <FaRegIdCard className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="number"
                            readOnly
                            value={uId}
                            onChange={(e) => setUId(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>First Name</label>
                        <FaUser className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="text"
                            readOnly
                            value={fName}
                            onChange={(e) => setfirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>Last Name</label>
                        <FaUser className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="text"
                            readOnly
                            value={lName}
                            onChange={(e) => setlastName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>Address</label>
                        <FaAddressBook className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="text"
                            readOnly
                            value={addres}
                            onChange={(e) => setaddress(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>User Email</label>
                        <FaEnvelope className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="email"
                            readOnly
                            value={userEmail}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>User Type</label>
                        <FaRegUserCircle className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="text"
                            readOnly
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </div>
                    <br></br>
                    <Link to="/user">
                        <button className="w-full my-1 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg">
                            Back
                            <ToastContainer />
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    )
}