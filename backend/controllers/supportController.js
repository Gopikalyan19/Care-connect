import { supabase } from '../config/supabaseClient.js';

const categoryPrefixes = {
  peer: 'PC',
  selfcare: 'SC',
  psychologist: 'PSY',
  psychiatrist: 'PSYT',
};

function makeRequestCode(category) {
  const prefix = categoryPrefixes[category] || 'REQ';
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900);
  return `NAU-${prefix}-${stamp}${random}`;
}

export const createSupportRequest = async (req, res) => {
  try {
    const user_id = req.user.id;
    const category = String(req.body.category || '').trim().toLowerCase();
    const concern_type = String(req.body.concern_type || 'general').trim();
    const description = String(req.body.description || '').trim();
    const preferred_date = req.body.preferred_date;
    const preferred_time = req.body.preferred_time;
    const mode = String(req.body.mode || 'online').trim().toLowerCase();
    const urgency_level = String(req.body.urgency_level || 'low').trim().toLowerCase();

    if (!category || !description || !preferred_date || !preferred_time) {
      return res.status(400).json({ success: false, message: 'Category, description, preferred date and preferred time are required.' });
    }

    const { data, error } = await supabase
      .from('support_requests')
      .insert([{
        request_code: makeRequestCode(category),
        user_id,
        category,
        concern_type,
        description,
        preferred_date,
        preferred_time,
        mode,
        urgency_level,
        status: 'submitted',
      }])
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Support request submitted successfully.', request: data, request_code: data.request_code });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create support request.' });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, requests: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load requests.' });
  }
};

export const getAssignedRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*, profiles:user_id(full_name,email,phone,role,college,department)')
      .eq('assigned_to', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, requests: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load assigned requests.' });
  }
};

export const getSingleRequest = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*, profiles:user_id(full_name,email,phone,role,college,department)')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Request not found.' });
    return res.json({ success: true, request: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load request.' });
  }
};
