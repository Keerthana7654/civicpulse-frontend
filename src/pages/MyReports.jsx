import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileWarning, Plus } from "lucide-react";
import { myIssues } from "../services/issueService";
import IssueCard from "../components/IssueCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function MyReports() {
  const [issues, setIssues] = useState(null);

  useEffect(() => {
    myIssues().then(setIssues).catch(() => setIssues([]));
  }, []);

  if (issues === null) return <Loader label="Loading your reports" />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">My reports</h1>
        <Link to="/report" className="btn-primary !px-4 !py-2 text-sm"><Plus size={15} /> New</Link>
      </div>

      {issues.length === 0 ? (
        <EmptyState
          icon={FileWarning}
          title="No reports yet"
          description="Spotted a pothole or an overflowing bin? Report it and track it right here."
          action={<Link to="/report" className="btn-primary mt-2">Report an issue</Link>}
        />
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}
        </div>
      )}
    </div>
  );
}
