"use client";

import { useState, useEffect } from "react";
import Layout from "@/containers/Layout";
import { getUser } from "@/services/instance/tokenService";

const SAMPLE_CHANNELS = [
  { id: 1, name: "General", unread: 3, lastMessage: "Site meeting at 2pm" },
  { id: 2, name: "HVAC Team", unread: 0, lastMessage: "AHU-1 testing complete" },
  { id: 3, name: "Electrical", unread: 5, lastMessage: "Panel schedule updated" },
  { id: 4, name: "QA/QC", unread: 1, lastMessage: "ITR review needed" },
];

const SAMPLE_MESSAGES = [
  { id: 1, sender: "John Smith", content: "Good morning team! Ready to start commissioning activities.", time: "8:30 AM", isMe: false },
  { id: 2, sender: "You", content: "Morning! I have the checklists ready for today.", time: "8:32 AM", isMe: true },
  { id: 3, sender: "Jane Doe", content: "The HVAC contractor will be on site at 9am.", time: "8:35 AM", isMe: false },
  { id: 4, sender: "You", content: "Perfect, I will meet them at the mechanical room.", time: "8:36 AM", isMe: true },
  { id: 5, sender: "Mike Johnson", content: "Site meeting scheduled for 2pm in the trailer.", time: "9:15 AM", isMe: false },
];

export default function ChatPage() {
  const [channels, setChannels] = useState(SAMPLE_CHANNELS);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [activeChannel, setActiveChannel] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
    const userData = getUser();
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const isDark = theme === "dark";

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = { id: messages.length + 1, sender: "You", content: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isMe: true };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)]" style={{ background: "var(--rf-bg)" }}>
        {/* Channels Sidebar */}
        <div className={`w-64 border-r flex flex-col ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="p-4 border-b" style={{ borderColor: isDark ? "var(--rf-border)" : "#e2e8f0" }}>
            <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Channels</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {channels.map((channel) => (
              <button key={channel.id} onClick={() => setActiveChannel(channel.id)} className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-all ${activeChannel === channel.id ? (isDark ? "bg-cyan-600/20 text-cyan-400" : "bg-sky-100 text-sky-700") : (isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium"># {channel.name}</span>
                  {channel.unread > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? "bg-cyan-600 text-white" : "bg-sky-600 text-white"}`}>{channel.unread}</span>}
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--rf-txt3)" }}>{channel.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className={`px-6 py-4 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
            <h2 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}># {channels.find(c => c.id === activeChannel)?.name}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${msg.isMe ? (isDark ? "bg-cyan-600 text-white" : "bg-sky-600 text-white") : (isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-800")}`}>
                  {!msg.isMe && <p className="text-xs font-semibold mb-1" style={{ color: msg.isMe ? "rgba(255,255,255,0.8)" : "var(--rf-accent)" }}>{msg.sender}</p>}
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1" style={{ opacity: 0.7 }}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
            <div className="flex gap-3">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSend()} placeholder="Type a message..." className={`flex-1 px-4 py-2.5 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`} />
              <button onClick={handleSend} className={`px-6 py-2.5 rounded-lg text-sm font-medium ${isDark ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-sky-600 hover:bg-sky-500 text-white"}`}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
