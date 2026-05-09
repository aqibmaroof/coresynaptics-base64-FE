"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";

const SAMPLE_LOGS = [
  { id: 1, date: "2024-01-17", weather: "Sunny, 72F", manpower: 45, activities: "HVAC startup testing, electrical panel energization, BMS point verification", issues: "Minor delay on AHU-3 due to VFD programming", safety: "No incidents", author: "John Smith" },
  { id: 2, date: "2024-01-16", weather: "Cloudy, 65F", manpower: 52, activities: "Fire alarm loop testing, plumbing pressure tests, lighting controls", issues: "None", safety: "Safety stand-down conducted", author: "Jane Doe" },
  { id: 3, date: "2024-01-15", weather: "Rain, 58F", manpower: 38, activities: "Indoor activities only - documentation review, punch list walkthrough", issues: "Outdoor work postponed due to weather", safety: "No incidents", author: "John Smith" },
];

export default function DailyLogPage() {
  const [logs, setLogs] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [showModal, setShowModal] = useState(false);
  const [newLog, setNewLog] = useState({ weather: "", manpower: "", activities: "", issues: "", safety: "" });

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
    const saved = localStorage.getItem("dailylogs");
    if (saved) setLogs(JSON.parse(saved));
    else { setLogs(SAMPLE_LOGS); localStorage.setItem("dailylogs", JSON.stringify(SAMPLE_LOGS)); }
  }, []);

  const isDark = theme === "dark";

  const handleAdd = () => {
    const log = { id: logs.length + 1, date: new Date().toISOString().split("T")[0], ...newLog, manpower: parseInt(newLog.manpower) || 0, author: "Admin User" };
    const updated = [log, ...logs];
    setLogs(updated);
    localStorage.setItem("dailylogs", JSON.stringify(updated));
    setShowModal(false);
    setNewLog({ weather: "", manpower: "", activities: "", issues: "", safety: "" });
  };

  return (
    <Layout>
      <div className="p-8" style={{ background: "var(--rf-bg)", minHeight: "100vh" }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Daily Field Log</h1>
            <p className="text-sm mt-1" style={{ color: "var(--rf-txt2)" }}>Record daily site activities and conditions</p>
          </div>
          <button onClick={() => setShowModal(true)} className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}>+ New Entry</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{ label: "Total Entries", value: logs.length, color: "text-cyan-400" }, { label: "Avg Manpower", value: Math.round(logs.reduce((a, b) => a + b.manpower, 0) / logs.length) || 0, color: "text-green-400" }, { label: "Days with Issues", value: logs.filter(l => l.issues && l.issues !== "None").length, color: "text-yellow-400" }].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className={`rounded-xl p-5 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{log.date}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{log.weather}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-sky-100 text-sky-700"}`}>{log.manpower} workers</span>
                </div>
                <span className="text-xs" style={{ color: "var(--rf-txt3)" }}>by {log.author}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--rf-txt3)" }}>Activities</p>
                  <p className="text-sm" style={{ color: "var(--rf-txt2)" }}>{log.activities}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--rf-txt3)" }}>Issues</p>
                  <p className="text-sm" style={{ color: log.issues === "None" ? "var(--rf-txt3)" : "#fbbf24" }}>{log.issues}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--rf-txt3)" }}>Safety</p>
                  <p className="text-sm" style={{ color: "var(--rf-txt2)" }}>{log.safety}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-full max-w-2xl rounded-xl p-6 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"}`}>
              <h2 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>New Daily Log Entry</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Weather</label><input type="text" value={newLog.weather} onChange={(e) => setNewLog({ ...newLog, weather: e.target.value })} placeholder="e.g., Sunny, 72F" className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Manpower</label><input type="number" value={newLog.manpower} onChange={(e) => setNewLog({ ...newLog, manpower: e.target.value })} placeholder="Total workers on site" className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div className="col-span-2"><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Activities</label><textarea value={newLog.activities} onChange={(e) => setNewLog({ ...newLog, activities: e.target.value })} rows={2} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Issues</label><input type="text" value={newLog.issues} onChange={(e) => setNewLog({ ...newLog, issues: e.target.value })} placeholder="None or describe issues" className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Safety</label><input type="text" value={newLog.safety} onChange={(e) => setNewLog({ ...newLog, safety: e.target.value })} placeholder="Safety observations" className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2 rounded-lg text-sm ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                <button onClick={handleAdd} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 text-white" : "bg-sky-600 text-white"}`}>Save Entry</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
