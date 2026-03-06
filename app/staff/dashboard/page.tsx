"use client"

import { useAuth } from "@/lib/auth/AuthContext"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { useState } from "react"
import { Users, Calendar, TrendingUp, Home, MoreHorizontal } from "lucide-react"

export default function StaffDashboard() {
  const { user, userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("home")

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
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome, {userProfile?.full_name || 'Coach'}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Navigation */}
      <div className="border-b border-[#333] p-4 flex gap-6">
        {[
          { icon: Home, label: "Home", id: "home" },
          { icon: Calendar, label: "Schedule", id: "schedule" },
          { icon: Users, label: "Clients", id: "clients" },
          { icon: TrendingUp, label: "Stats", id: "stats" },
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
            <p className="text-gray-400 text-sm mb-2">Today's Sessions</p>
            <p className="text-4xl font-bold">5</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Active Clients</p>
            <p className="text-4xl font-bold">18</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Rating</p>
            <p className="text-4xl font-bold">4.9★</p>
          </div>
        </div>

        {activeTab === "home" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Staff Dashboard - Home View</h2>
            <p className="text-gray-300">Schedule clients, track sessions, and view your statistics here.</p>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Schedule</h2>
            <p className="text-gray-300">Manage your daily and weekly sessions with clients.</p>
          </div>
        )}

        {activeTab === "clients" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">My Clients</h2>
            <p className="text-gray-300">View and manage all your assigned clients.</p>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Statistics</h2>
            <p className="text-gray-300">View your performance metrics and analytics.</p>
          </div>
        )}
      </div>
    </div>
  )
}
