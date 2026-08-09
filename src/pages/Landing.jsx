import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapPinned, Radio, ShieldCheck, TimerReset } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-civic/10 px-3 py-1 text-xs font-semibold text-civic">
              <Radio size={13} className="animate-pulse" /> Live civic accountability
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Every pothole has a pulse. <span className="text-civic">Now your ward can feel it.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-soft">
              Report a civic issue in seconds. CivicPulse groups duplicate reports,
              scores them by urgency, and keeps you and your ward officer looking
              at the same live status — no more complaints vanishing into a form.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link to={user.role === "CITIZEN" ? "/report" : "/officer"} className="btn-primary">
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary">Report an issue</Link>
                  <Link to="/map" className="btn-secondary">View live map</Link>
                </>
              )}
            </div>
          </div>

          <div className="card relative overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-soft">Indiranagar Ward — live</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-resolved">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-resolved/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-resolved" />
                </span>
                Streaming
              </span>
            </div>
            {[
              { cat: "Pothole", street: "CMH Road", score: 18.4, status: "IN_PROGRESS" },
              { cat: "Garbage", street: "12th Main", score: 9.6, status: "REPORTED" },
              { cat: "Streetlight", street: "100 Feet Rd", score: 4.2, status: "RESOLVED" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between border-b border-ink/5 py-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-ink">{r.cat} · {r.street}</p>
                  <p className="text-xs text-slate-soft">{r.status === "RESOLVED" ? "Closed by officer" : "Awaiting resolution"}</p>
                </div>
                <span className="font-mono text-sm font-semibold text-civic">{r.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-ink/5 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl font-semibold text-ink">
            Built so nothing gets lost — or duplicated
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Feature
              icon={MapPinned}
              title="Auto-duplicate detection"
              text="Reporting a pothole 40m from an existing one? CivicPulse flags it instantly so effort isn't wasted twice."
            />
            <Feature
              icon={TimerReset}
              title="Priority that ages honestly"
              text="Confirmations, category severity, and days-open combine into one transparent score officers can trust."
            />
            <Feature
              icon={ShieldCheck}
              title="A public accountability trail"
              text="Every status change is logged and pushed to you live — reported, acknowledged, in progress, resolved."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-civic/10 text-civic">
        <Icon size={20} />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-soft">{text}</p>
    </div>
  );
}
