import React, { useState, useEffect } from 'react'
import { MonitoredUrl, UptimeLog } from '../types'
import { apiService } from '../services/api'

const Dashboard: React.FC = () => {
  const [monitors, setMonitors] = useState<MonitoredUrl[]>([])
  const [logs, setLogs] = useState<Record<string, UptimeLog[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const monitorsData = await apiService.getMonitors()
      setMonitors(monitorsData)
      
      // Load recent logs for each monitor
      const logsData: Record<string, UptimeLog[]> = {}
      for (const monitor of monitorsData) {
        const monitorLogs = await apiService.getLogs(monitor.id, 10)
        logsData[monitor.id] = monitorLogs
      }
      setLogs(logsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLatestStatus = (monitorId: string): 'UP' | 'DOWN' | 'UNKNOWN' => {
    const monitorLogs = logs[monitorId]
    return monitorLogs?.[0]?.status || 'UNKNOWN'
  }

  const calculateUptime = (monitorId: string): number => {
    const monitorLogs = logs[monitorId] || []
    if (monitorLogs.length === 0) return 0
    const upCount = monitorLogs.filter(log => log.status === 'UP').length
    return Math.round((upCount / monitorLogs.length) * 100)
  }

  const totalUrls = monitors.length
  const downUrls = monitors.filter(m => getLatestStatus(m.id) === 'DOWN').length
  const avgUptime = monitors.length > 0 
    ? Math.round(monitors.reduce((sum, m) => sum + calculateUptime(m.id), 0) / monitors.length)
    : 0

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total URLs</h3>
          <p className="text-2xl font-bold text-gray-900">{totalUrls}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Uptime</h3>
          <p className="text-2xl font-bold text-green-600">{avgUptime}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Down URLs</h3>
          <p className="text-2xl font-bold text-red-600">{downUrls}</p>
        </div>
      </div>

      {/* URLs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Monitored URLs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uptime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interval</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monitors.map((monitor) => {
                const status = getLatestStatus(monitor.id)
                const uptime = calculateUptime(monitor.id)
                
                return (
                  <tr key={monitor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{monitor.url}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        status === 'UP' ? 'bg-green-100 text-green-800' :
                        status === 'DOWN' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {uptime}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {monitor.interval_minutes}m
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard