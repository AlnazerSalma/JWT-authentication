import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = ({ user, token, onLogout }) => {
  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    // Call backend logout to blacklist token
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (err) {
    console.error("Logout error:", err);
  }

  // Clear token from localStorage (if used)
  localStorage.removeItem("token");

  // Call parent logout handler (e.g. to clear token/user from state)
  if (onLogout) onLogout();

  navigate("/auth");
};

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>
        Hello {user?.role === "admin" ? "Admin" : "User"} {user?.name || ""}
      </h1>
      <button
        onClick={handleLogout}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
