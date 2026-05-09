import { supabase } from '../config/supabaseClient.js';

export const getAllRequests = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*, profiles:user_id(full_name,email,phone,role,college,department)')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, requests: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load requests.' });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, users: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load users.' });
  }
};

export const getAnalytics = async (_req, res) => {
  try {
    const [users, requests, pending, completed, highUrgency] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('support_requests').select('*', { count: 'exact', head: true }),
      supabase.from('support_requests').select('*', { count: 'exact', head: true }).in('status', ['submitted', 'assigned', 'scheduled']),
      supabase.from('support_requests').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('support_requests').select('*', { count: 'exact', head: true }).eq('urgency_level', 'high'),
    ]);

    const firstError = [users, requests, pending, completed, highUrgency].find(x => x.error)?.error;
    if (firstError) return res.status(500).json({ success: false, message: firstError.message });

    return res.json({
      success: true,
      analytics: {
        total_users: users.count || 0,
        total_requests: requests.count || 0,
        pending: pending.count || 0,
        completed: completed.count || 0,
        high_urgency: highUrgency.count || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load analytics.' });
  }
};

export const assignRequest = async (req, res) => {
  try {
    const { assigned_to, status = 'assigned' } = req.body;
    if (!assigned_to) return res.status(400).json({ success: false, message: 'assigned_to is required.' });

    const { data, error } = await supabase
      .from('support_requests')
      .update({ assigned_to, status })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Request assigned successfully.', request: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Assignment failed.' });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const valid = ['submitted', 'assigned', 'scheduled', 'completed', 'closed', 'cancelled'];
    const status = String(req.body.status || '').trim().toLowerCase();
    if (!valid.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status value.' });

    const { data, error } = await supabase
      .from('support_requests')
      .update({ status })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Status updated successfully.', request: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Status update failed.' });
  }
};
