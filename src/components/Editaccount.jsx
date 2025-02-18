import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UpdateaccImg from '../assets/updateaccnew1.jpg';
import { Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserCircle, FaMoneyBillWave, FaFileInvoiceDollar } from 'react-icons/fa';

export default function Editaccount() {
    const [aNumber, setAccountNum] = useState('');
    const [aBalance, setBalance] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { aId } = useParams();

    const navigate = useNavigate();

    var jwt = localStorage.getItem("jwt");

    useEffect(() => {
        axios.get(`http://localhost:8080/bankaccount/${aId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            }
        })
            .then((response) => {
                const account = response.data;
                console.log(response.data);
                setAccountNum(account.aNumber);
                setBalance(account.aBalance);
            })
            .catch((error) => {
                console.error('Error fetching account:', error);
                toast.error('Failed to fetch account data!');
            });
    }, [aId]);

    const validateForm = () => {
        const newErrors = {};
        if (!aNumber) newErrors.aNumber = "Account Number is required.";
        if (!aBalance || aBalance <= 0) newErrors.aBalance = "Account Balance must be greater than zero.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateAccount = () => {
        if (!validateForm()) return;

        const updatedAccount = {
            aNumber,
            aBalance
        };

        setIsLoading(true);
        axios.put(`http://localhost:8080/updatebankaccount/${aId}`, updatedAccount, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((response) => {
                setIsLoading(false);
                toast.success('Account updated successfully!');
                setTimeout(() => navigate("/emploaccount"), 2000);
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('Error updating account:', error.response || error.message);
                toast.error('Failed to update account!');
            });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
            <div className="hidden sm:block">
                <img className="w-full h-full object-cover" src={UpdateaccImg} alt="" />
            </div>
            <div className="bg-violet-200 flex flex-col justify-center">
                <form
                    className="max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateAccount();
                    }}
                >
                    <h2 className="text-3xl dark:text-black font-bold text-center">Update Account Details</h2>
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
                    <div>
                        <button
                            className={`w-full my-5 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating Account...' : 'Submit'}
                            <ToastContainer />
                        </button>
                    </div>
                    <Link to="/emploaccount">
                        <button className="w-full my-1 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg">
                            Back
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    )
}