import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Users, Clock } from "lucide-react";
import { getIssue, confirmIssue } from "../services/issueService";
import { connectSocket } from "../services/socket";
import { useAuth } from "../context/AuthContext";
import PulseBadge from "../components/PulseBadge";
import StatusPill from "../components/StatusPill";
import CategoryBadge from "../components/CategoryBadge";
import Loader from "../components/Loader";

export default function IssueDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [detail, setDetail] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  function load() {
    getIssue(id).then(setDetail).catch(() => {});
  }

  useEffect(() => {
    load();
    const client = connectSocket((c) => {
      c.subscribe("/topic/issues", (msg) => {
        const event = JSON.parse(msg.body);
        if (String(event.issueId) === String(id)) load();
      });
    });
    return () => client?.deactivate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleConfirm() {
    setConfirming(true);
    try {
      await confirmIssue(id);
      setConfirmMsg("Thanks — your confirmation was added.");
      load();
    } catch (err) {
      setConfirmMsg(err.response?.data?.message || "Couldn't confirm this report.");
    } finally {
      setConfirming(false);
    }
  }

  if (!detail) return <Loader label="Loading report" />;

  const { issue, history } = detail;
  const isOwnReport = user?.userId === issue.reporterId;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <PulseBadge score={issue.priorityScore} status={issue.status} size="md" />
            <div>
              <div className="mb-1 flex items-center gap-2">
                <CategoryBadge category={issue.category} />
                <StatusPill status={issue.status} />
              </div>
              <h1 className="font-display text-xl font-semibold text-ink">
                {issue.description || `${issue.category} report`}
              </h1>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-semibold text-civic">{issue.priorityScore}</div>
            <div className="text-[10px] uppercase tracking-wide text-slate-soft">priority</div>
          </div>
        </div>

        {issue.photoUrl && (
          <img src={issue.photoUrl} alt="Reported issue" className="mt-4 max-h-72 w-full rounded-xl object-cover" />
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-soft">
          <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {issue.wardName}</span>
          <span className="inline-flex items-center gap-1.5"><Users size={15} /> {issue.confirmationCount} people confirmed</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={15} /> Reported {new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>

        {user?.role === "CITIZEN" && !isOwnReport && issue.status !== "RESOLVED" && (
          <div className="mt-5">
            <button onClick={handleConfirm} disabled={confirming} className="btn-secondary">
              {confirming ? "Confirming…" : "I've seen this too — confirm"}
            </button>
            {confirmMsg && <p className="mt-2 text-xs text-slate-soft">{confirmMsg}</p>}
          </div>
        )}
      </div>

      <div className="card mt-4">
        <h2 className="mb-4 text-sm font-semibold text-ink">Status timeline</h2>
        <ol className="space-y-4 border-l border-ink/10 pl-4">
          <li className="relative">
            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-civic" />
            <p className="text-sm font-medium text-ink">Reported</p>
            <p className="text-xs text-slate-soft">{new Date(issue.createdAt).toLocaleString()}</p>
          </li>
          {history.map((h, i) => (
            <li key={i} className="relative">
              <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${h.newStatus === "RESOLVED" ? "bg-resolved" : "bg-civic"}`} />
              <p className="text-sm font-medium text-ink">{h.newStatus.replace("_", " ")}</p>
              {h.note && <p className="text-sm text-slate-soft">{h.note}</p>}
              <p className="text-xs text-slate-soft">by {h.changedByName} · {new Date(h.changedAt).toLocaleString()}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
