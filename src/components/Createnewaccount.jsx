import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatenewImg from '../assets/createnew1.jpg';
import { Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserCircle, FaMoneyBillWave, FaFileInvoiceDollar } from 'react-icons/fa';

export default function Createnewaccount() {
  const [aNumber, setAccountNum] = useState('');
  const [aBalance, setBalance] = useState('');
  const [uId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  var jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    axios({
      method: 'get',
      url: 'http://localhost:8080/bankusers',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
      },
    })
      .then(res => {
        setUsers(res.data.body);
      })
      .catch(err => {
        toast.error("Failed to fetch users.");
      });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!aNumber) newErrors.aNumber = "Account Number is required.";
    if (!aBalance || aBalance <= 0) newErrors.aBalance = "Account Balance must be greater than zero.";
    if (!uId) newErrors.uId = "User ID is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNewAccount = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    console.log("Creating new account...");
    console.log(jwt)
    axios({
      method: "post",
      url: "http://localhost:8080/createbankaccount",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      data: {
        aNumber: aNumber,
        aBalance: aBalance,
        uId: uId
      },
      mode: "cors",
    }).then((res) => {
      console.log("Response:", res.data);
      if (res.data && res.data.body) {
        toast.success("Account Created Successfully!");
        setTimeout(() => navigate("/emplyoeedash"), 2000);
      } else {
        toast.error("Unexpected response structure.");
      }
    }).catch((error) => {
      console.error("Error:", error);
      toast.error("Error creating account: " + error.message);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={CreatenewImg} alt="" />
      </div>
      <div className="bg-violet-200 flex flex-col justify-center">
        <form
          className="max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
          onSubmit={getNewAccount}
        >
          <h2 className="text-3xl dark:text-black font-bold text-center">Please Enter the Details</h2>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Account Number</label>
            <FaFileInvoiceDollar className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="text"
              required
              placeholder="Enter Account Number"
              value={aNumber}
              onChange={(e) => setAccountNum(e.target.value)}
            />
            {errors.aNumber && <p className="text-red-500 text-sm">{errors.aNumber}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Account Balance</label>
            <FaMoneyBillWave className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="number"
              required
              placeholder="Enter Account Balance"
              value={aBalance}
              onChange={(e) => setBalance(e.target.value)}
            />
            {errors.aBalance && <p className="text-red-500 text-sm">{errors.aBalance}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>User ID</label>
            <FaUserCircle className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <select
              required
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              value={uId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="" disabled selected hidden className="text-gray">Select User ID</option>
              {users.map((user) => (
                <option key={user.uId} value={user.uId}>
                  {user.uId}
                </option>
              ))}
            </select>
            {errors.uId && <p className="text-red-500 text-sm">{errors.uId}</p>}
          </div>
          <div>
            <button
              className={`w-full my-5 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Submit'}
              <ToastContainer />
            </button>
          </div>
          <Link to="/emplyoeedash">
            <button className="w-full my-1 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg">
              Back
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}