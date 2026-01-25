import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { apiRequest } from '../lib/api';
import type { MonitorRecord, StatusLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MonitorDetail.css';

export default function MonitorDetail() {
  const { id } = useParams<{ id: string }>();
  const [monitor, setMonitor] = useState<MonitorRecord | null>(null);
  const [logs, setLogs] = useState<StatusLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitor();
    fetchLogs();
    const channel = supabase
      .channel(`url_status_logs:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'url_status_logs', filter: `url_id=eq.${id}` }, payload => {
        setLogs(prev => [payload.new as StatusLog, ...prev].slice(0, 500));
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  async function fetchMonitor() {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token || !id) return;

    try {
      const data = await apiRequest('/api/monitor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const found = (data.monitors || []).find((m: MonitorRecord) => m.id === id);
      setMonitor(found || null);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchLogs() {
    setLoading(true);
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token || !id) return;

    try {
      const data = await apiRequest(`/api/monitor/${id}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const chartData = logs
    .slice()
    .reverse()
    .slice(-100)
    .map(log => ({
      ts: new Date(log.ts).toLocaleTimeString(),
      ms: log.response_time_ms || 0
    }));

  return (
    <div className="monitor-detail">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      {monitor && <h2>{monitor.url}</h2>}
      {loading && <p>Loading...</p>}
      {!loading && logs.length === 0 && <p>No status logs yet.</p>}

      {logs.length > 0 && (
        <>
          <div className="chart-container">
            <h3>Response Time (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ts" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ms" stroke="#667eea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="logs-table">
            <h3>Recent Checks</h3>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Response Time</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 50).map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.ts).toLocaleString()}</td>
                    <td>
                      <span className={`status ${log.status}`}>{log.status.toUpperCase()}</span>
                    </td>
                    <td>{log.response_time_ms ? `${log.response_time_ms} ms` : 'N/A'}</td>
                    <td>{log.error || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
