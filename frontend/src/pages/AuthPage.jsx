import React, { useState } from "react";
import SignUpForm from "../components/form/SignUpForm";
import SignInForm from "../components/form/SignInForm";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import "../style/Auth.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    console.log("JWT Token:", data.token);
    setActiveTab("dashboard");
  };

  const handleSignUpComplete = () => {
    setActiveTab("signin");
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setActiveTab("signin");
  };

  return (
    <div className="contact-section">
      <h1 className="contact-title">Welcome to Haptic</h1>

      <div className="form-box">
        {activeTab === "signin" && <SignInForm onLoginSuccess={handleLogin} />}
        {activeTab === "signup" && <SignUpForm onSignUpComplete={handleSignUpComplete} />}
        {activeTab === "dashboard" && (
          <Dashboard user={user} token={token} onLogout={handleLogout} />
        )}

        {(activeTab === "signin" || activeTab === "signup") && (
          <div style={{ paddingTop: "0.4rem" }}>
            {activeTab === "signin" ? (
              <p style={{ fontSize: "1rem" }}>
                Not a member?{" "}
                <span className="auth-link" onClick={() => setActiveTab("signup")}>
                  Sign up
                </span>
              </p>
            ) : (
              <p style={{ fontSize: "1rem" }}>
                Already have an account?{" "}
                <span className="auth-link" onClick={() => setActiveTab("signin")}>
                  Sign in
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {token && activeTab !== "dashboard" && (
        <div className="token-box">
          <h4>Logged in JWT Token:</h4>
          <textarea readOnly rows={6} style={{ width: "100%" }} value={token} />
        </div>
      )}
    </div>
  );
};

export default AuthPage;
