import { supabase } from '../config/supabaseClient.js';

export const submitFeedback = async (req, res) => {
  try {
    const { request_id, rating, feedback_text = null } = req.body;
    const numericRating = Number(rating);
    if (!request_id || !numericRating) return res.status(400).json({ success: false, message: 'request_id and rating are required.' });
    if (numericRating < 1 || numericRating > 5) return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });

    const { data, error } = await supabase
      .from('feedback')
      .insert([{ request_id, user_id: req.user.id, rating: numericRating, feedback_text }])
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Feedback submitted successfully.', feedback: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to submit feedback.' });
  }
};

export const getFeedback = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*, profiles:user_id(full_name,email), support_requests:request_id(request_code,category)')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, feedback: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load feedback.' });
  }
};
