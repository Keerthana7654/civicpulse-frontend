import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Radio } from "lucide-react";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await login(form.email, form.password);
      navigate(data.role === "CITIZEN" ? "/report" : "/officer");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't log in. Check your email and password.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-civic text-white">
          <Radio size={18} />
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-soft">Log in to report or manage civic issues.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && <p className="rounded-lg bg-signal/10 px-3 py-2 text-sm text-amber-800">{error}</p>}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            required
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            required
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-soft">
        New to CivicPulse?{" "}
        <Link to="/register" className="font-semibold text-civic">Create an account</Link>
      </p>
    </div>
  );
}
