"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";
import { getUser } from "@/services/instance/tokenService";

const SAMPLE_TASKS = [
  { id: 1, title: "Complete QA/QC Checklist - HVAC System", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2024-01-20", project: "Building A" },
  { id: 2, title: "Review ITR Documentation", status: "PENDING", priority: "MEDIUM", dueDate: "2024-01-22", project: "Building A" },
  { id: 3, title: "Submit Daily Field Log", status: "PENDING", priority: "HIGH", dueDate: "2024-01-19", project: "Building B" },
  { id: 4, title: "Verify NCR Closure", status: "COMPLETED", priority: "LOW", dueDate: "2024-01-18", project: "Building A" },
  { id: 5, title: "Attend Safety Meeting", status: "PENDING", priority: "MEDIUM", dueDate: "2024-01-21", project: "Site Wide" },
];

const STATUS_COLORS = {
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  IN_PROGRESS: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  COMPLETED: "bg-green-500/20 text-green-300 border-green-500/30",
};

const PRIORITY_COLORS = {
  LOW: "bg-gray-700/60 text-gray-300",
  MEDIUM: "bg-blue-500/20 text-blue-300",
  HIGH: "bg-red-500/20 text-red-300",
};

export default function MyWorkPage() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    const savedTasks = localStorage.getItem("mywork_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(SAMPLE_TASKS);
      localStorage.setItem("mywork_tasks", JSON.stringify(SAMPLE_TASKS));
    }
  }, []);

  const isDark = theme === "dark";
  const filteredTasks = filter === "ALL" ? tasks : tasks.filter(t => t.status === filter);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "PENDING").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    completed: tasks.filter(t => t.status === "COMPLETED").length,
  };

  return (
    <Layout>
      <div className="p-8" style={{ background: "var(--rf-bg)", minHeight: "100vh" }}>
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>My Work</h1>
          <p className="text-sm mt-1" style={{ color: "var(--rf-txt2)" }}>Your assigned tasks and action items</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Tasks", value: stats.total, color: "text-cyan-400" },
            { label: "Pending", value: stats.pending, color: "text-yellow-400" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-400" },
            { label: "Completed", value: stats.completed, color: "text-green-400" },
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? (isDark ? "bg-cyan-600 text-white" : "bg-sky-600 text-white") : (isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}`}>
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
          <table className="w-full">
            <thead>
              <tr className={isDark ? "border-b border-slate-800" : "border-b border-slate-200"}>
                {["Task", "Project", "Priority", "Status", "Due Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className={`border-b ${isDark ? "border-slate-800/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50"}`}>
                  <td className="px-5 py-4"><p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{task.title}</p></td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{task.project}</td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[task.status]}`}>{task.status.replace("_", " ")}</span></td>
                  <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
