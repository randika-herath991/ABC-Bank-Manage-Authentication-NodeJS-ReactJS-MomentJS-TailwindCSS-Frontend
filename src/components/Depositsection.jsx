import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DepositImg from '../assets/deposit1.jpg'
import { Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFileInvoiceDollar, FaMoneyBillWave, FaAudioDescription } from 'react-icons/fa';
import { TbTransactionDollar } from "react-icons/tb";
import { BsCalendarDateFill } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";
import { LuBookType } from "react-icons/lu";

export default function Depositsection() {
  const [sourceAccId, setAccountNumber] = useState('');
  const [transacDecription, setDescription] = useState('');
  const [transacAmount, setAmount] = useState('');
  const [transacTime, setDateTime] = useState('');
  const [destinationAccId, setTransferAcc] = useState('');
  const [transacType, setTransacType] = useState('');
  const [aId, setAccountId] = useState('');
  const transObj = localStorage.getItem('transaction')
  const tansaction = JSON.parse(transObj);
  const Listaccounts = tansaction.account;
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  var jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    axios({
      method: 'get',
      url: 'http://localhost:8080/banktransaction',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
      },
    })
      .then(res => {
        setTransactions(res.data.body);
      })
      .catch(err => {
        toast.error("Failed to fetch account numbers.");
      });
  }, []);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    axios({
      method: 'get',
      url: 'http://localhost:8080/bankaccount',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
      },
    })
      .then(res => {
        setAccounts(res.data.body);
      })
      .catch(err => {
        toast.error("Failed to fetch account IDs.");
      });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!sourceAccId) newErrors.sourceAccId = "Account Number is required.";
    if (!transacDecription) newErrors.transacDecription = "Transaction Description is required.";
    if (!transacAmount || transacAmount <= 0) newErrors.transacAmount = "Transaction Amount must be greater than zero.";
    if (!destinationAccId) newErrors.destinationAccId = "Deposit Account Number is required.";
    if (!transacTime) newErrors.transacTime = "Transaction Time is required.";
    if (!transacType) newErrors.transacType = "Transaction Type is required.";
    if (!aId) newErrors.aId = "Account ID is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const depositTransaction = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    console.log("Creating deposit...");
    console.log("Account Number:- " + sourceAccId)
    console.log("Transaction Description:- " + transacDecription)
    console.log("Deposit Amount:- " + transacAmount)
    console.log("Transaction Time:- " + transacTime)
    console.log("Deposit Account Number:- " + destinationAccId)
    console.log("Transaction Type:- " + transacType)
    console.log("Account ID:- " + aId)
    console.log(jwt)
    console.log(tansaction)
    console.log(Listaccounts)

    axios({
      method: "post",
      url: "http://localhost:8080/deposit",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      data: {
        sourceAccId: sourceAccId,
        transacDecription: transacDecription,
        transacAmount: transacAmount,
        destinationAccId: destinationAccId,
        transacTime: transacTime,
        transacType: transacType,
        aId: aId,

      },
      mode: "cors",
    }).then((res) => {
      console.log("Response:", res.data);
      if (res) {
        toast.success("Your Deposit Successfully!");
        setTimeout(() => navigate("/customerdash"), 2000);
      } else {
        toast.error("Unexpected response structure.");
      }
    }).catch((error) => {
      console.error("Error:", error);
      toast.error("Error creating deposit transaction: " + error.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={DepositImg} alt="" />
      </div>
      <div className="bg-violet-200 flex flex-col justify-center">
        <form
          className="max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40"
          onSubmit={depositTransaction}
        >
          <h2 className="text-3xl dark:text-black font-bold text-center">Please Enter the Details</h2>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Account ID</label>
            <FaMoneyBillWave className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <select
              required
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              value={aId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              <option value="" disabled selected hidden className="text-gray">Select Account ID</option>
              {accounts.map((account) => (
                <option key={account.aId} value={account.aId}>
                  {account.aId}
                </option>
              ))}
            </select>
            {errors.aId && <p className="text-red-500 text-sm">{errors.aId}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Source Account Number</label>
            <FaFileInvoiceDollar className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="number"
              required
              placeholder="Enter Source Account Number"
              value={sourceAccId}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            {errors.sourceAccId && <p className="text-red-500 text-sm">{errors.sourceAccId}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Transaction Description</label>
            <FaAudioDescription className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="text"
              required
              placeholder="Enter Transaction Description"
              value={transacDecription}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.transacDecription && <p className="text-red-500 text-sm">{errors.transacDecription}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Deposit Amount</label>
            <MdAccountBalanceWallet className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="number"
              required
              placeholder="Enter Deposit Amount"
              value={transacAmount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.transacAmount && <p className="text-red-500 text-sm">{errors.transacAmount}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Deposit Account Number</label>
            <TbTransactionDollar className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="number"
              required
              placeholder="Enter Deposit Account Number"
              value={destinationAccId}
              onChange={(e) => setTransferAcc(e.target.value)}
            />
            {errors.destinationAccId && <p className="text-red-500 text-sm">{errors.destinationAccId}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Date/Time</label>
            <BsCalendarDateFill className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <input
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              type="datetime-local"
              required
              value={transacTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            {errors.transacTime && <p className="text-red-500 text-sm">{errors.transacTime}</p>}
          </div>
          <div className="flex flex-col text-gray-800 py-2">
            <label>Transaction Type</label>
            <LuBookType className="absolute right-60 mt-14 transform -translate-y-1/2 text-gray-500" />
            <select
              required
              className="rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              value={transacType}
              onChange={(e) => setTransacType(e.target.value)}
            >
              <option value="" disabled selected hidden className="text-gray">Select Transaction Type</option>
              <option value="d">d</option>
            </select>
            {errors.transacType && <p className="text-red-500 text-sm">{errors.transacType}</p>}
          </div>
          <div>
            <button
              className={`w-full my-5 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Transfer...' : 'Submit'}
              <ToastContainer />
            </button>
          </div>
          <Link to="/customerdash">
            <button className="w-full my-1 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg">
              Back
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
