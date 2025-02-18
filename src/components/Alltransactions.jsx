import React, { useState } from "react";
import Transactionadmin from "./Transactionadmin";
import Filteredtransactionadmin from "./Filteredtransactionadmin";
import { FaSync } from 'react-icons/fa';

export default function Alltransactions() {
    const [isFiltering, setIsFiltering] = useState('');
    const [stDate, setStDate] = useState('');
    const [edDate, setEdDate] = useState('');

    const AdminFiltering = () => {
        setIsFiltering(true);
        if (isFiltering === true) {
            console.log('filtering');
            console.log('stDate: ' + stDate);
            console.log('edDate: ' + edDate);
        }
    };

    const clearFields = () => {
        setStDate('');
        setEdDate('');
    };

    const handleRefresh = () => {
        setStDate('');
        setEdDate('');
        setIsFiltering('');
    };

    return (
        <div className="container mx-auto p-4">
            <nav className="flex items-center justify-between bg-violet-300 p-6">
                <div className="flex items-center text-black">
                    <span className="font-semibold text-3xl">Transaction List</span>
                </div>
                <div>
                    <a href="/admin" className="inline-block px-4 py-2 leading-none border rounded font-semibold text-lg text-black hover:bg-white hover:text-violet-400">Back</a>
                </div>
            </nav>

            <table className='flex flex-col justify-center items-center py-2'>
                <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
                        <input
                            name="start"
                            type="datetime-local"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Select date start"
                            required
                            value={stDate}
                            onChange={(e) => setStDate(e.target.value)}
                        />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input
                            name="end"
                            type="datetime-local"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Select date end"
                            required
                            value={edDate}
                            onChange={(e) => setEdDate(e.target.value)}
                        />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <button
                            type="submit"
                            onClick={AdminFiltering}
                            className="border w-20 py-2 bg-violet-200 shadow-lg text-black font-semibold rounded-lg">
                            Search
                        </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <button
                            type="button"
                            onClick={clearFields}
                            className="border w-20 py-2 bg-red-200 shadow-lg text-black font-semibold rounded-lg">
                            Clear
                        </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="border w-20 py-2 bg-blue-200 shadow-lg text-black font-semibold rounded-lg flex items-center justify-center">
                            <FaSync className="mr-2" /> Refresh
                        </button>
                    </td>
                </tr>
            </table>

            <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800">
                    All Transactions
                </h3>
            </div>

            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-white border-b"></thead>
                            {isFiltering ? (
                                <Filteredtransactionadmin stDate={stDate} edDate={edDate} />
                            ) : (
                                <Transactionadmin />
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}