import { supabase } from '../config/supabaseClient.js';

export const assignSelfcarePlan = async (req, res) => {
  try {
    const { user_id, plan_title, plan_duration = '7 days', daily_activity, goal } = req.body;
    if (!user_id || !plan_title || !daily_activity || !goal) {
      return res.status(400).json({ success: false, message: 'user_id, plan_title, daily_activity and goal are required.' });
    }

    const { data, error } = await supabase
      .from('selfcare_plans')
      .insert([{ user_id, assigned_by: req.user.id, plan_title, plan_duration, daily_activity, goal, status: 'active' }])
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Self-care plan assigned successfully.', plan: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to assign self-care plan.' });
  }
};

export const getMySelfcarePlans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('selfcare_plans')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, plans: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load self-care plans.' });
  }
};
