import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { apiRequest } from '../lib/api';
import type { MonitorRecord } from '../types';
import './Dashboard.css';

export default function Dashboard() {
  const [monitors, setMonitors] = useState<MonitorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newInterval, setNewInterval] = useState(5);

  useEffect(() => {
    fetchMonitors();
  }, []);

  async function fetchMonitors() {
    setLoading(true);
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return;

    try {
      const data = await apiRequest('/api/monitor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMonitors(data.monitors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return;

    try {
      await apiRequest('/api/monitor', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url: newUrl, interval_minutes: newInterval })
      });
      setNewUrl('');
      setNewInterval(5);
      fetchMonitors();
    } catch (err: any) {
      alert('Error adding monitor: ' + err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this monitor?')) return;
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return;

    try {
      await apiRequest(`/api/monitor/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMonitors();
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="dashboard">
      <header>
        <h1>URL Monitors</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </header>

      <div className="add-monitor">
        <input
          type="url"
          placeholder="https://example.com"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
        />
        <input
          type="number"
          min={1}
          max={60}
          value={newInterval}
          onChange={e => setNewInterval(Number(e.target.value))}
        />
        <button onClick={handleAdd}>Add Monitor</button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && monitors.length === 0 && <p>No monitors yet. Add one above!</p>}

      <div className="monitors-grid">
        {monitors.map(m => (
          <div key={m.id} className="monitor-card">
            <div className="monitor-header">
              <h3>{m.url}</h3>
              <button className="delete-btn" onClick={() => handleDelete(m.id)}>
                ✕
              </button>
            </div>
            <div className="monitor-info">
              <span className={`status ${m.last_status}`}>{m.last_status.toUpperCase()}</span>
              <span>Check every {m.interval_minutes}m</span>
            </div>
            {m.last_checked && (
              <p className="last-check">Last checked: {new Date(m.last_checked).toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
