import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownToDot } from "lucide-react";
import logo from "../assets/logo192.png";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { AuthContext } from "../contexts/AuthContext";
import Lenna from "../assets/Lenna.png";
import LoginRequired from "./LoginRequired";

const Navbar = () => {
  const { isLoggedIn, userID, handleLogout, setIsLoggedIn } =
    useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = (modal, state) => {
    modal === "login"
      ? setIsLoginModalOpen(state)
      : setIsSignUpModalOpen(state);
  };

  const menuItems = [
    { label: "Catalog", href: "/products" },
    { label: "Pricing", href: "/pricing" },
    { label: "Users", href: "/users" },
    { label: "Your Store", href: "/store" },
    // { label: "Use Case", href: "/browse" },
  ];

  const dropdownItems = {
    // "How it works": [
    //   { label: "How Capyod Works", href: "/how-it-works-1" },
    //   { label: "Print On Demand", href: "/how-it-works-2" },
    //   { label: "Capyod Quality Promise", href: "/how-it-works-3" },
    // ],
    // "Need help?": [
    //   { label: "FAQ", href: "/faq" },
    //   { label: "Contact Us", href: "/contact-us" },
    // ],
    // Services: [
    //   { label: "Transfer Product", href: "/TranferProducts" },
    //   { label: "Service 2", href: "/service-2" },
    // ],
  };

  return (
    <div className="relative top-0 left-0 right-0 z-[9999] bg-white shadow-md">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <a href="/">
            <img src={logo} alt="Capyod Logo" className="h-8 w-8" />
          </a>
          <h1 className="text-2xl font-bold">
            <a href="/">
              <span className="text-[#39b75d]">Capyod</span>
            </a>
          </h1>
        </div>
        <ul className="flex font-medium items-center gap-8 text-gray-600 flex-grow ml-20">
          {menuItems.map((item) => (
            <li key={item.label}>
              {item.href === "/store" ? (
                <LoginRequired
                  onSuccess={() => navigate(item.href)} // Điều hướng nếu đăng nhập
                >
                  <span className="hover:text-[#39b75d] cursor-pointer">
                    {item.label}
                  </span>
                </LoginRequired>
              ) : (
                <a href={item.href} className="hover:text-[#39b75d]">
                  {item.label}
                </a>
              )}
            </li>
          ))}
          {Object.keys(dropdownItems).map((key) => (
            <li key={key} className="relative group">
              <a className="hover:text-[#39b75d] cursor-pointer flex items-center">
                {key}{" "}
                {key === "How it works" && (
                  <ArrowDownToDot className="h-4 w-4 ml-2" />
                )}
              </a>
              <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded z-10 opacity-0 transform scale-y-0 group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
                {dropdownItems[key].map((subItem) => (
                  <a
                    key={subItem.label}
                    href={subItem.href}
                    className="block px-4 py-2 text-gray-600 hover:text-[#39b75d]"
                  >
                    {subItem.label}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <img
                src={Lenna}
                alt="Avatar"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={() => navigate("/profile")}
              />
              <button
                onClick={handleLogout}
                className="border border-[#39b75d] text-black px-4 py-2 rounded hover:bg-[#39b75d] hover:text-white transition duration-300"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => toggleModal("login", true)}
                className="border border-[#39b75d] text-black px-4 py-2 rounded hover:bg-[#39b75d] hover:text-white transition duration-300"
              >
                Log In
              </button>
              <button
                onClick={() => toggleModal("signup", true)}
                className="bg-[#39b75d] text-black px-4 py-2 rounded hover:bg-[#6EC207] hover:text-white transition duration-300"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => toggleModal("login", false)}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      )}
      {isSignUpModalOpen && (
        <SignUpModal onClose={() => toggleModal("signup", false)} />
      )}
    </div>
  );
};

export default Navbar;
