"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";

const SAMPLE_COURSES = [
  { id: 1, title: "Commissioning Fundamentals", category: "Core", duration: "4 hours", status: "COMPLETED", progress: 100, instructor: "John Davis" },
  { id: 2, title: "HVAC Systems Testing", category: "Mechanical", duration: "6 hours", status: "IN_PROGRESS", progress: 65, instructor: "Sarah Miller" },
  { id: 3, title: "Electrical Safety Procedures", category: "Safety", duration: "2 hours", status: "NOT_STARTED", progress: 0, instructor: "Mike Brown" },
  { id: 4, title: "BMS Integration & Controls", category: "Controls", duration: "8 hours", status: "NOT_STARTED", progress: 0, instructor: "Lisa Chen" },
  { id: 5, title: "Quality Documentation", category: "Core", duration: "3 hours", status: "COMPLETED", progress: 100, instructor: "Tom Wilson" },
];

const SAMPLE_DOCS = [
  { id: 1, title: "Cx Process Manual", type: "PDF", size: "2.4 MB", category: "Procedures", updated: "2024-01-10" },
  { id: 2, title: "ITR Templates Pack", type: "ZIP", size: "5.1 MB", category: "Templates", updated: "2024-01-08" },
  { id: 3, title: "Safety Guidelines 2024", type: "PDF", size: "1.2 MB", category: "Safety", updated: "2024-01-15" },
  { id: 4, title: "ASHRAE Standards Reference", type: "PDF", size: "8.7 MB", category: "Standards", updated: "2024-01-05" },
];

const STATUS_COLORS = { COMPLETED: "bg-green-500/20 text-green-300", IN_PROGRESS: "bg-yellow-500/20 text-yellow-300", NOT_STARTED: "bg-gray-700/60 text-gray-300" };
const CATEGORY_COLORS = { Core: "bg-cyan-500/20 text-cyan-300", Mechanical: "bg-blue-500/20 text-blue-300", Safety: "bg-red-500/20 text-red-300", Controls: "bg-purple-500/20 text-purple-300" };

export default function TrainingPage() {
  const [courses, setCourses] = useState([]);
  const [docs, setDocs] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("courses");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
    const savedCourses = localStorage.getItem("training_courses");
    const savedDocs = localStorage.getItem("training_docs");
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    else { setCourses(SAMPLE_COURSES); localStorage.setItem("training_courses", JSON.stringify(SAMPLE_COURSES)); }
    if (savedDocs) setDocs(JSON.parse(savedDocs));
    else { setDocs(SAMPLE_DOCS); localStorage.setItem("training_docs", JSON.stringify(SAMPLE_DOCS)); }
  }, []);

  const isDark = theme === "dark";

  return (
    <Layout>
      <div className="p-8" style={{ background: "var(--rf-bg)", minHeight: "100vh" }}>
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Training & Library</h1>
          <p className="text-sm mt-1" style={{ color: "var(--rf-txt2)" }}>Access training courses and documentation</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ label: "Total Courses", value: courses.length, color: "text-cyan-400" }, { label: "Completed", value: courses.filter(c => c.status === "COMPLETED").length, color: "text-green-400" }, { label: "In Progress", value: courses.filter(c => c.status === "IN_PROGRESS").length, color: "text-yellow-400" }, { label: "Documents", value: docs.length, color: "text-blue-400" }].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {["courses", "library"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? (isDark ? "bg-cyan-600 text-white" : "bg-sky-600 text-white") : (isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "courses" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className={`rounded-xl p-5 border ${isDark ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"} transition-all cursor-pointer`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${CATEGORY_COLORS[course.category] || "bg-gray-500/20 text-gray-300"}`}>{course.category}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLORS[course.status]}`}>{course.status.replace("_", " ")}</span>
                </div>
                <h3 className={`text-sm font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{course.title}</h3>
                <p className="text-xs mb-3" style={{ color: "var(--rf-txt2)" }}>Instructor: {course.instructor}</p>
                <div className="flex items-center justify-between text-xs" style={{ color: "var(--rf-txt3)" }}>
                  <span>{course.duration}</span>
                  <span>{course.progress}% complete</span>
                </div>
                <div className={`mt-2 h-1.5 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
            <table className="w-full">
              <thead><tr className={isDark ? "border-b border-slate-800" : "border-b border-slate-200"}>{["Document", "Type", "Category", "Size", "Last Updated"].map((h) => (<th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--rf-txt3)" }}>{h}</th>))}</tr></thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc.id} className={`border-b ${isDark ? "border-slate-800/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50"} cursor-pointer`}>
                    <td className="px-5 py-4"><p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{doc.title}</p></td>
                    <td className="px-5 py-4"><span className={`text-xs px-2 py-0.5 rounded ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{doc.type}</span></td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{doc.category}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{doc.size}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--rf-txt2)" }}>{doc.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
