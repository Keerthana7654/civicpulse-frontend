import React from "react";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <span className="relative inline-flex h-10 w-10">
        <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-civic/40" />
        <span className="relative inline-flex h-10 w-10 rounded-full bg-civic/70" />
      </span>
      <p className="text-sm text-slate-soft">{label}&hellip;</p>
    </div>
  );
}
