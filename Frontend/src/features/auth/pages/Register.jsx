import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import "../../../app/index.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.auth);
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await handleRegister(formData);

    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="auth-page">
      <style>{authStyles}</style>

      <div className="auth-card">
        <div className="auth-brand">
          <span>✦</span> Perplexity
        </div>

        <h1>Create account</h1>

        <p className="auth-subtitle">
          Create an account and start researching.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <label>
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              minLength={2}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              minLength={6}
              required
            />
          </label>

          <small>Password must be at least 6 characters long.</small>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>

          <p>
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const authStyles = `
  .auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #070b14;
    color: #e8f0fe;
    font-family: Inter, system-ui, sans-serif;
    padding: 20px;
  }

  .auth-card {
    width: min(420px, 100%);
    background: #0c1320;
    border: 1px solid #223149;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 25px 80px #0008;
  }

  .auth-brand {
    font-weight: 800;
    font-size: 20px;
    margin-bottom: 28px;
  }

  .auth-brand span {
    color: #63b3ed;
    margin-right: 8px;
  }

  h1 {
    margin: 0;
    font-size: 28px;
  }

  .auth-subtitle {
    color: #8190a8;
    margin: 8px 0 24px;
  }

  .auth-form {
    display: grid;
    gap: 14px;
  }

  .auth-form label {
    display: grid;
    gap: 7px;
    font-size: 13px;
    color: #aab8cc;
  }

  .auth-form input {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #26354e;
    background: #0a111d;
    color: #fff;
    outline: none;
  }

  .auth-form input:focus {
    border-color: #63b3ed;
  }

  .auth-form button {
    padding: 12px;
    border: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, #63b3ed, #4fd1c5);
    font-weight: 800;
    cursor: pointer;
  }

  .auth-form button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .auth-form p {
    text-align: center;
    color: #71809a;
    font-size: 13px;
  }

  .auth-form a {
    color: #63b3ed;
  }

  .auth-error {
    background: #28161a;
    border: 1px solid #512129;
    color: #fca5a5;
    padding: 10px;
    border-radius: 10px;
    font-size: 13px;
  }

  .auth-form small {
    color: #64748b;
    font-size: 11px;
    margin-top: -8px;
  }
`;