import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Wallet,
  BarChart3,
  Settings,
  Paintbrush,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const StorePage = () => {
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);

  const menuItems = [
    // { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
    // { id: 'catalog', label: 'Catalog', icon: Package, path: 'catalog' },
    {
      id: "products",
      label: "My Products",
      icon: ShoppingBag,
      path: "products",
    },
    { id: "orders", label: "Orders", icon: Truck, path: "orders" },
    { id: "wallet", label: "Wallet", icon: Wallet, path: "wallet" },
    // { id: 'insights', label: 'Insights', icon: BarChart3, path: 'insights' },
    // { id: 'settings', label: 'Store Settings', icon: Settings, path: 'settings' },
    // { id: 'branding', label: 'Branding', icon: Paintbrush, path: 'branding' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Store Dropdown */}
          {/* <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Package size={20} />
                <span>My New Store</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isStoreDropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7 10l5 5 5-5H7z"
                />
              </svg>
            </button>
          </div> */}

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${
                      isActive
                        ? "bg-[#39b75d] text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white p-6">
          <Outlet /> {/* Render the nested route content here */}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
