import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaFilter, FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as docx from 'docx';
import { saveAs } from 'file-saver';

export default function Emploaccount() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    aId: '',
    aNumber: '',
    aBalance: '',
    accountActive: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [pages, setPages] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const navigate = useNavigate();

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const setPagination = (filtered) => {
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    setPages([...Array(totalPages).keys()].map((i) => i + 1));
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAccounts.slice(startIndex, endIndex);
  };

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
      .then((response) => {
        if (response && response.data && response.data.body) {
          setAccounts(response.data.body);
          setFilteredAccounts(response.data.body);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load accounts');
        setLoading(false);
        console.error('Error fetching accounts:', error);
      });
  }, []);

  const deleteAccount = (aId) => {
    const jwt = localStorage.getItem('jwt');
    axios
      .delete(`http://localhost:8080/bankaccountdelete/${aId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        console.log('Account deleted:', res.data);
        setAccounts((prevAccounts) =>
          prevAccounts.filter((account) => account.aId !== aId)
        );
        toast.success('Account Delete Successfully!');
      })
      .catch((error) => {
        console.error('Error deleting account', error);
        toast.error('Error deleting account!');
      });
  };

  const toggleAccountStatus = (aId, currentStatus) => {
    const jwt = localStorage.getItem('jwt');
    const newStatus = !currentStatus;
    axios.patch(
      `http://localhost:8080/bankaccount/${aId}/accstatus`,
      { accountActive: newStatus },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
        },
      }
    )
      .then((response) => {
        console.log('Backend response:', response);
        if (response.status === 200 && response.data.accountActive !== undefined) {
          const updatedAccounts = accounts.map(account =>
            account.aId === aId ? { ...account, accountActive: newStatus } : account
          );
          setAccounts(updatedAccounts);
          setFilteredAccounts(updatedAccounts);
          toast.success('Account status updated successfully!');
        } else {
          toast.error('Failed to update status!');
        }
      })
      .catch((error) => {
        console.error('Error toggling status:', error.response ? error.response.data : error);
        toast.error('Error toggling account status!');
      });
  };

  const toggleFilter = (column) => {
    setActiveFilter(activeFilter === column ? null : column);
  };

  const applyFilter = () => {
    const filtered = accounts.filter((account) => {
      return Object.keys(filters).every((column) => {
        const filterValue = filters[column];
        if (!filterValue) return true;

        if (column === 'aId' && !account.aId.toString().includes(filterValue)) return false;
        if (column === 'aNumber' && !account.aNumber.toString().includes(filterValue)) return false;
        if (column === 'aBalance' && !account.aBalance.toString().includes(filterValue)) return false;
        if (column === 'accountActive' && filterValue !== 'All Status' && account.accountActive !== (filterValue === 'Active')) return false;

        return true;
      });
    });
    setFilteredAccounts(filtered);
    setPagination(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [filters, accounts]);

  const handleDeleteConfirmation = (aId) => {
    setAccountToDelete(aId);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (accountToDelete) {
      deleteAccount(accountToDelete);
    }
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const handleUpdateAccount = (aId) => {
    setTimeout(() => navigate(`/updateaccount/${aId}`), 2000);
  };

  const handleViewAccount = (aId) => {
    setTimeout(() => navigate(`/viewaccount/${aId}`), 2000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Arial', 'normal');
    doc.text('ABC Bank System', 14, 10);
    const tableColumns = ['Account ID', 'Account Number', 'Account Balance', 'Account Status'];
    const tableRows = filteredAccounts.map((account) => [account.aId, account.aNumber, account.aBalance, account.accountActive ? 'Active' : 'Deactive',]);
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      theme: 'striped',
    });
    doc.save('account_list.pdf');
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Account List');
    worksheet.addRow(['Account ID', 'Account Number', 'Account Balance', 'Account Status']);
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } };
    worksheet.getRow(1).border = {
      top: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
    filteredAccounts.forEach((account) => {
      const row = [
        account.aId,
        account.aNumber,
        account.aBalance,
        account.accountActive ? 'Active' : 'Deactive',
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
      saveAs(new Blob([buffer]), 'account_list.xlsx');
    });
  };

  const exportToWord = () => {
    const { Document, Packer, Paragraph, Table, TableRow, TableCell } = docx;
    const doc = new Document({
      creator: 'ABC Bank System',
      title: 'Account List Export',
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
                      children: [new Paragraph('Account ID')],
                      shading: { fill: 'D9EAD3' },
                    }),
                    new TableCell({
                      children: [new Paragraph('Account Number')],
                      shading: { fill: 'D9EAD3' },
                    }),
                    new TableCell({
                      children: [new Paragraph('Account Balance')],
                      shading: { fill: 'D9EAD3' },
                    }),
                    new TableCell({
                      children: [new Paragraph('Account Status')],
                      shading: { fill: 'D9EAD3' },
                    }),
                  ],
                }),
                ...filteredAccounts.map((account) => (
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(account.aId.toString())] }),
                      new TableCell({ children: [new Paragraph(account.aNumber)] }),
                      new TableCell({ children: [new Paragraph(account.aBalance.toString())] }),
                      new TableCell({ children: [new Paragraph(account.accountActive ? 'Active' : 'Deactive')] }),
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
      saveAs(blob, 'account_list.docx');
    });
  };

  return (
    <div className="container mx-auto p-6">
      <nav className="flex items-center justify-between bg-violet-300 p-6">
        <div className="flex items-center text-black">
          <span className="font-semibold text-3xl">Account List</span>
        </div>
        <div>
          <a
            href="/emplyoeedash"
            className="inline-block px-4 py-2 leading-none border rounded font-semibold text-lg text-black hover:bg-white hover:text-violet-400"
          >
            Back
          </a>
        </div>
      </nav>
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
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by Account ID">
                  <FaFilter className="ml-40 cursor-pointer" onClick={() => toggleFilter('aId')} />
                </span>
                Account ID
                {activeFilter === 'aId' && (
                  <input
                    type="number"
                    value={filters.aId}
                    onChange={(e) => setFilters((prev) => ({ ...prev, aId: e.target.value }))}
                    className="ml-2 p-1 border rounded"
                    placeholder="Search by ID"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by Account Number">
                  <FaFilter className="ml-40 cursor-pointer" onClick={() => toggleFilter('aNumber')} />
                </span>
                Account Number
                {activeFilter === 'aNumber' && (
                  <input
                    type="text"
                    value={filters.aNumber}
                    onChange={(e) => setFilters((prev) => ({ ...prev, aNumber: e.target.value }))}
                    className="ml-2 p-1 border rounded"
                    placeholder="Search by Account Number"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by Balance">
                  <FaFilter className="ml-40 cursor-pointer" onClick={() => toggleFilter('aBalance')} />
                </span>
                Balance
                {activeFilter === 'aBalance' && (
                  <input
                    type="number"
                    value={filters.aBalance}
                    onChange={(e) => setFilters((prev) => ({ ...prev, aBalance: e.target.value }))}
                    className="ml-2 p-1 border rounded"
                    placeholder="Search by Balance"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by Account Status">
                  <FaFilter className="ml-30 cursor-pointer" onClick={() => toggleFilter('accountActive')} />
                </span>
                Status
                {activeFilter === 'accountActive' && (
                  <select
                    value={filters.accountActive}
                    onChange={(e) => setFilters({ ...filters, accountActive: e.target.value })}
                    className="ml-2 p-1 border rounded"
                  >
                    <option value="" disabled selected hidden className="text-gray">Select Account Status</option>
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                  </select>
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No Accounts<span className="text-xl">❗</span></td>
              </tr>
            ) : (
              getPaginatedData().map((account) => (
                <tr key={account.aId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{account.aId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{account.aNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{account.aBalance}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <button
                      onClick={() => toggleAccountStatus(account.aId, account.accountActive)}
                      className={`px-4 py-2 rounded ${account.accountActive ? 'bg-blue-500' : 'bg-yellow-500'} text-white`}
                    >
                      {account.accountActive ? 'Activate' : 'Deactivate'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleViewAccount(account.aId)}
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
                      onClick={() => handleUpdateAccount(account.aId)}
                      className="text-green-500 hover:text-green-700 transition-colors duration-300"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                      </svg>
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                      onClick={() => handleDeleteConfirmation(account.aId)}
                      className="text-red-500 hover:text-red-700 transition duration-300"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <ToastContainer />
                    </button>
                  </td>
                </tr>
              ))
            )}
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
              <span className="text-lg font-semibold">Are you sure you want to delete this account?</span>
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
}