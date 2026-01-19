import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiService } from '../services/api'

interface StatusItem {
  id: string
  url: string
  currentStatus: 'UP' | 'DOWN' | 'UNKNOWN'
  uptime: number
  lastChecked: string
}

const StatusPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const [services, setServices] = useState<StatusItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadStatus()
    }
  }, [userId])

  const loadStatus = async () => {
    try {
      const data = await apiService.getPublicStatus(userId!)
      setServices(data)
    } catch (error) {
      console.error('Failed to load status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP': return 'bg-green-500'
      case 'DOWN': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UP': return 'Operational'
      case 'DOWN': return 'Down'
      default: return 'Unknown'
    }
  }

  const overallStatus = services.every(s => s.currentStatus === 'UP') ? 'All Systems Operational' : 'Some Systems Down'
  const overallColor = services.every(s => s.currentStatus === 'UP') ? 'text-green-600' : 'text-red-600'

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <div className={`text-xl font-semibold ${overallColor}`}>
            {overallStatus}
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(service.currentStatus)}`}></div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{service.url}</h3>
                    <p className="text-sm text-gray-500">
                      Last checked: {service.lastChecked ? new Date(service.lastChecked).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {getStatusText(service.currentStatus)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.uptime}% uptime
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Status updates every 5 minutes</p>
        </div>
      </div>
    </div>
  )
}

export default StatusPage