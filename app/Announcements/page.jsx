"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";

const SAMPLE_ANNOUNCEMENTS = [
  { id: 1, title: "Safety Stand-Down Scheduled", content: "All personnel are required to attend the safety stand-down meeting on Friday at 10:00 AM in the main conference room.", priority: "HIGH", author: "Safety Manager", date: "2024-01-17", category: "Safety" },
  { id: 2, title: "Phase 2 Commissioning Begins Next Week", content: "We will be starting Phase 2 commissioning activities on Monday. Please ensure all Phase 1 punch list items are completed.", priority: "MEDIUM", author: "Project Manager", date: "2024-01-16", category: "Project" },
  { id: 3, title: "New Document Templates Available", content: "Updated ITR and checklist templates have been uploaded to the document library. Please use the new versions going forward.", priority: "LOW", author: "QA/QC Lead", date: "2024-01-15", category: "Documentation" },
  { id: 4, title: "Weather Advisory - Rain Expected", content: "Heavy rain is expected Thursday through Saturday. Please plan indoor activities and secure outdoor equipment.", priority: "MEDIUM", author: "Site Superintendent", date: "2024-01-14", category: "Weather" },
];

const PRIORITY_COLORS = { HIGH: "bg-red-500/20 text-red-300 border-red-500/30", MEDIUM: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", LOW: "bg-gray-700/60 text-gray-300 border-gray-600/30" };
const CATEGORY_COLORS = { Safety: "bg-red-500/20 text-red-300", Project: "bg-cyan-500/20 text-cyan-300", Documentation: "bg-blue-500/20 text-blue-300", Weather: "bg-purple-500/20 text-purple-300" };

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", priority: "MEDIUM", category: "Project" });

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
    const saved = localStorage.getItem("announcements");
    if (saved) setAnnouncements(JSON.parse(saved));
    else { setAnnouncements(SAMPLE_ANNOUNCEMENTS); localStorage.setItem("announcements", JSON.stringify(SAMPLE_ANNOUNCEMENTS)); }
  }, []);

  const isDark = theme === "dark";

  const handleAdd = () => {
    const announcement = { id: announcements.length + 1, ...newAnnouncement, author: "Admin User", date: new Date().toISOString().split("T")[0] };
    const updated = [announcement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
    setShowModal(false);
    setNewAnnouncement({ title: "", content: "", priority: "MEDIUM", category: "Project" });
  };

  return (
    <Layout>
      <div className="p-8" style={{ background: "var(--rf-bg)", minHeight: "100vh" }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Announcements</h1>
            <p className="text-sm mt-1" style={{ color: "var(--rf-txt2)" }}>Project updates and important notices</p>
          </div>
          <button onClick={() => setShowModal(true)} className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}>+ New Announcement</button>
        </div>

        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item.id} className={`rounded-xl p-5 border ${isDark ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"} transition-all`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${CATEGORY_COLORS[item.category]}`}>{item.category}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${PRIORITY_COLORS[item.priority]}`}>{item.priority}</span>
                </div>
                <span className="text-xs" style={{ color: "var(--rf-txt3)" }}>{item.date}</span>
              </div>
              <h3 className={`text-base font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{item.title}</h3>
              <p className="text-sm mb-3" style={{ color: "var(--rf-txt2)" }}>{item.content}</p>
              <p className="text-xs" style={{ color: "var(--rf-txt3)" }}>Posted by {item.author}</p>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-full max-w-lg rounded-xl p-6 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"}`}>
              <h2 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>New Announcement</h2>
              <div className="space-y-4">
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Title</label><input type="text" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Content</label><textarea value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} rows={4} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Priority</label><select value={newAnnouncement.priority} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: "var(--rf-txt2)" }}>Category</label><select value={newAnnouncement.category} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}><option value="Project">Project</option><option value="Safety">Safety</option><option value="Documentation">Documentation</option><option value="Weather">Weather</option></select></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className={`flex-1 px-4 py-2 rounded-lg text-sm ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                <button onClick={handleAdd} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 text-white" : "bg-sky-600 text-white"}`}>Post Announcement</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
