import React from "react";

const LABELS = {
  POTHOLE: "Pothole",
  GARBAGE: "Garbage",
  WATER_LEAK: "Water leak",
  ELECTRICITY: "Electricity",
  STREETLIGHT: "Streetlight",
  OTHER: "Other",
};

export default function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-md bg-ink/5 px-2 py-0.5 text-xs font-medium text-ink/70">
      {LABELS[category] || category}
    </span>
  );
}
