import React, { useState, useEffect } from 'react';
import axios from 'axios';
import user1Img from '../assets/profile.png'

export default function Profile() {
  var user = JSON.parse(localStorage.getItem("user"));
  var uId = localStorage.getItem("uId");
  var jwt = localStorage.getItem("jwt");

  const [imageUrl, setImageUrl] = useState({});

  const fetchImages = (usersList) => {
    const jwt = localStorage.getItem('jwt');
    usersList.forEach((user) => {
      axios.get(`http://localhost:8080/bankusers/${user.uId}/image`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
        },
        responseType: 'arraybuffer',
      })
        .then((response) => {
          const imageBlob = new Blob([response.data], { type: 'image/png' });
          const imageUrl = URL.createObjectURL(imageBlob);
          setImageUrl((prevImages) => ({
            ...prevImages,
            [user.uId]: imageUrl,
          }));
        })
        .catch((error) => {
          console.error('Error fetching user image:', error);
        });
    });
  };

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
      .then((response) => {
        if (response && response.data && response.data.body) {
          fetchImages(response.data.body);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const userUrl = `http://localhost:8080/bankusers/${uId}`;
  useEffect(() => {
    axios
      .get(userUrl, { headers: { "Authorization": `Bearer ${jwt}` } })
      .then((response) => {
        if (response && response.data && response.data.body) {
          fetchImages(response.data.body);
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
          <span className="font-semibold text-4xl tracking-tight">Profile</span>
        </div>
        <div className="flex items-center space-x-8">
          <a href="/customerdash" className="inline-block px-6 py-3 text-xl text-white bg-violet-600 hover:bg-violet-400 rounded-lg shadow-lg transition-all duration-300">Back</a>
        </div>
      </nav>

      <div className="flex flex-col items-center my-8">
        <img
          src={imageUrl[user.uId] || user1Img}
          className="p-3 bg-white border-4 border-violet-500 rounded-full max-w-xs shadow-2xl transform hover:scale-105 transition-all duration-300"
          alt="Profile"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-xl max-w-4xl mx-auto p-8 space-y-6">
        <h2 className="text-4xl font-bold text-center text-violet-700">User Information</h2>
        <div className="space-y-4">
          <ProfileDetail label="User ID" value={user.uId || "No User ID"} />
          <ProfileDetail label="Name" value={`${user.fName} ${user.lName}` || "No User Name"} />
          <ProfileDetail label="Residential Address" value={user.addres || "No Address"} />
          <ProfileDetail label="Email" value={user.userEmail || "No User Email"} />
          <ProfileDetail label="Account Number" value={user.bankaccount[0]?.aNumber || "No Account Number"} />
          <ProfileDetail label="Account Balance" value={user.bankaccount[0]?.aBalance || "No Account Balance"} />
          <ProfileDetail label="Account Status" value={user.bankaccount[0]?.accountActive ? 'Active' : 'Deactive'} />
        </div>
      </div>
    </div>
  );
}

const ProfileDetail = ({ label, value }) => (
  <div className="flex justify-between items-center text-lg">
    <span className="font-semibold text-violet-600">{label}:</span>
    <span className="text-gray-700">{value}</span>
  </div>
);