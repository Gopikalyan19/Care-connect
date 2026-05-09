import { supabase } from '../config/supabaseClient.js';

export const addSessionNote = async (req, res) => {
  try {
    const { request_id, note_type = 'peer', summary, risk_level = 'low', follow_up_required = false, follow_up_date = null } = req.body;
    if (!request_id || !summary) return res.status(400).json({ success: false, message: 'request_id and summary are required.' });

    const { data, error } = await supabase
      .from('session_notes')
      .insert([{ request_id, added_by: req.user.id, note_type, summary, risk_level, follow_up_required, follow_up_date }])
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Session note added successfully.', note: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to add session note.' });
  }
};

export const getSessionNotes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('session_notes')
      .select('*, profiles:added_by(full_name,role)')
      .eq('request_id', req.params.request_id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, notes: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load session notes.' });
  }
};
