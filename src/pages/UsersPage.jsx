import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Lenna from "../assets/Lenna.png";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer'
import Table from '../components/Table'
import Navbar2 from '../components/Navbar2'

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Initialize filtered users
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.phoneNumber.includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleRowClick = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div>
        
      <Navbar/>
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
          <h1 className="text-3xl font-bold mb-6">Users</h1>
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded bg-[#F5F3EE]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left"></th>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Phone</th>
                    <th className="p-4 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(user.id)}
                    >
                      <td className="p-4">
                        <img
                          src={Lenna}
                          alt="Avatar"
                          className="h-12 w-12 rounded-full"
                        />
                      </td>
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.phoneNumber || "N/A"}</td>
                      <td className="p-4">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">No users found</h3>
            </div>
          )}
        </div>
      <Footer/>
      <Table/>
      <Navbar2/>
    </div>
  );
};

export default UsersPage;
