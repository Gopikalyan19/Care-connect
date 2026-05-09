import { supabase } from '../config/supabaseClient.js';

export const getResources = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, resources: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load resources.' });
  }
};

export const createResource = async (req, res) => {
  try {
    const { title, category, resource_type = 'article', file_url = null, description = null } = req.body;
    if (!title || !category) return res.status(400).json({ success: false, message: 'title and category are required.' });

    const { data, error } = await supabase
      .from('resources')
      .insert([{ title, category, resource_type, file_url, description, created_by: req.user.id }])
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Resource created successfully.', resource: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create resource.' });
  }
};
