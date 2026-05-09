import jwt from 'jsonwebtoken';
import { supabase, hasSupabaseConfig } from '../config/supabaseClient.js';

const allowedRoles = ['student', 'faculty', 'member', 'peer', 'selfcare', 'psychologist', 'psychiatrist', 'admin'];

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function createToken(profile) {
  return jwt.sign(
    { id: profile.id, email: profile.email, role: profile.role },
    process.env.JWT_SECRET || 'change_this_secret',
    { expiresIn: '7d' }
  );
}

export const register = async (req, res) => {
  try {
    if (!hasSupabaseConfig()) {
      return res.status(500).json({ success: false, message: 'Supabase is not configured. Check backend/.env.' });
    }

    const full_name = String(req.body.full_name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const role = String(req.body.role || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').trim() || null;
    const college = String(req.body.college || '').trim() || null;
    const department = String(req.body.department || '').trim() || null;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Full name, email, password and role are required.' });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id,email')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      return res.status(409).json({ success: false, message: 'This email is already registered. Please login.' });
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });

    if (authError) {
      return res.status(400).json({ success: false, message: authError.message });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{ auth_user_id: authData.user.id, full_name, email, phone, role, college, department }])
      .select('*')
      .single();

    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id).catch(() => null);
      return res.status(500).json({ success: false, message: profileError.message });
    }

    return res.status(201).json({ success: true, message: 'Account created successfully.', profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

export const login = async (req, res) => {
  try {
    if (!hasSupabaseConfig()) {
      return res.status(500).json({ success: false, message: 'Supabase is not configured. Check backend/.env.' });
    }

    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !authData.user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .maybeSingle();

    if (!profile) {
      const meta = authData.user.user_metadata || {};
      const { data: createdProfile, error: createProfileError } = await supabase
        .from('profiles')
        .insert([{
          auth_user_id: authData.user.id,
          full_name: meta.full_name || email.split('@')[0],
          email,
          role: meta.role || 'student',
          status: 'active',
        }])
        .select('*')
        .single();
      profile = createdProfile;
      profileError = createProfileError;
    }

    if (profileError || !profile) {
      return res.status(404).json({ success: false, message: 'Profile not found. Please contact admin.' });
    }

    const token = createToken(profile);
    return res.json({ success: true, message: 'Login successful.', token, role: profile.role, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};
