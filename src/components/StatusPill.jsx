import React from "react";

const STYLES = {
  REPORTED: "bg-slate-soft/10 text-slate-soft",
  ACKNOWLEDGED: "bg-civic/10 text-civic",
  IN_PROGRESS: "bg-signal/15 text-amber-700",
  RESOLVED: "bg-resolved/15 text-resolved",
};

const LABELS = {
  REPORTED: "Reported",
  ACKNOWLEDGED: "Acknowledged",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export default function StatusPill({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] || STYLES.REPORTED}`}>
      {LABELS[status] || status}
    </span>
  );
}
