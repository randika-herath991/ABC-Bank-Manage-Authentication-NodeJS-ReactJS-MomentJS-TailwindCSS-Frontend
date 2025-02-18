import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilter, FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as docx from 'docx';
import { saveAs } from 'file-saver';

const Filteredtransactionadmin = ({ stDate, edDate }) => {
    const [datat, setDatat] = useState([]);
    const [filteredDatTransactions, setFilteredDatTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        sourceAccId: '',
        transacDecription: '',
        transacAmount: '',
        transacTime: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [pages, setPages] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    const navigate = useNavigate();

    const jwt = localStorage.getItem("jwt");

    const finalsdate = moment(stDate).format("YYYY-MM-DD h:mm:ss");
    const finaledate = moment(edDate).format("YYYY-MM-DD h:mm:ss");

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        axios({
            method: 'get',
            url: `http://localhost:8080/filterbanktransactionbyDate?stDate=${finalsdate}&edDate=${finaledate}`,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
                'Authorization': `Bearer ${jwt}`,
            }
        })
            .then((res) => {
                setDatat(res.data);
                setFilteredDatTransactions(res.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to load filtered transactions');
                setLoading(false);
            });
    }, [stDate, edDate, jwt]);

    const handleDelete = (tId) => {
        axios({
            method: 'delete',
            url: `http://localhost:8080/transactiondelete/${tId}`,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
                'Authorization': `Bearer ${jwt}`,
            }
        })
            .then((res) => {
                setDatat(datat.filter(transaction => transaction.id !== tId));
                toast.success('Transaction Delete Successfully !');
            })
            .catch((error) => {
                console.error('Error deleting transaction:', error);
                toast.error('Transaction is not Deleted !');
            });
    };

    const toggleFilter = (column) => {
        setActiveFilter(activeFilter === column ? null : column);
    };

    const applyFilter = () => {
        const filtered = datat.filter((transaction) => {
            return Object.keys(filters).every((column) => {
                const filterValue = filters[column];
                if (!filterValue) return true;

                if (column === 'sourceAccId' && !transaction.sourceAccId.toString().includes(filterValue)) return false;
                if (column === 'transacDecription' && !transaction.transacDecription.toString().includes(filterValue)) return false;
                if (column === 'transacAmount' && !transaction.transacAmount.toString().includes(filterValue)) return false;
                if (column === 'transacTime' && !transaction.transacTime.toString().includes(filterValue)) return false;

                return true;
            });
        });
        setFilteredDatTransactions(filtered);
        setPagination(filtered);
    };

    const setPagination = (filtered) => {
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        setPages([...Array(totalPages).keys()].map((i) => i + 1));
    };

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDatTransactions.slice(startIndex, endIndex);
    };

    useEffect(() => {
        applyFilter();
    }, [filters, datat]);

    const handleDeleteConfirmation = (tId) => {
        setTransactionToDelete(tId);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (transactionToDelete) {
            handleDelete(transactionToDelete);
        }
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    const handleViewTransaction = (tId) => {
        setTimeout(() => navigate(`/viewadmintransaction/${tId}`), 2000);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFont('Arial', 'normal');
        doc.text('ABC Bank System', 14, 10);
        const tableColumns = ['Source Account', 'Description', 'Amount', 'Time'];
        const tableRows = filteredDatTransactions.map((transaction) => [transaction.sourceAccId, transaction.transacDecription, transaction.transacAmount, transaction.transacTime]);
        doc.autoTable({
            head: [tableColumns],
            body: tableRows,
            startY: 20,
            theme: 'striped',
        });
        doc.save('transaction_list.pdf');
    };

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transaction List');
        worksheet.addRow(['Source Account', 'Description', 'Amount', 'Time']);
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } };
        worksheet.getRow(1).border = {
            top: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        };
        filteredDatTransactions.forEach((transaction) => {
            const row = [
                transaction.sourceAccId,
                transaction.transacDecription,
                transaction.transacAmount,
                transaction.transacTime,
            ];
            const newRow = worksheet.addRow(row);
            newRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            });
        });
        worksheet.columns = [
            { width: 10 },
            { width: 20 },
            { width: 30 },
            { width: 15 },
            { width: 15 },
            { width: 20 },
            { width: 10 },
        ];
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer]), 'transaction_list.xlsx');
        });
    };

    const exportToWord = () => {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell } = docx;
        const doc = new Document({
            creator: 'ABC Bank System',
            title: 'Transaction List Export',
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            text: "ABC Bank System",
                            heading: docx.HeadingLevel.HEADING_1,
                        }),
                        new Paragraph({
                            text: "",
                        }),
                        new Table({
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph('Source Account')],
                                            shading: { fill: 'D9EAD3' },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph('Description')],
                                            shading: { fill: 'D9EAD3' },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph('Amount')],
                                            shading: { fill: 'D9EAD3' },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph('Time')],
                                            shading: { fill: 'D9EAD3' },
                                        }),
                                    ],
                                }),
                                ...filteredDatTransactions.map((transaction) => (
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(transaction.sourceAccId.toString())] }),
                                            new TableCell({ children: [new Paragraph(transaction.transacDecription)] }),
                                            new TableCell({ children: [new Paragraph(transaction.transacAmount.toString())] }),
                                            new TableCell({ children: [new Paragraph(transaction.transacTime)] }),
                                        ],
                                    })
                                )),
                            ],
                        }),
                    ],
                },
            ],
        });
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, 'transaction_list.docx');
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <br></br>
            <div className="flex">
                <button
                    onClick={exportToExcel}
                    className="bg-green-600 text-white py-2 px-4 rounded flex items-center hover:bg-green-500 transition duration-300"
                >
                    <FaFileExcel className="mr-2" />
                    Export to Excel
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button
                    onClick={exportToPDF}
                    className="bg-red-600 text-white py-2 px-4 rounded flex items-center hover:bg-red-500 transition duration-300"
                >
                    <FaFilePdf className="mr-2" />
                    Export to PDF
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button
                    onClick={exportToWord}
                    className="bg-blue-600 text-white py-2 px-4 rounded flex items-center hover:bg-blue-500 transition duration-300"
                >
                    <FaFileWord className="mr-2" />
                    Export to Word
                </button>
            </div>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full table-auto bg-white border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900"><span title="Filter by Source Account"><FaFilter className="ml-40 cursor-pointer" onClick={() => toggleFilter('sourceAccId')} /></span>Source Account{activeFilter === 'sourceAccId' && (
                                <input
                                    type="number"
                                    value={filters.sourceAccId}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, sourceAccId: e.target.value }))}
                                    className="ml-2 p-1 border rounded"
                                    placeholder="Search by Account ID"
                                />
                            )}</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900"><span title="Filter by Description"><FaFilter className="ml-40 cursor-pointer" onClick={() => toggleFilter('transacDecription')} /></span>Description{activeFilter === 'transacDecription' && (
                                <input
                                    type="text"
                                    value={filters.transacDecription}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, transacDecription: e.target.value }))}
                                    className="ml-2 p-1 border rounded"
                                    placeholder="Search by Description"
                                />
                            )}</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900"><span title="Filter by Transaction Amount"><FaFilter className="ml-40 cursor-pointer" onClick={() => toggleFilter('transacAmount')} /></span>Amount{activeFilter === 'transacAmount' && (
                                <input
                                    type="number"
                                    value={filters.transacAmount}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, transacAmount: e.target.value }))}
                                    className="ml-2 p-1 border rounded"
                                    placeholder="Search by Amount"
                                />
                            )}</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900"><span title="Filter by Transaction Time"><FaFilter className="ml-40 cursor-pointer" onClick={() => toggleFilter('transacTime')} /></span>Time{activeFilter === 'transacTime' && (
                                <input
                                    type="text"
                                    value={filters.transacTime}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, transacTime: e.target.value }))}
                                    className="ml-2 p-1 border rounded"
                                    placeholder="Search by Time"
                                />
                            )}</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4">Loading...</td>
                            </tr>
                        ) :
                            filteredDatTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-500 py-4 text-xl font-semibold">
                                        No Transactions Found<span className="text-xl">❗</span>
                                    </td>
                                </tr>
                            ) : (
                                getPaginatedData().map((transaction) => (
                                    <tr key={transaction.tId} className="bg-white border-b hover:bg-gray-50 transition duration-300 ease-in-out">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.sourceAccId}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4">{transaction.transacDecription}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4">{transaction.transacAmount}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4">{transaction.transacTime}</td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <button
                                                onClick={() => handleViewTransaction(transaction.tId)}
                                                className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                                                title="View"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <button
                                                onClick={() => handleDeleteConfirmation(transaction.tId)}
                                                className="text-red-500 hover:text-red-700 transition duration-300"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <ToastContainer /></button>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
                <div className="pagination-container text-center my-4">
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`px-4 py-2 mx-1 border rounded-full transition-all duration-300 ease-in-out ${currentPage === page
                                ? 'bg-violet-600 text-white shadow-lg'
                                : 'bg-violet-400 text-white hover:bg-violet-500'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Are you sure you want to delete this transaction?</span>
                            <button onClick={handleCancelDelete} className="text-gray-500 hover:text-gray-700">
                                X
                            </button>
                        </div>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                No
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filteredtransactionadmin;