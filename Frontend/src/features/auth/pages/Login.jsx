import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, error } = useSelector((state) => state.auth);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    const result = await handleLogin({ email, password });
    if (result.success) navigate("/");
  }

  if (!loading && user) return <Navigate to="/" replace />;

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your research.">
      <form onSubmit={submit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        <p>Don't have an account? <Link to="/register">Create one</Link></p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <style>{authStyles}</style>
      <div className="auth-card">
        <div className="auth-brand"><span>✦</span> Perplexity</div>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

const authStyles = `
  .auth-page{min-height:100vh;display:grid;place-items:center;background:#070b14;color:#e8f0fe;font-family:Inter,system-ui,sans-serif;padding:20px}
  .auth-card{width:min(420px,100%);background:#0c1320;border:1px solid #223149;border-radius:20px;padding:32px;box-shadow:0 25px 80px #0008}
  .auth-brand{font-weight:800;font-size:20px;margin-bottom:28px}.auth-brand span{color:#63b3ed;margin-right:8px}
  h1{margin:0;font-size:28px}.auth-subtitle{color:#8190a8;margin:8px 0 24px}
  .auth-form{display:grid;gap:16px}.auth-form label{display:grid;gap:7px;font-size:13px;color:#aab8cc}.auth-form input{padding:12px;border-radius:10px;border:1px solid #26354e;background:#0a111d;color:#fff;outline:none}.auth-form input:focus{border-color:#63b3ed}
  .auth-form button{padding:12px;border:0;border-radius:10px;background:linear-gradient(135deg,#63b3ed,#4fd1c5);font-weight:800;cursor:pointer}.auth-form button:disabled{opacity:.5;cursor:not-allowed}
  .auth-form p{text-align:center;color:#71809a;font-size:13px}.auth-form a{color:#63b3ed}.auth-error{background:#28161a;border:1px solid #512129;color:#fca5a5;padding:10px;border-radius:10px;font-size:13px}
`;
