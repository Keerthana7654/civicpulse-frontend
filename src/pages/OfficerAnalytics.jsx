import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { wardAnalytics } from "../services/issueService";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function OfficerAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    wardAnalytics(user.wardId).then(setData).catch(() => {});
  }, [user.wardId]);

  if (!data) return <Loader label="Crunching ward analytics" />;

  const categoryData = Object.entries(data.byCategory || {}).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink">{user.wardName} — Analytics</h1>
      <p className="mb-6 text-sm text-slate-soft">A snapshot of how your ward is tracking.</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat icon={ListChecks} label="Total issues" value={data.totalIssues} />
        <Stat icon={Clock} label="Open" value={data.openIssues} />
        <Stat icon={CheckCircle2} label="Resolved" value={data.resolvedIssues} color="text-resolved" />
        <Stat icon={AlertTriangle} label="SLA breaches (>7d)" value={data.slaBreaches} color="text-signal" />
      </div>

      <div className="card mt-6">
        <h2 className="mb-4 text-sm font-semibold text-ink">Issues by category</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#16212E10" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card mt-4">
        <p className="text-sm text-ink/80">
          Average resolution time: <span className="font-mono font-semibold text-civic">{data.avgResolutionDays} days</span>
        </p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color = "text-civic" }) {
  return (
    <div className="card">
      <Icon className={color} size={18} />
      <p className="mt-2 font-mono text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-slate-soft">{label}</p>
    </div>
  );
}
