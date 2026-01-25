import cron from 'node-cron';
import axios from 'axios';
import { supabaseAdmin } from '../lib/supabase.js';
import type { MonitorRecord } from '../types.js';

function ms() { return new Date().toISOString(); }

export function startScheduler() {
  // Every minute, pick monitors that need checking.
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 60 * 1000 * 1).toISOString();

    // Fetch active monitors that either never checked or due by interval
    const { data: monitors, error } = await supabaseAdmin
      .rpc('get_due_monitors');

    if (error) {
      console.error('Scheduler: fetch error', error.message);
      return;
    }

    for (const m of (monitors as MonitorRecord[])) {
      try {
        const start = performance.now();
        const resp = await axios.get(m.url, { timeout: 10000, validateStatus: () => true });
        const elapsed = Math.round(performance.now() - start);
        const status: 'up' | 'down' = resp.status >= 200 && resp.status < 400 ? 'up' : 'down';

        await supabaseAdmin.from('url_status_logs').insert({
          url_id: m.id,
          status,
          response_time_ms: elapsed,
          error: null
        });

        await supabaseAdmin
          .from('monitored_urls')
          .update({ last_checked: new Date().toISOString(), last_status: status })
          .eq('id', m.id);

        // Simple change-detection to trigger notifications (stub)
        if (m.last_status !== status) {
          await supabaseAdmin.from('notifications').insert({
            url_id: m.id,
            type: 'email',
            status: 'queued',
            message: status === 'down' ? `Site down: ${m.url}` : `Back up: ${m.url}`
          });
          console.log(`[${ms()}] Status change ${m.url}: ${m.last_status} -> ${status}`);
        }
      } catch (err: any) {
        const msg = err?.message || 'request failed';
        await supabaseAdmin.from('url_status_logs').insert({
          url_id: m.id,
          status: 'down',
          response_time_ms: null,
          error: msg
        });
        await supabaseAdmin
          .from('monitored_urls')
          .update({ last_checked: new Date().toISOString(), last_status: 'down' })
          .eq('id', m.id);
        console.warn(`[${ms()}] Error checking ${m.url}: ${msg}`);
      }
    }
  });
}
