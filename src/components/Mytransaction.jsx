import React, { useEffect } from 'react';
import profileImg from '../assets/profile.png';
import axios from 'axios';

export default function MyTransaction() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  var uId = localStorage.getItem("uId");
  var jwt = localStorage.getItem("jwt");

  const pdfexport = () => {
    if (user && user.bankaccount && user.bankaccount[0]) {
      const userId = user.bankaccount[0].aId;
      const url = `http://localhost:8080/bankstransaction/ABC_Transaction/${userId}`;
      console.log("Fetching PDF from:", url);
      axios
        .get(url, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'transaction_details.pdf';
          link.click();
        })
        .catch((error) => {
          console.error("Error downloading the PDF:", error);
        });
    }
  };

  const userUrl = `http://localhost:8080/bankusers/${uId}`;
  useEffect(() => {
    axios
      .get(userUrl, { headers: { "Authorization": `Bearer ${jwt}` } })
      .then((response) => {
        if (response && response.data && response.data.body) {
          console.log(response && response.data && response.data.body);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
      });
  }, [uId, jwt]);

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
      <nav className="flex items-center justify-between p-6 bg-opacity-80 backdrop-blur-md shadow-lg rounded-b-lg">
        <div className="flex items-center text-white">
          <span className="font-semibold text-4xl tracking-tight">User's Transaction</span>
        </div>
        <div className="flex items-center space-x-8">
          <button
            type="button"
            className="inline-block px-6 py-3 text-xl text-white bg-gray-600 hover:bg-gray-400 rounded-lg shadow-lg transition-all duration-300"
            onClick={pdfexport}
          >
            Print
          </button>
          <a
            href="/customerdash"
            className="inline-block px-6 py-3 text-xl text-white bg-violet-600 hover:bg-violet-400 rounded-lg shadow-lg transition-all duration-300"
          >
            Back
          </a>
        </div>
      </nav>

      <div className="flex flex-wrap justify-center my-10">
        <img
          src={profileImg}
          className="p-3 bg-white border-4 border-violet-500 rounded-full max-w-xs shadow-2xl transform hover:scale-105 transition-all duration-300"
          alt="Profile"
        />
      </div>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-4xl font-bold text-center text-violet-700">Transaction Details</h2>
        <div className="space-y-4">
          <TransactionDetail label="Transaction Amount" value={`${user.bankaccount[0]?.transaction[0]?.transacAmount}` || "No Transaction Amount"} />
          <TransactionDetail label="Transaction Descripion" value={`${user.bankaccount[0]?.transaction[0]?.transacDecription}` || "No Transaction Description"} />
          <TransactionDetail label="Transaction Type" value={`${user.bankaccount[0]?.transaction[0]?.transacType}` || "No Transaction Type"} />
          <TransactionDetail label="Source Account ID" value={`${user.bankaccount[0]?.transaction[0]?.sourceAccId}` || "No Source Account ID"} />
          <TransactionDetail label="Destination Account ID" value={`${user.bankaccount[0]?.transaction[0]?.destinationAccId}` || "No Destination Account ID"} />
        </div>
      </div>
    </div>
  );
}

const TransactionDetail = ({ label, value }) => (
  <div className="flex justify-between items-center text-lg">
    <span className="font-semibold text-violet-600">{label}:</span>
    <span className="text-gray-700">{value}</span>
  </div>
);