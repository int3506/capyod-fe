import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Cookies from "js-cookie";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const { setIsLoggedIn, setUserID } = useContext(AuthContext);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserID(data.sub);
        console.log("Login successful:", data);
        setMessage("Login successful!");
        Cookies.set("accessToken", data.access_token, { expires: 7, path: "/" });
        onLoginSuccess();
        window.location.reload();
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        setMessage(errorData.message || "Login failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Log In</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#39b75d] text-white py-2 rounded hover:bg-[#6EC207] transition duration-300"
          >
            Log In
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-[#39b75d] hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
