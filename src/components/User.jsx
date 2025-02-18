import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import user1Img from '../assets/free-user.png'
import { FaFilter, FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import * as docx from 'docx';
import { saveAs } from 'file-saver';

export default function User() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    uId: '',
    fName: '',
    lName: '',
    addres: '',
    userEmail: '',
    type: '',
    active: 'All Status',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [pages, setPages] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [imageUrl, setImageUrl] = useState({});

  const navigate = useNavigate();

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          setUsers(response.data.body);
          setFilteredUsers(response.data.body);
          fetchImages(response.data.body);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load users');
        setLoading(false);
        console.error('Error fetching users:', error);
      });
  }, []);

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

  const deleteUser = (uId) => {
    const jwt = localStorage.getItem('jwt');
    axios
      .delete(`http://localhost:8080/bankusersdelete/${uId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUsers((prevUsers) => prevUsers.filter((user) => user.uId !== uId));
          toast.success('User Delete Successfully!');
        } else {
          toast.error('Failed to delete the user!');
        }
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user!');
      });
  };

  const toggleUserStatus = (uId, currentStatus) => {
    const jwt = localStorage.getItem('jwt');
    const newStatus = !currentStatus;
    axios.patch(
      `http://localhost:8080/bankusers/${uId}/status`,
      { active: newStatus },
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
        if (response.status === 200 && response.data.active !== undefined) {
          const updatedUsers = users.map(user =>
            user.uId === uId ? { ...user, active: newStatus } : user
          );
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          toast.success('User status updated successfully!');
        } else {
          toast.error('Failed to update status!');
        }
      })
      .catch((error) => {
        console.error('Error toggling status:', error.response ? error.response.data : error);
        toast.error('Error toggling user status!');
      });
  };

  const toggleFilter = (column) => {
    setActiveFilter(activeFilter === column ? null : column);
  };

  const applyFilter = () => {
    const filtered = users.filter((user) => {
      return Object.keys(filters).every((column) => {
        const filterValue = filters[column];
        if (!filterValue) return true;

        if (column === 'uId' && !user.uId.toString().includes(filterValue)) return false;
        if (column === 'fName' && !(`${user.fName} ${user.lName}`).toLowerCase().includes(filterValue.toLowerCase())) return false;
        if (column === 'addres' && !user.addres.toLowerCase().includes(filterValue.toLowerCase())) return false;
        if (column === 'userEmail' && !user.userEmail.toLowerCase().includes(filterValue.toLowerCase())) return false;
        if (column === 'type' && !user.type.toLowerCase().includes(filterValue.toLowerCase())) return false;
        if (column === 'status' && filterValue !== 'All Status' && user.active !== (filterValue === 'Active')) return false;

        return true;
      });
    });
    setFilteredUsers(filtered);
    setPagination(filtered);
  };

  const setPagination = (filtered) => {
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    setPages([...Array(totalPages).keys()].map((i) => i + 1));
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  useEffect(() => {
    applyFilter();
  }, [filters, users]);

  const handleDeleteConfirmation = (uId) => {
    setUserToDelete(uId);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
    }
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const handleUpdateUser = (uId) => {
    setTimeout(() => navigate(`/updateuser/${uId}`), 2000);
  };

  const handleViewUser = (uId) => {
    setTimeout(() => navigate(`/viewuser/${uId}`), 2000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Arial', 'normal');
    doc.text('ABC Bank System', 14, 10);
    const tableColumns = ['User ID', 'Name', 'Address', 'Email', 'User Type', 'User Status'];
    const tableRows = filteredUsers.map((user) => [user.uId, `${user.fName} ${user.lName}`, user.addres, user.userEmail, user.type, user.active ? 'Active' : 'Inactive',]);
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      theme: 'striped',
    });
    doc.save('user_list.pdf');
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User List');
    worksheet.addRow(['User ID', 'Name', 'Address', 'Email', 'User Type', 'User Status']);
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } };
    worksheet.getRow(1).border = {
      top: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
    filteredUsers.forEach((user) => {
      const row = [
        user.uId,
        `${user.fName} ${user.lName}`,
        user.addres,
        user.userEmail,
        user.type,
        user.active ? 'Active' : 'Inactive',
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
      saveAs(new Blob([buffer]), 'user_list.xlsx');
    });
  };

  const exportToWord = () => {
    const { Document, Packer, Paragraph, Table, TableRow, TableCell } = docx;
    const doc = new Document({
      creator: 'ABC Bank System',
      title: 'User List Export',
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
                      children: [new Paragraph('User ID')],
                      shading: { fill: 'D9EAD3' },
                    }),
                    new TableCell({
                      children: [new Paragraph('Name')],
                      shading: { fill: 'D9EAD3' },
                    }),
                    new TableCell({
                      children: [new Paragraph('Address')],
                      shading: { fill: 'D9EAD3' },
                    }),
                    new TableCell({
                      children: [new Paragraph('Email')],
                      shading: { fill: 'D9EAD3' },
                    }),
                    new TableCell({
                      children: [new Paragraph('User Type')],
                      shading: { fill: 'D9EAD3' },
                    }),
                    new TableCell({
                      children: [new Paragraph('User Status')],
                      shading: { fill: 'D9EAD3' },
                    }),
                  ],
                }),
                ...filteredUsers.map((user) => (
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(user.uId.toString())] }),
                      new TableCell({ children: [new Paragraph(`${user.fName} ${user.lName}`)] }),
                      new TableCell({ children: [new Paragraph(user.addres)] }),
                      new TableCell({ children: [new Paragraph(user.userEmail)] }),
                      new TableCell({ children: [new Paragraph(user.type)] }),
                      new TableCell({ children: [new Paragraph(user.active ? 'Active' : 'Inactive')] }),
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
      saveAs(blob, 'user_list.docx');
    });
  };

  return (
    <div className="container mx-auto p-4">
      <nav className="flex items-center justify-between bg-violet-300 p-6">
        <div className="flex items-center text-black">
          <span className="font-semibold text-3xl">User List</span>
        </div>
        <div>
          <a href="/admin" className="inline-block px-4 py-2 leading-none border rounded font-semibold text-lg text-black hover:bg-white hover:text-violet-400">Back</a>
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
                <span title="Filter by User ID">
                  <FaFilter className="ml-30 cursor-pointer" onClick={() => toggleFilter('uId')} />
                </span>
                User ID
                {activeFilter === 'uId' && (
                  <input
                    type="number"
                    value={filters.uId}
                    onChange={(e) => setFilters((prev) => ({ ...prev, uId: e.target.value }))}
                    className="ml-2 p-1 border rounded"
                    placeholder="Search by ID"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">User Image</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by Name">
                  <FaFilter className="ml-30 cursor-pointer" onClick={() => toggleFilter('fName')} />
                </span>
                Name
                {activeFilter === 'fName' && (
                  <input
                    type="text"
                    value={filters.fName}
                    onChange={(e) => setFilters((prev) => ({ ...prev, fName: e.target.value }))}
                    className="ml-2 p-1 border rounded"
                    placeholder="Search by First Name"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by Address">
                  <FaFilter className="ml-30 cursor-pointer" onClick={() => toggleFilter('addres')} />
                </span>
                Address
                {activeFilter === 'addres' && (
                  <input
                    type="text"
                    value={filters.addres}
                    onChange={(e) => setFilters((prev) => ({ ...prev, addres: e.target.value }))}
                    className="ml-2 p-1 border rounded"
                    placeholder="Search by Address"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by Email">
                  <FaFilter className="ml-30 cursor-pointer" onClick={() => toggleFilter('userEmail')} />
                </span>
                Email
                {activeFilter === 'userEmail' && (
                  <input
                    type="email"
                    value={filters.userEmail}
                    onChange={(e) => setFilters((prev) => ({ ...prev, userEmail: e.target.value }))}
                    className="ml-2 p-1 border rounded"
                    placeholder="Search by Email"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by User Type">
                  <FaFilter className="ml-30 cursor-pointer" onClick={() => toggleFilter('type')} />
                </span>
                User Type
                {activeFilter === 'type' && (
                  <input
                    type="text"
                    value={filters.type}
                    onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                    className="ml-2 p-1 border rounded"
                    placeholder="Search by User Type"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-900">
                <span title="Filter by User Status">
                  <FaFilter className="ml-30 cursor-pointer" onClick={() => toggleFilter('status')} />
                </span>
                Status
                {activeFilter === 'status' && (
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="ml-2 p-1 border rounded"
                  >
                    <option value="" disabled selected hidden className="text-gray">Select User Status</option>
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No Users<span className="text-xl">❗</span></td>
              </tr>
            ) : (
              getPaginatedData().map((user) => (
                <tr key={user.uId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.uId}</td>
                  <td>
                    <div>
                      <img
                        src={imageUrl[user.uId] ? imageUrl[user.uId] : user1Img}
                        alt="User"
                        width={50}
                        height={50}
                        className="w-20 h-20 object-cover rounded-full border-4 border-violet-500 hover:scale-105 shadow-xl"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{`${user.fName} ${user.lName}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.addres}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.userEmail}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <button
                      onClick={() => toggleUserStatus(user.uId, user.active)}
                      className={`px-4 py-2 rounded ${user.active ? 'bg-green-500' : 'bg-red-500'} text-white`}
                    >
                      {user.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleViewUser(user.uId)}
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
                      onClick={() => handleUpdateUser(user.uId)}
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
                      onClick={() => handleDeleteConfirmation(user.uId)}
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
              <span className="text-lg font-semibold">Are you sure you want to delete this user?</span>
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