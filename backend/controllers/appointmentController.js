import { supabase } from '../config/supabaseClient.js';

export const createAppointment = async (req, res) => {
  try {
    const { request_id, appointment_date, appointment_time, meeting_link = null, location = null } = req.body;
    if (!request_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: 'request_id, appointment_date and appointment_time are required.' });
    }

    const { data: request, error: requestError } = await supabase
      .from('support_requests')
      .select('id,user_id,assigned_to')
      .eq('id', request_id)
      .single();

    if (requestError || !request) return res.status(404).json({ success: false, message: 'Support request not found.' });

    const assigned_to = request.assigned_to || req.user.id;
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ request_id, user_id: request.user_id, assigned_to, appointment_date, appointment_time, meeting_link, location, status: 'scheduled' }])
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });

    await supabase.from('support_requests').update({ status: 'scheduled', assigned_to }).eq('id', request_id);
    return res.status(201).json({ success: true, message: 'Appointment created successfully.', appointment: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create appointment.' });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, support_requests:request_id(category,concern_type,description,status)')
      .eq('user_id', req.user.id)
      .order('appointment_date', { ascending: true });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, appointments: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load appointments.' });
  }
};

export const getAssignedAppointments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, profiles:user_id(full_name,email,phone), support_requests:request_id(category,concern_type,description,status)')
      .eq('assigned_to', req.user.id)
      .order('appointment_date', { ascending: true });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, appointments: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load assigned appointments.' });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const valid = ['scheduled', 'completed', 'cancelled'];
    const status = String(req.body.status || '').trim().toLowerCase();
    if (!valid.includes(status)) return res.status(400).json({ success: false, message: 'Invalid appointment status.' });

    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Appointment updated successfully.', appointment: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update appointment.' });
  }
};
