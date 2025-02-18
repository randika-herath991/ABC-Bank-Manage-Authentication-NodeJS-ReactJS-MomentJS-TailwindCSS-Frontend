import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import bank2Img from "../assets/bank2.jpg";
import bank3Img from "../assets/bank3.jpg";
import bank1Img from "../assets/bank1.jpg";
import bank4Img from "../assets/bank4.jpg";
import bank5Img from "../assets/bank5.jpg";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
  console.log(date)

  var user = JSON.parse(localStorage.getItem("user"))
  var username = localStorage.getItem("user");
  var fName = localStorage.getItem("fName")
  var jwt = localStorage.getItem("jwt")

  const navigate = useNavigate();

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
          console.log(response && response.data && response.data.body);
          setUsers(response.data.body);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load users');
        setLoading(false);
        console.error('Error fetching users:', error);
      });
  }, []);

  const outsign = (e) => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    localStorage.removeItem('uId')
    navigate("/")
  }

  const activeUsersCount = users.filter(user => user.active).length;
  const inactiveUsersCount = users.length - activeUsersCount;

  const barChartData = {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [{
      label: 'Number of Users',
      data: [activeUsersCount, inactiveUsersCount],
      backgroundColor: ['#4CAF50', '#F44336'],
    }]
  };

  const doughnutChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [activeUsersCount, inactiveUsersCount],
      backgroundColor: ['#4CAF50', '#F44336'],
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="flex items-center justify-between flex-wrap bg-violet-300 p-6 shadow-lg">
        <div className="flex items-center flex-shrink-0 text-black mr-6">
          <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54"></svg>
          <span className="font-semibold text-3xl tracking-tight">WELCOME {`${user.fName} ${user.lName}`}!
            <h1 className="font-semibold text-xl tracking-tight">Today - {date}</h1>
          </span>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-base lg:flex-grow">
            <a href="#admin-dashboard" className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-lg text-black hover:text-white mr-4">
              Home
            </a>
            <a href="/user" className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-lg text-black hover:text-white mr-4">
              Users
            </a>
            <a href="/account" className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-lg text-black hover:text-white mr-4">
              Accounts
            </a>
            <a href="/alltransaction" className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-lg text-black hover:text-white mr-4">
              Transactions
            </a>
            <a href="/createnewuser" className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-lg text-black hover:text-white">
              Create User
            </a>
          </div>
          <div>
            <a href="/" className="inline-block px-4 py-2 leading-none border rounded font-semibold text-lg text-black border-white hover:border-transparent hover:text-violet-500 hover:bg-white mt-4 lg:mt-0" onClick={outsign}>Log Out</a>
          </div>
        </div>
      </nav>

      <div className="w-full bg-gray-100">
        <AliceCarousel autoPlay autoPlayInterval={1000}>
          <img className="w-full min-h-full object-cover" src={bank1Img} alt="sliderimg" />
          <img className="w-full min-h-full object-cover" src={bank2Img} alt="sliderimg" />
          <img className="w-full min-h-full object-left" src={bank3Img} alt="sliderimg" />
          <img className="w-full min-h-full object-left" src={bank4Img} alt="sliderimg" />
          <img className="w-full min-h-full object-left" src={bank5Img} alt="sliderimg" />
        </AliceCarousel>
      </div>

      <div className="container mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Statistics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '400px' }}>
            <h3 className="text-lg font-semibold mb-4">Active vs Inactive Users Bar Chart Distribution</h3>
            <Bar data={barChartData} options={chartOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '400px' }}>
            <h3 className="text-lg font-semibold mb-4">Active vs Inactive Users Donut Chart Distribution</h3>
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <footer className="mt-auto py-3 bg-gray-200">
        <div className="container mx-auto text-center">
          <span className="text-sm text-gray-500 font-bold">
            &#64; 2024 | ABC Bank System | All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}