import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase.js';
import type { MonitorRecord, StatusLog } from '../types.js';

const router = Router();

const createSchema = z.object({
  url: z.string().url(),
  interval_minutes: z.number().int().min(1).max(60).default(5)
});

router.get('/', async (req, res) => {
  const userId = req.userId!;
  const { data, error } = await supabaseAdmin
    .from('monitored_urls')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ monitors: data as MonitorRecord[] });
});

router.post('/', async (req, res) => {
  const userId = req.userId!;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { url, interval_minutes } = parsed.data;
  const { data, error } = await supabaseAdmin
    .from('monitored_urls')
    .insert({ url, interval_minutes, user_id: userId, is_active: true, last_status: 'unknown' })
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ monitor: data as MonitorRecord });
});

router.delete('/:id', async (req, res) => {
  const userId = req.userId!;
  const id = req.params.id;
  const { data: found, error: findErr } = await supabaseAdmin
    .from('monitored_urls')
    .select('id,user_id')
    .eq('id', id)
    .single();
  if (findErr || !found) return res.status(404).json({ error: 'Not found' });
  if (found.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

  const { error } = await supabaseAdmin.from('monitored_urls').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

router.get('/:id/status', async (req, res) => {
  const userId = req.userId!;
  const id = req.params.id;
  // Verify ownership
  const { data: found, error: findErr } = await supabaseAdmin
    .from('monitored_urls')
    .select('id,user_id')
    .eq('id', id)
    .single();
  if (findErr || !found) return res.status(404).json({ error: 'Not found' });
  if (found.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabaseAdmin
    .from('url_status_logs')
    .select('*')
    .eq('url_id', id)
    .order('ts', { ascending: false })
    .limit(500);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ logs: data as StatusLog[] });
});

export default router;
