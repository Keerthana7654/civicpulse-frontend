import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-5xl font-semibold text-civic">404</h1>
      <p className="mt-3 text-sm text-slate-soft">This page hasn't been reported to CivicPulse yet.</p>
      <Link to="/" className="btn-primary mt-6">Back home</Link>
    </div>
  );
}
