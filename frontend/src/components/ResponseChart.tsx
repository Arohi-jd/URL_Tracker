import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { apiService } from '../services/api'
import { UptimeLog } from '../types'

interface ResponseChartProps {
  urlId: string
}

interface ChartData {
  time: string
  responseTime: number
}

const ResponseChart: React.FC<ResponseChartProps> = ({ urlId }) => {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [urlId])

  const loadData = async () => {
    try {
      const logs = await apiService.getLogs(urlId, 50)
      const chartData = logs
        .reverse()
        .map(log => ({
          time: new Date(log.checked_at).toLocaleTimeString(),
          responseTime: log.response_time
        }))
      setData(chartData)
    } catch (error) {
      console.error('Failed to load chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Loading chart...</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Response Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="responseTime" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ResponseChart