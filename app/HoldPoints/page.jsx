"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";

const SAMPLE_POINTS = [
  { id: "HP-001", description: "Concrete pour inspection - Foundation", type: "HOLD", status: "PENDING", system: "Structural", scheduledDate: "2024-01-20", inspector: "Building Dept", project: "Building A" },
  { id: "WP-001", description: "Fire damper installation verification", type: "WITNESS", status: "COMPLETED", system: "Fire & Life Safety", scheduledDate: "2024-01-15", inspector: "Fire Marshal", project: "Building A" },
  { id: "HP-002", description: "Electrical main switchgear energization", type: "HOLD", status: "SCHEDULED", system: "Electrical", scheduledDate: "2024-01-22", inspector: "Electrical Inspector", project: "Building B" },
  { id: "WP-002", description: "HVAC balancing walkthrough", type: "WITNESS", status: "PENDING", system: "Mechanical", scheduledDate: "2024-01-25", inspector: "Owner Rep", project: "Building A" },
];

const TYPE_COLORS = { HOLD: "bg-red-500/20 text-red-300 border-red-500/30", WITNESS: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
const STATUS_COLORS = { PENDING: "bg-yellow-500/20 text-yellow-300", SCHEDULED: "bg-blue-500/20 text-blue-300", COMPLETED: "bg-green-500/20 text-green-300", FAILED: "bg-red-500/20 text-red-300" };

export default function HoldPointsPage() {
  const [points, setPoints] = useState([]);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
    const saved = localStorage.getItem("holdpoints");
    if (saved) setPoints(JSON.parse(saved));
    else { setPoints(SAMPLE_POINTS); localStorage.setItem("holdpoints", JSON.stringify(SAMPLE_POINTS)); }
  }, []);

  const isDark = theme === "dark";

  return (
    <Layout>
      <div className="p-8" style={{ background: "var(--rf-bg)", minHeight: "100vh" }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Hold / Witness Points</h1>
            <p className="text-sm mt-1" style={{ color: "var(--rf-txt2)" }}>Track mandatory inspection and witness points</p>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}>+ Add Point</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ label: "Total Points", value: points.length, color: "text-cyan-400" }, { label: "Hold Points", value: points.filter(p => p.type === "HOLD").length, color: "text-red-400" }, { label: "Witness Points", value: points.filter(p => p.type === "WITNESS").length, color: "text-purple-400" }, { label: "Completed", value: points.filter(p => p.status === "COMPLETED").length, color: "text-green-400" }].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
          <table className="w-full">
            <thead><tr className={isDark ? "border-b border-slate-800" : "border-b border-slate-200"}>{["ID", "Description", "Type", "Status", "System", "Scheduled", "Inspector", "Project"].map((h) => (<th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{h}</th>))}</tr></thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.id} className={`border-b ${isDark ? "border-slate-800/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50"}`}>
                  <td className="px-5 py-4 text-sm font-mono" style={{ color: "var(--rf-accent)" }}>{point.id}</td>
                  <td className="px-5 py-4"><p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{point.description}</p></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full border ${TYPE_COLORS[point.type]}`}>{point.type}</span></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLORS[point.status]}`}>{point.status}</span></td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{point.system}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{point.scheduledDate}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{point.inspector}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{point.project}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
