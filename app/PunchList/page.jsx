"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";

const SAMPLE_ITEMS = [
  { id: "PL-001", description: "Touch up paint - Room 101 door frame", location: "Building A - Floor 1", trade: "Painting", status: "OPEN", priority: "LOW", assignedTo: "Paint Crew", dueDate: "2024-01-25" },
  { id: "PL-002", description: "Adjust door closer - Main entrance", location: "Building A - Lobby", trade: "Hardware", status: "IN_PROGRESS", priority: "MEDIUM", assignedTo: "Door Systems Inc", dueDate: "2024-01-22" },
  { id: "PL-003", description: "Replace damaged ceiling tile", location: "Building B - Room 205", trade: "Ceiling", status: "OPEN", priority: "LOW", assignedTo: "Interior Finishes Co", dueDate: "2024-01-28" },
  { id: "PL-004", description: "Fix HVAC diffuser alignment", location: "Building A - Floor 2", trade: "Mechanical", status: "COMPLETED", priority: "MEDIUM", assignedTo: "HVAC Solutions", dueDate: "2024-01-18" },
  { id: "PL-005", description: "Seal gap at window frame", location: "Building C - Room 301", trade: "Glazing", status: "OPEN", priority: "HIGH", assignedTo: "Glass Masters", dueDate: "2024-01-20" },
];

const STATUS_COLORS = { OPEN: "bg-red-500/20 text-red-300 border-red-500/30", IN_PROGRESS: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", COMPLETED: "bg-green-500/20 text-green-300 border-green-500/30" };
const PRIORITY_COLORS = { LOW: "bg-gray-700/60 text-gray-300", MEDIUM: "bg-blue-500/20 text-blue-300", HIGH: "bg-orange-500/20 text-orange-300" };

export default function PunchListPage() {
  const [items, setItems] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ description: "", location: "", trade: "", priority: "MEDIUM" });

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
    const saved = localStorage.getItem("punchlist");
    if (saved) setItems(JSON.parse(saved));
    else { setItems(SAMPLE_ITEMS); localStorage.setItem("punchlist", JSON.stringify(SAMPLE_ITEMS)); }
  }, []);

  const isDark = theme === "dark";

  const handleAdd = () => {
    const item = { id: `PL-${String(items.length + 1).padStart(3, "0")}`, ...newItem, status: "OPEN", assignedTo: "Unassigned", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] };
    const updated = [item, ...items];
    setItems(updated);
    localStorage.setItem("punchlist", JSON.stringify(updated));
    setShowModal(false);
    setNewItem({ description: "", location: "", trade: "", priority: "MEDIUM" });
  };

  return (
    <Layout>
      <div className="p-8" style={{ background: "var(--rf-bg)", minHeight: "100vh" }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Punch List</h1>
            <p className="text-sm mt-1" style={{ color: "var(--rf-txt2)" }}>Track deficiencies and completion items</p>
          </div>
          <button onClick={() => setShowModal(true)} className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}>+ Add Item</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ label: "Total Items", value: items.length, color: "text-cyan-400" }, { label: "Open", value: items.filter(i => i.status === "OPEN").length, color: "text-red-400" }, { label: "In Progress", value: items.filter(i => i.status === "IN_PROGRESS").length, color: "text-yellow-400" }, { label: "Completed", value: items.filter(i => i.status === "COMPLETED").length, color: "text-green-400" }].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
          <table className="w-full">
            <thead><tr className={isDark ? "border-b border-slate-800" : "border-b border-slate-200"}>{["ID", "Description", "Location", "Trade", "Priority", "Status", "Assigned To", "Due Date"].map((h) => (<th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{h}</th>))}</tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={`border-b ${isDark ? "border-slate-800/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50"}`}>
                  <td className="px-5 py-4 text-sm font-mono" style={{ color: "var(--rf-accent)" }}>{item.id}</td>
                  <td className="px-5 py-4"><p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{item.description}</p></td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{item.location}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{item.trade}</td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full ${PRIORITY_COLORS[item.priority]}`}>{item.priority}</span></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[item.status]}`}>{item.status.replace("_", " ")}</span></td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{item.assignedTo}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{item.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-full max-w-md rounded-xl p-6 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"}`}>
              <h2 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Add Punch List Item</h2>
              <div className="space-y-4">
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Description</label><input type="text" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Location</label><input type="text" value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Trade</label><input type="text" value={newItem.trade} onChange={(e) => setNewItem({ ...newItem, trade: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Priority</label><select value={newItem.priority} onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2 rounded-lg text-sm ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                <button onClick={handleAdd} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 text-white" : "bg-sky-600 text-white"}`}>Add Item</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
