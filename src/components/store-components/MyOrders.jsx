import React, { useState, useContext, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import no_product from "../../assets/logo192.png";
import { AuthContext } from "../../contexts/AuthContext";
import OrderItem from "./product/OrderItem";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userID } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/me`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          }},
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) fetchOrders();
  }, [userID]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedProducts(orders.map((order) => order.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">My Orders</h1>
          {/* <button className="border border-[#39b75d] text-black px-4 py-2 rounded hover:bg-gray-50">
            My favorites
          </button>
          <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
            Visit store <span className="text-lg">↗</span>
          </button> */}
        </div>
        <button className="bg-[#2F3321] text-white px-6 py-2 rounded flex items-center gap-2 strong" onClick={() => navigate('/store/products')}>
        <Plus size={20} />
        <span className="text-sm font-semibold">Create Orders</span>
        </button>
      </div>

      {/* Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded bg-[#F5F3EE]"
          />
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : orders.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-center">Order</th>
                <th className="p-4 text-center">Details</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>
            <tbody>
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} onUpdate={fetchOrders} isSelected={selectedProducts.includes(order.id)} onSelect={handleSelectProduct}/>
            ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4 mx-auto w-48 h-48 flex items-center justify-center">
              <img
                src={no_product}
                alt="No orders"
                className="max-w-full h-auto"
              />
            </div>
            <h3 className="text-xl font-semibold mb-4">
              No orders placed yet
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
