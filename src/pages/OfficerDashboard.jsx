import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, Filter } from "lucide-react";
import { listIssues, updateStatus } from "../services/issueService";
import { connectSocket } from "../services/socket";
import { useAuth } from "../context/AuthContext";
import IssueCard from "../components/IssueCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const STATUS_FLOW = {
  REPORTED: "ACKNOWLEDGED",
  ACKNOWLEDGED: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
};

const STATUS_LABEL = {
  ACKNOWLEDGED: "Acknowledge",
  IN_PROGRESS: "Start work",
  RESOLVED: "Mark resolved",
};

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState(null);
  const [filter, setFilter] = useState("OPEN");
  const [updatingId, setUpdatingId] = useState(null);

  function load() {
    listIssues(user.wardId).then(setIssues).catch(() => setIssues([]));
  }

  useEffect(() => {
    load();
    const client = connectSocket((c) => {
      c.subscribe(`/topic/ward/${user.wardId}`, () => load());
    });
    return () => client?.deactivate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.wardId]);

  async function advance(issue) {
    const next = STATUS_FLOW[issue.status];
    if (!next) return;
    setUpdatingId(issue.id);
    try {
      await updateStatus(issue.id, next, `Marked ${next.toLowerCase().replace("_", " ")} by ${user.name}`);
      load();
    } finally {
      setUpdatingId(null);
    }
  }

  if (issues === null) return <Loader label="Loading ward issues" />;

  const filtered = filter === "OPEN" ? issues.filter((i) => i.status !== "RESOLVED") : issues;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{user.wardName} — Officer Dashboard</h1>
          <p className="text-sm text-slate-soft">Sorted by priority score, highest first.</p>
        </div>
        <Link to="/officer/analytics" className="btn-secondary !px-4 !py-2 text-sm">View analytics</Link>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Filter size={15} className="text-slate-soft" />
        {["OPEN", "ALL"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              filter === f ? "bg-civic text-white" : "bg-ink/5 text-ink/60"
            }`}
          >
            {f === "OPEN" ? "Open only" : "All issues"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="Nothing here" description="No issues match this filter right now." />
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => (
            <div key={issue.id} className="flex items-center gap-3">
              <div className="flex-1"><IssueCard issue={issue} /></div>
              {issue.status !== "RESOLVED" && (
                <button
                  onClick={() => advance(issue)}
                  disabled={updatingId === issue.id}
                  className="btn-primary hidden shrink-0 !px-3 !py-2 text-xs sm:inline-flex"
                >
                  {updatingId === issue.id ? "…" : STATUS_LABEL[STATUS_FLOW[issue.status]]}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
