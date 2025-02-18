import React, { useState, useEffect } from 'react';
import loginImg from '../assets/login2.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';

export default function Login() {
  const [userEmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPassword = localStorage.getItem('rememberedPassword');
    const remember = localStorage.getItem('rememberMe') === 'true';
    if (storedEmail && remember) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(remember);
    }
  }, []);

  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\.[a-z]{2,3}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$/;

  const authhandle = () => {
    if (!emailRegex.test(userEmail)) {
      toast.error('Invalid email format');
      return;
    }
    if (!passwordRegex.test(password)) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    if (!userEmail || !password) {
      toast.error('Email and password are required');
      return;
    }

    console.log("login data", userEmail);
    const url = 'http://localhost:8080/authenticate';
    axios.post(url, {
      userEmail: userEmail,
      password: password
    }).then((res) => {
      console.log("response", res.data.body.jwt);
      console.log("user", res.data.body.user.uId);

      localStorage.setItem('jwt', res.data.body.jwt);
      localStorage.setItem('user', JSON.stringify(res.data.body.user));

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', userEmail);
        localStorage.setItem('rememberedPassword', password);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.setItem('rememberMe', 'false');
      }

      if (res.data.body.user.type === 'A') {
        toast.success('Welcome !!! ' + res.data.body.user.fName);
        setTimeout(() => navigate("/admin"), 2000);
      } else if (res.data.body.user.type === 'E') {
        toast.success('Welcome !!! ' + res.data.body.user.fName);
        setTimeout(() => navigate("/emplyoeedash"), 2000);
      } else if (res.data.body.user.type === 'C') {
        toast.success('Welcome !!! ' + res.data.body.user.fName);
        setTimeout(() => navigate("/customerdash"), 2000);
      } else {
        toast.error('Invalid User');
      }
    }).catch((err) => {
      toast.error('Invalid! Please Check Your Email or Password');
    });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block'>
        <img className='w-full h-full object-cover' src={loginImg} alt="" />
      </div>
      <div className='bg-violet-200 flex flex-col justify-center'>
        <form className='max-w-[400px] w-full mx-auto bg-violet-300 p-8 px-8 rounded-lg shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40' onSubmit={handleSubmit((data) => {
          authhandle();
        })}>
          <h2 className='text-3xl dark:text-black font-bold text-center'>Sign in with your Email & Password</h2>

          <div className='flex flex-col text-gray-800 py-2 relative'>
            <label>User Email</label>
            <FaEnvelope className="absolute right-3 mt-14 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              className='rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none'
              {...register("email", {
                pattern: {
                  value: emailRegex,
                  message: 'Invalid email format'
                },
                onBlur: () => trigger("email"),
              })}
              type="email"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={userEmail}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className='flex flex-col text-gray-800 py-2 relative'>
            <label>Password</label>
            <input
              className='rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none'
              {...register("password", {
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                pattern: {
                  value: passwordRegex,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                },
                onBlur: () => trigger("password"),
              })}
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div onClick={togglePasswordVisibility} className="absolute right-3 mt-14 transform -translate-y-1/2 cursor-pointer text-gray-500">
              {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          <div className='flex justify-between text-gray-600 py-2'>
            <label className='flex items-center'>
              <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
              Remember me
            </label>
            <a href="/forgotpassword"><p>Forgot Password</p></a>
          </div>

          <button className='w-full my-5 py-2 bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg' type="submit">
            Sign In
            <ToastContainer />
          </button>
        </form>
      </div>
    </div>
  );
}