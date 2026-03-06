"use client"

import { useAuth } from "@/lib/auth/AuthContext"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { useState } from "react"
import { Users, DollarSign, UserCog, Settings, Home } from "lucide-react"

export default function AdminDashboard() {
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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome, {userProfile?.full_name || 'Admin'}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Navigation */}
      <div className="border-b border-[#333] p-4 flex gap-6">
        {[
          { icon: Home, label: "Dashboard", id: "dashboard" },
          { icon: Users, label: "Members", id: "members" },
          { icon: DollarSign, label: "Payments", id: "payments" },
          { icon: UserCog, label: "Staff", id: "staff" },
          { icon: Settings, label: "Settings", id: "settings" },
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Members</p>
            <p className="text-4xl font-bold">247</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Revenue (Month)</p>
            <p className="text-4xl font-bold">₱184K</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Active Staff</p>
            <p className="text-4xl font-bold">8</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Pending Payments</p>
            <p className="text-4xl font-bold">12</p>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Admin Overview</h2>
            <p className="text-gray-300">System-wide statistics and key metrics. Manage all aspects of BearFitPH here.</p>
          </div>
        )}

        {activeTab === "members" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Members Management</h2>
            <p className="text-gray-300">View, manage, and support all member accounts.</p>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Management</h2>
            <p className="text-gray-300">Process payments, view transaction history, and manage billing.</p>
          </div>
        )}

        {activeTab === "staff" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Staff Management</h2>
            <p className="text-gray-300">Manage coaches, trainers, and staff members.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">System Settings</h2>
            <p className="text-gray-300">Configure global settings and system parameters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
