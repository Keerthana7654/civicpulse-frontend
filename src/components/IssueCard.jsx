import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import PulseBadge from "./PulseBadge";
import StatusPill from "./StatusPill";
import CategoryBadge from "./CategoryBadge";

export default function IssueCard({ issue }) {
  const timeAgo = timeSince(issue.createdAt);

  return (
    <Link
      to={`/issues/${issue.id}`}
      className="card flex items-start gap-3 transition hover:border-civic/30 hover:shadow-md"
    >
      <PulseBadge score={issue.priorityScore} status={issue.status} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <CategoryBadge category={issue.category} />
          <StatusPill status={issue.status} />
        </div>
        <p className="truncate text-sm font-medium text-ink">
          {issue.description || "No description provided"}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {issue.wardName}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={13} /> {issue.confirmationCount} confirmed
          </span>
          <span className="font-mono">{timeAgo}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-mono text-sm font-semibold text-civic">{issue.priorityScore}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-soft">priority</div>
      </div>
    </Link>
  );
}

function timeSince(dateStr) {
  if (!dateStr) return "";
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const units = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return "just now";
}
