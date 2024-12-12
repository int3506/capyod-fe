import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";

const LoginRequired = ({ children, onSuccess }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleAction = () => {
    if (isLoggedIn) {
      onSuccess();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <div onClick={handleAction}>{children}</div>
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            onSuccess();
          }}
        />
      )}
    </>
  );
};

export default LoginRequired;
