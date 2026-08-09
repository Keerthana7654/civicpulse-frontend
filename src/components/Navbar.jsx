import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Radio, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const links = user?.role === "OFFICER" || user?.role === "ADMIN"
    ? [
        { to: "/officer", label: "Dashboard" },
        { to: "/officer/analytics", label: "Analytics" },
      ]
    : user
    ? [
        { to: "/report", label: "Report Issue" },
        { to: "/my-reports", label: "My Reports" },
        { to: "/map", label: "Live Map" },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-civic text-white">
            <Radio size={16} />
          </span>
          <span className="font-display text-lg font-semibold text-ink">CivicPulse</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-ink/70 hover:text-civic">
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="btn-secondary !px-3 !py-1.5 text-xs">
              <LogOut size={14} /> Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-civic">Log in</Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-xs">Get started</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/5 bg-paper px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-ink/80">
                {l.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="btn-secondary w-full justify-center">
                <LogOut size={14} /> Log out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
