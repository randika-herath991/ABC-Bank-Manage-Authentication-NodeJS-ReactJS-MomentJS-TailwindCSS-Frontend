import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFilter, FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as docx from 'docx';
import { saveAs } from 'file-saver';

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    aId: '',
    aNumber: '',
    aBalance: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [pages, setPages] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

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
      .then(res => {
        setAccounts(res.data.body);
        setFilteredAccounts(res.data.body);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching accounts', error);
        setError('Failed to load accounts');
        setLoading(false);
      });
  }, []);

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

        return true;
      });
    });
    setFilteredAccounts(filtered);
    setPagination(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [filters, accounts]);

  const handleViewAccount = (aId) => {
    setTimeout(() => navigate(`/viewadminaccount/${aId}`), 2000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Arial', 'normal');
    doc.text('ABC Bank System', 14, 10);
    const tableColumns = ['Account ID', 'Account Number', 'Account Balance'];
    const tableRows = filteredAccounts.map((account) => [account.aId, account.aNumber, account.aBalance]);
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
    worksheet.addRow(['Account ID', 'Account Number', 'Account Balance']);
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
                  ],
                }),
                ...filteredAccounts.map((account) => (
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(account.aId.toString())] }),
                      new TableCell({ children: [new Paragraph(account.aNumber)] }),
                      new TableCell({ children: [new Paragraph(account.aBalance.toString())] }),
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
            href="/admin"
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
    </div>
  );
}