import supabase from '../../config/supabaseClient.js'
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Missing login credentials' });
  }

  // Check if identifier is an email or username
  const isEmail = /\S+@\S+\.\S+/.test(identifier);
  const field = isEmail ? 'email' : 'fullname_en';

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq(field, identifier)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Password check (plain-text for now, should use hashed passwords)
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_ACCESS,
    { expiresIn: '1h' }
  );

  res.status(200).json({ message: 'Login successful', token });
};
