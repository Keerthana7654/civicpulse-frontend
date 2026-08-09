import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listWards } from "../services/wardService";
import { Radio } from "lucide-react";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CITIZEN",
    wardId: "",
  });

  useEffect(() => {
    listWards().then(setWards).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, wardId: form.wardId ? Number(form.wardId) : null };
      const data = await register(payload);
      navigate(data.role === "CITIZEN" ? "/report" : "/officer");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account. Please try again.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-civic text-white">
          <Radio size={18} />
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-slate-soft">Report issues, or sign up as an officer to manage your ward.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && <p className="rounded-lg bg-signal/10 px-3 py-2 text-sm text-amber-800">{error}</p>}

        <div>
          <label className="label">Full name</label>
          <input required className="input" value={form.name}
                 onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ananya Rao" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input" value={form.email}
                 onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required minLength={6} className="input" value={form.password}
                 onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
        </div>

        <div>
          <label className="label">I am a</label>
          <div className="grid grid-cols-2 gap-2">
            {["CITIZEN", "OFFICER"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  form.role === r ? "border-civic bg-civic/10 text-civic" : "border-ink/15 text-ink/70"
                }`}
              >
                {r === "CITIZEN" ? "Citizen" : "Ward Officer"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">{form.role === "OFFICER" ? "Assigned ward" : "Home ward (optional)"}</label>
          <select
            className="input"
            required={form.role === "OFFICER"}
            value={form.wardId}
            onChange={(e) => setForm({ ...form, wardId: e.target.value })}
          >
            <option value="">Select a ward</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>{w.name}, {w.city}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-soft">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-civic">Log in</Link>
      </p>
    </div>
  );
}
