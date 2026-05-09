"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";

const SAMPLE_NCRS = [
  { id: "NCR-001", title: "Concrete pour not meeting spec", severity: "CRITICAL", status: "OPEN", project: "Building A", dateRaised: "2024-01-15", assignedTo: "John Smith" },
  { id: "NCR-002", title: "Missing insulation in ductwork", severity: "HIGH", status: "IN_REVIEW", project: "Building B", dateRaised: "2024-01-14", assignedTo: "Jane Doe" },
  { id: "NCR-003", title: "Incorrect pipe sizing", severity: "MEDIUM", status: "CLOSED", project: "Building A", dateRaised: "2024-01-10", assignedTo: "Bob Wilson" },
  { id: "NCR-004", title: "Electrical panel mislabeled", severity: "LOW", status: "OPEN", project: "Building C", dateRaised: "2024-01-16", assignedTo: "Alice Brown" },
];

const STATUS_COLORS = { OPEN: "bg-red-500/20 text-red-300 border-red-500/30", IN_REVIEW: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", CLOSED: "bg-green-500/20 text-green-300 border-green-500/30" };
const SEVERITY_COLORS = { LOW: "bg-gray-700/60 text-gray-300", MEDIUM: "bg-blue-500/20 text-blue-300", HIGH: "bg-orange-500/20 text-orange-300", CRITICAL: "bg-red-500/20 text-red-300" };

export default function NCRListPage() {
  const [ncrs, setNcrs] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [showModal, setShowModal] = useState(false);
  const [newNCR, setNewNCR] = useState({ title: "", severity: "MEDIUM", project: "" });

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
    const saved = localStorage.getItem("ncrs");
    if (saved) setNcrs(JSON.parse(saved));
    else { setNcrs(SAMPLE_NCRS); localStorage.setItem("ncrs", JSON.stringify(SAMPLE_NCRS)); }
  }, []);

  const isDark = theme === "dark";

  const handleAddNCR = () => {
    const ncr = { id: `NCR-${String(ncrs.length + 1).padStart(3, "0")}`, ...newNCR, status: "OPEN", dateRaised: new Date().toISOString().split("T")[0], assignedTo: "Unassigned" };
    const updated = [ncr, ...ncrs];
    setNcrs(updated);
    localStorage.setItem("ncrs", JSON.stringify(updated));
    setShowModal(false);
    setNewNCR({ title: "", severity: "MEDIUM", project: "" });
  };

  return (
    <Layout>
      <div className="p-8" style={{ background: "var(--rf-bg)", minHeight: "100vh" }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Non-Conformance Reports (NCRs)</h1>
            <p className="text-sm mt-1" style={{ color: "var(--rf-txt2)" }}>Track and manage quality non-conformances</p>
          </div>
          <button onClick={() => setShowModal(true)} className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}>+ New NCR</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ label: "Total NCRs", value: ncrs.length, color: "text-cyan-400" }, { label: "Open", value: ncrs.filter(n => n.status === "OPEN").length, color: "text-red-400" }, { label: "In Review", value: ncrs.filter(n => n.status === "IN_REVIEW").length, color: "text-yellow-400" }, { label: "Closed", value: ncrs.filter(n => n.status === "CLOSED").length, color: "text-green-400" }].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
          <table className="w-full">
            <thead><tr className={isDark ? "border-b border-slate-800" : "border-b border-slate-200"}>{["NCR ID", "Title", "Severity", "Status", "Project", "Date Raised", "Assigned To"].map((h) => (<th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{h}</th>))}</tr></thead>
            <tbody>
              {ncrs.map((ncr) => (
                <tr key={ncr.id} className={`border-b ${isDark ? "border-slate-800/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50"}`}>
                  <td className="px-5 py-4 text-sm font-mono" style={{ color: "var(--rf-accent)" }}>{ncr.id}</td>
                  <td className="px-5 py-4"><p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{ncr.title}</p></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full ${SEVERITY_COLORS[ncr.severity]}`}>{ncr.severity}</span></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[ncr.status]}`}>{ncr.status.replace("_", " ")}</span></td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{ncr.project}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{ncr.dateRaised}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{ncr.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-full max-w-md rounded-xl p-6 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"}`}>
              <h2 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>New NCR</h2>
              <div className="space-y-4">
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Title</label><input type="text" value={newNCR.title} onChange={(e) => setNewNCR({ ...newNCR, title: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} placeholder="Describe the non-conformance..." /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Severity</label><select value={newNCR.severity} onChange={(e) => setNewNCR({ ...newNCR, severity: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Project</label><input type="text" value={newNCR.project} onChange={(e) => setNewNCR({ ...newNCR, project: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} placeholder="Project name..." /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2 rounded-lg text-sm ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                <button onClick={handleAddNCR} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 text-white" : "bg-sky-600 text-white"}`}>Create NCR</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
