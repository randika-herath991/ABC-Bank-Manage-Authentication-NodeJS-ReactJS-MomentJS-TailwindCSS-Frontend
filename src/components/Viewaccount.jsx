import React, { useState, useEffect } from 'react';
import ViewaccImg from '../assets/viewaccnew1.jpg';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMoneyBillWave, FaFileInvoiceDollar } from 'react-icons/fa';
import { RiAccountBox2Fill } from "react-icons/ri";

export default function Viewaccount() {
    const [aIds, setAId] = useState('');
    const [aNumber, setAccountNum] = useState('');
    const [aBalance, setBalance] = useState('');
    const { aId } = useParams();

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
                setAId(account.aId);
                setAccountNum(account.aNumber);
                setBalance(account.aBalance);
            })
            .catch((error) => {
                console.error('Error fetching account:', error);
                toast.error('Failed to fetch account data!');
            });
    }, [aId]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
            <div className="hidden sm:block">
                <img className="w-full h-full object-cover" src={ViewaccImg} alt="" />
            </div>
            <div className="bg-violet-200 flex flex-col justify-center">
                <form
                    className="max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
                >
                    <h2 className="text-3xl dark:text-black font-bold text-center">View Account Details</h2>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>Account ID</label>
                        <RiAccountBox2Fill className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="number"
                            readOnly
                            value={aId}
                            onChange={(e) => setAId(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>Account Number</label>
                        <FaFileInvoiceDollar className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="text"
                            readOnly
                            value={aNumber}
                            onChange={(e) => setAccountNum(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col text-gray-800 py-2">
                        <label>Account Balance</label>
                        <FaMoneyBillWave className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="number"
                            readOnly
                            value={aBalance}
                            onChange={(e) => setBalance(e.target.value)}
                        />
                    </div>
                    <br></br>
                    <Link to="/emploaccount">
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