import React from "react";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 py-14 text-center">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-civic/10 text-civic">
          <Icon size={22} />
        </span>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-xs text-sm text-slate-soft">{description}</p>}
      {action}
    </div>
  );
}
