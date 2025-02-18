import { Link } from "react-router-dom";
import new1Img from '../assets/new1.jpg'

export default function Confirmpassword() {

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block'>
        <img className='w-full h-full object-cover' src={new1Img} alt="" />
      </div>
      <div className='w-full h-full object-cover bg-violet-200 flex flex-col justify-center'>
        <form className='max-w-[400px] w-full mx-auto bg-violet-300 p-10 px-10 rounded-1g shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40'>
          <h2 className='text-3xl dark:text-black font-bold text-center'>Create your New Password</h2>
          <div className='flex flex-col text-gray-800 py-2'>
            <label>Enter Your New Password</label>
            <input className='rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none' type="text" />
          </div>
          <div className='flex flex-col text-gray-800 py-2'>
            <label>Confirm Your New Password</label>
            <input className='rounded-lg bg-violet-200 mt-2 p-2 focus:border-blue-500 focus:bg-white focus:outline-none' type="text" />
          </div>
          <Link to="/">
            <div><button className='w-full my-5 py-2 bg-light bg-light bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg' type='button' >Create</button></div>
          </Link>
          <Link to="/resetpassword">
            <button className='w-full my-1 py-2 bg-light bg-light bg-violet-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/40 text-black font-semibold rounded-lg'>Back</button>
          </Link>
        </form>

      </div>
    </div>
  );
}