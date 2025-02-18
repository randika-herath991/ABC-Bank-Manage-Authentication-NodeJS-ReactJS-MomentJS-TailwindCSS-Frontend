import React, { useState, useEffect } from 'react';
import ViewtransacImg from '../assets/view_transaction.jpg';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFileInvoiceDollar, FaAudioDescription } from 'react-icons/fa';
import { LuBookType } from "react-icons/lu";
import { BsCalendarDateFill } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoIdCardSharp } from "react-icons/io5";
import { FaIdBadge } from "react-icons/fa6";

export default function Viewadmintransaction() {
  const [sourceAccId, setAccountNumber] = useState('');
  const [transacDecription, setDescription] = useState('');
  const [transacAmount, setAmount] = useState('');
  const [transacTime, setDateTime] = useState('');
  const [destinationAccId, setTransferAcc] = useState('');
  const [transacType, setTransacType] = useState('');
  const [tIds, setTransactionId] = useState('');
  const { tId } = useParams();

  var jwt = localStorage.getItem("jwt");

  useEffect(() => {
    axios.get(`http://localhost:8080/banktransaction/${tId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    })
      .then((response) => {
        const transaction = response.data;
        console.log(response.data);
        setAccountNumber(transaction.sourceAccId);
        setDescription(transaction.transacDecription);
        setAmount(transaction.transacAmount);
        setDateTime(transaction.transacTime);
        setTransferAcc(transaction.destinationAccId);
        setTransacType(transaction.transacType);
        setTransactionId(transaction.tId);
      })
      .catch((error) => {
        console.error('Error fetching transaction:', error);
        toast.error('Failed to fetch transaction data!');
      });
  }, [tId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={ViewtransacImg} alt="" />
      </div>
      <div className="bg-violet-200 flex flex-col justify-center">
        <form
          className="max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
        >
          <h2 className="text-3xl dark:text-black font-bold text-center">View Transaction Details</h2>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Transaction ID</label>
            <FaIdBadge className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="number"
              readOnly
              value={tId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Source Account Number</label>
            <FaFileInvoiceDollar className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="number"
              readOnly
              value={sourceAccId}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Destination Account Number</label>
            <IoIdCardSharp className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="number"
              readOnly
              value={destinationAccId}
              onChange={(e) => setTransferAcc(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Transaction Description</label>
            <FaAudioDescription className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="text"
              readOnly
              value={transacDecription}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Transaction Amount</label>
            <MdAccountBalanceWallet className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="number"
              readOnly
              value={transacAmount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Date/Time</label>
            <BsCalendarDateFill className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="text"
              readOnly
              value={transacTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Transaction Type</label>
            <LuBookType className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="text"
              readOnly
              value={transacType}
              onChange={(e) => setTransacType(e.target.value)}
            />
          </div>
          <br></br>
          <Link to="/alltransaction">
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