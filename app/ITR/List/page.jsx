"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";

const SAMPLE_ITRS = [
  { id: "ITR-001", title: "HVAC Pre-Functional Test", system: "Mechanical", status: "PASSED", project: "Building A", inspector: "John Smith", date: "2024-01-15" },
  { id: "ITR-002", title: "Electrical Panel Verification", system: "Electrical", status: "PENDING", project: "Building A", inspector: "Jane Doe", date: "2024-01-16" },
  { id: "ITR-003", title: "Fire Alarm Loop Test", system: "Fire & Life Safety", status: "FAILED", project: "Building B", inspector: "Bob Wilson", date: "2024-01-14" },
  { id: "ITR-004", title: "Plumbing Pressure Test", system: "Plumbing", status: "PASSED", project: "Building A", inspector: "Alice Brown", date: "2024-01-13" },
  { id: "ITR-005", title: "BMS Points Verification", system: "Controls", status: "IN_PROGRESS", project: "Building C", inspector: "Mike Johnson", date: "2024-01-17" },
];

const STATUS_COLORS = { PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", IN_PROGRESS: "bg-blue-500/20 text-blue-300 border-blue-500/30", PASSED: "bg-green-500/20 text-green-300 border-green-500/30", FAILED: "bg-red-500/20 text-red-300 border-red-500/30" };
const SYSTEM_COLORS = { Mechanical: "bg-cyan-500/20 text-cyan-300", Electrical: "bg-yellow-500/20 text-yellow-300", "Fire & Life Safety": "bg-red-500/20 text-red-300", Plumbing: "bg-blue-500/20 text-blue-300", Controls: "bg-purple-500/20 text-purple-300" };

export default function ITRListPage() {
  const [itrs, setItrs] = useState([]);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
    const saved = localStorage.getItem("itrs");
    if (saved) setItrs(JSON.parse(saved));
    else { setItrs(SAMPLE_ITRS); localStorage.setItem("itrs", JSON.stringify(SAMPLE_ITRS)); }
  }, []);

  const isDark = theme === "dark";
  const stats = { total: itrs.length, passed: itrs.filter(i => i.status === "PASSED").length, failed: itrs.filter(i => i.status === "FAILED").length, pending: itrs.filter(i => i.status === "PENDING" || i.status === "IN_PROGRESS").length };

  return (
    <Layout>
      <div className="p-8" style={{ background: "var(--rf-bg)", minHeight: "100vh" }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Inspection Test Records (ITRs)</h1>
            <p className="text-sm mt-1" style={{ color: "var(--rf-txt2)" }}>Track system inspections and test results</p>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}>+ New ITR</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ label: "Total ITRs", value: stats.total, color: "text-cyan-400" }, { label: "Passed", value: stats.passed, color: "text-green-400" }, { label: "Failed", value: stats.failed, color: "text-red-400" }, { label: "Pending", value: stats.pending, color: "text-yellow-400" }].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
          <table className="w-full">
            <thead><tr className={isDark ? "border-b border-slate-800" : "border-b border-slate-200"}>{["ITR ID", "Title", "System", "Status", "Project", "Inspector", "Date"].map((h) => (<th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{h}</th>))}</tr></thead>
            <tbody>
              {itrs.map((itr) => (
                <tr key={itr.id} className={`border-b ${isDark ? "border-slate-800/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50"}`}>
                  <td className="px-5 py-4 text-sm font-mono" style={{ color: "var(--rf-accent)" }}>{itr.id}</td>
                  <td className="px-5 py-4"><p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{itr.title}</p></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full ${SYSTEM_COLORS[itr.system] || "bg-gray-500/20 text-gray-300"}`}>{itr.system}</span></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[itr.status]}`}>{itr.status.replace("_", " ")}</span></td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{itr.project}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{itr.inspector}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{itr.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
