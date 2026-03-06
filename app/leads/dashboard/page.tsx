"use client"

import { useAuth } from "@/lib/auth/AuthContext"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { useState } from "react"
import { Users, ClipboardList, TrendingUp, Home, MoreHorizontal } from "lucide-react"

export default function LeadsDashboard() {
  const { user, userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <p className="mb-4">Please log in to view this page</p>
          <a href="/welcome" className="text-[#F37120] hover:underline">Go to Welcome</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#333] p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Lead Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome, {userProfile?.full_name || 'Lead'}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Navigation */}
      <div className="border-b border-[#333] p-4 flex gap-6">
        {[
          { icon: Home, label: "Dashboard", id: "dashboard" },
          { icon: Users, label: "Leads", id: "leads" },
          { icon: ClipboardList, label: "Follow-ups", id: "followups" },
          { icon: TrendingUp, label: "Pipeline", id: "pipeline" },
          { icon: MoreHorizontal, label: "More", id: "more" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-[#F37120] text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">New Leads</p>
            <p className="text-4xl font-bold">12</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Follow-ups Due</p>
            <p className="text-4xl font-bold">5</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Conversion Rate</p>
            <p className="text-4xl font-bold">28%</p>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Lead Dashboard - Overview</h2>
            <p className="text-gray-300">View and manage your leads, schedule follow-ups, and track conversions.</p>
          </div>
        )}

        {activeTab === "leads" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Leads List</h2>
            <p className="text-gray-300">Manage all your assigned leads here.</p>
          </div>
        )}

        {activeTab === "followups" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Follow-ups</h2>
            <p className="text-gray-300">Schedule and track follow-up activities with leads.</p>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Sales Pipeline</h2>
            <p className="text-gray-300">View your leads in each stage of the conversion pipeline.</p>
          </div>
        )}
      </div>
    </div>
  )
}
