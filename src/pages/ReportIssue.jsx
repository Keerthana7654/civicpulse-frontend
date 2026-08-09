import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { createIssue, confirmIssue } from "../services/issueService";
import { listWards } from "../services/wardService";
import { useAuth } from "../context/AuthContext";
import CategoryBadge from "../components/CategoryBadge";

const CATEGORIES = ["POTHOLE", "GARBAGE", "WATER_LEAK", "ELECTRICITY", "STREETLIGHT", "OTHER"];

export default function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [wards, setWards] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [form, setForm] = useState({
    category: "",
    description: "",
    wardId: user?.wardId || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listWards().then(setWards).catch(() => {});
    captureLocation();
  }, []);

  function captureLocation() {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location access. You can still pick your ward manually.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location access denied — we'll still file the report using your ward.")
    );
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        category: form.category,
        description: form.description,
        photoUrl: photoPreview,
        latitude: location?.lat ?? 12.9716,
        longitude: location?.lng ?? 77.5946,
        wardId: Number(form.wardId),
      };
      const data = await createIssue(payload);
      setResult(data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDuplicate(issueId) {
    try {
      await confirmIssue(issueId);
      navigate(`/issues/${issueId}`);
    } catch {
      navigate(`/issues/${issueId}`);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Report an issue</h1>
      <p className="mt-1 text-sm text-slate-soft">Takes under a minute — photo, location, and a quick description.</p>

      <ol className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-soft">
        {["Photo", "Category", "Details", "Done"].map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
              step > i ? "bg-resolved text-white" : step === i + 1 ? "bg-civic text-white" : "bg-ink/10 text-ink/50"
            }`}>
              {i + 1}
            </span>
            {label}
            {i < 3 && <span className="mx-1 h-px w-4 bg-ink/10" />}
          </li>
        ))}
      </ol>

      <div className="card mt-6">
        {step === 1 && (
          <div>
            <label className="label">Add a photo</label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 bg-ink/[0.02] py-10 text-center hover:border-civic/40">
              {photoPreview ? (
                <img src={photoPreview} alt="Issue preview" className="max-h-48 rounded-lg object-cover" />
              ) : (
                <>
                  <Camera className="text-civic" size={26} />
                  <span className="text-sm font-medium text-ink/70">Tap to take or upload a photo</span>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
            </label>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-soft">
              <MapPin size={16} className={location ? "text-resolved" : "text-signal"} />
              {location
                ? `Location captured (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
                : locationError || "Detecting your location…"}
            </div>

            <button className="btn-primary mt-6 w-full justify-center" onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="label">What kind of issue is this?</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, category: c })}
                  className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    form.category === c ? "border-civic bg-civic/10 text-civic" : "border-ink/15 text-ink/70"
                  }`}
                >
                  <CategoryBadge category={c} />
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="btn-secondary flex-1 justify-center" onClick={() => setStep(1)}>Back</button>
              <button
                className="btn-primary flex-1 justify-center"
                disabled={!form.category}
                onClick={() => setStep(3)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="label">Ward</label>
            <select className="input" value={form.wardId} onChange={(e) => setForm({ ...form, wardId: e.target.value })}>
              <option value="">Select a ward</option>
              {wards.map((w) => <option key={w.id} value={w.id}>{w.name}, {w.city}</option>)}
            </select>

            <label className="label mt-4">Description (optional)</label>
            <textarea
              className="input min-h-[100px]"
              placeholder="e.g. Large pothole near the bus stop, roughly 2 feet wide"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {error && (
              <p className="mt-3 flex items-center gap-2 rounded-lg bg-signal/10 px-3 py-2 text-sm text-amber-800">
                <AlertTriangle size={15} /> {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button className="btn-secondary flex-1 justify-center" onClick={() => setStep(2)}>Back</button>
              <button
                className="btn-primary flex-1 justify-center"
                disabled={!form.wardId || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting…" : "Submit report"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-resolved" size={40} />
            <h2 className="mt-3 text-lg font-semibold text-ink">Report submitted</h2>
            <p className="mt-1 text-sm text-slate-soft">
              Priority score: <span className="font-mono font-semibold text-civic">{result.issue.priorityScore}</span>
            </p>

            {result.possibleDuplicates?.length > 0 && (
              <div className="mt-5 rounded-lg bg-signal/10 p-4 text-left">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <AlertTriangle size={15} /> {result.possibleDuplicates.length} similar report{result.possibleDuplicates.length > 1 ? "s" : ""} found nearby
                </p>
                <p className="mb-3 text-xs text-amber-800/80">
                  You can confirm an existing report instead of tracking a separate one.
                </p>
                {result.possibleDuplicates.slice(0, 3).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleConfirmDuplicate(d.id)}
                    className="mb-2 flex w-full items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-left text-xs hover:border-amber-400"
                  >
                    <span>{d.description || d.category} · {d.confirmationCount} confirmed</span>
                    <span className="font-semibold text-civic">Confirm this →</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button className="btn-secondary flex-1 justify-center" onClick={() => navigate("/my-reports")}>
                View my reports
              </button>
              <button className="btn-primary flex-1 justify-center" onClick={() => navigate(`/issues/${result.issue.id}`)}>
                Track this report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
