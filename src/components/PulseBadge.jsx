import React from "react";

/**
 * Signature visual motif for CivicPulse: a priority score rendered as a
 * radar-style pulse. Higher scores pulse faster/brighter (red-amber),
 * resolved issues render as a still, filled dot (no pulse — the "heartbeat"
 * has stopped because the problem is gone).
 */
export default function PulseBadge({ score = 0, status = "REPORTED", size = "md" }) {
  const isResolved = status === "RESOLVED";
  const isCritical = score >= 15;

  const dotColor = isResolved ? "bg-resolved" : isCritical ? "bg-signal" : "bg-civic";
  const ringColor = isResolved ? "bg-resolved/40" : isCritical ? "bg-signal/50" : "bg-civic/40";

  const dims = size === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5";
  const wrapDims = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <span className={`relative inline-flex ${wrapDims} items-center justify-center shrink-0`}>
      {!isResolved && (
        <span className={`absolute inline-flex h-full w-full rounded-full ${ringColor} animate-pulseRing`} />
      )}
      <span className={`relative inline-flex rounded-full ${dims} ${dotColor}`} />
    </span>
  );
}
