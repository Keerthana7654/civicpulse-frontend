import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { listIssues } from "../services/issueService";
import { connectSocket } from "../services/socket";
import Loader from "../components/Loader";
import "leaflet/dist/leaflet.css";

const CATEGORY_COLOR = {
  POTHOLE: "#1E3A5F",
  GARBAGE: "#F0A73B",
  WATER_LEAK: "#2F5789",
  ELECTRICITY: "#F0A73B",
  STREETLIGHT: "#64748B",
  OTHER: "#64748B",
};

export default function LiveMap() {
  const [issues, setIssues] = useState(null);

  function load() {
    listIssues().then(setIssues).catch(() => setIssues([]));
  }

  useEffect(() => {
    load();
    const client = connectSocket((c) => {
      c.subscribe("/topic/issues", () => load());
    });
    return () => client?.deactivate();
  }, []);

  if (issues === null) return <Loader label="Loading live issues" />;

  const center = issues.length
    ? [Number(issues[0].latitude), Number(issues[0].longitude)]
    : [12.9716, 77.5946]; // Bengaluru fallback

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink">Live issue map</h1>
      <p className="mb-5 text-sm text-slate-soft">
        {issues.length} open reports across all wards — bigger, brighter dots mean higher priority.
      </p>
      <div className="card overflow-hidden !p-0">
        <MapContainer center={center} zoom={13} style={{ height: "65vh", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {issues.map((issue) => (
            <CircleMarker
              key={issue.id}
              center={[Number(issue.latitude), Number(issue.longitude)]}
              radius={Math.min(8 + Number(issue.priorityScore) / 3, 22)}
              pathOptions={{
                color: CATEGORY_COLOR[issue.category] || "#1E3A5F",
                fillColor: CATEGORY_COLOR[issue.category] || "#1E3A5F",
                fillOpacity: issue.status === "RESOLVED" ? 0.15 : 0.55,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{issue.category.replace("_", " ")}</p>
                  <p className="text-xs text-slate-500">{issue.description}</p>
                  <p className="mt-1 text-xs">Priority: <b>{issue.priorityScore}</b> · {issue.status}</p>
                  <Link to={`/issues/${issue.id}`} className="mt-1 inline-block text-xs font-semibold text-civic">
                    View details →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
