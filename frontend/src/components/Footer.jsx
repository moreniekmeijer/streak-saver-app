import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Account deleted successfully");
      setTimeout(() => setMessage(""), 3000);

      logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting your account.");
    }
  };

  return (
    <footer>
      {token && (
        <>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </>
      )}
      {message && <p>{message}</p>}
    </footer>
  );
};

export default Footer;
