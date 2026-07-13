"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, LogIn, Upload, Activity } from "lucide-react"

export default function SecurityDashboard() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/admin/security-events")
        if (res.ok) {
          const data = await res.json()
          setEvents(data.events || [])
        }
      } catch (err) {
        console.error("Failed to load events", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "failed_login": return <LogIn className="w-5 h-5 text-orange-500" />
      case "rate_limit_exceeded": return <Activity className="w-5 h-5 text-yellow-500" />
      case "upload_failure": return <Upload className="w-5 h-5 text-red-500" />
      case "suspicious_activity": return <AlertTriangle className="w-5 h-5 text-red-600" />
      default: return <Shield className="w-5 h-5 text-blue-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    }
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[severity] || colors.medium}`}>
        {severity.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm">Event Type</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Severity</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Details</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">IP / User</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading security logs...</td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No security events found.</td></tr>
              ) : (
                events.map((ev, i) => (
                  <tr key={ev._id || i} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getIcon(ev.eventType)}
                        <span className="font-medium capitalize">{ev.eventType.replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="p-4">{getSeverityBadge(ev.severity)}</td>
                    <td className="p-4 max-w-xs truncate" title={ev.details}>{ev.details}</td>
                    <td className="p-4 text-gray-600">
                      <div>{ev.ipAddress || 'Unknown IP'}</div>
                      {ev.email && <div className="text-xs">{ev.email}</div>}
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {new Date(ev.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
