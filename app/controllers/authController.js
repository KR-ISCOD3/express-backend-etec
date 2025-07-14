import supabase from '../../config/supabaseClient.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// login
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Missing login credentials' });
  }

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

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.fullname_en, email: user.email, role: user.role },
    process.env.JWT_SECRET_ACCESS,
    { expiresIn: '365d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });

  res.status(200).json({ message: 'Login successful', token });
};

// register
export const register = async (req, res) => {
  const { fullname_en, email , password } = req.body;

  if (!email || !fullname_en || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${email},fullname_en.eq.${fullname_en}`);

  if (checkError) {
    return res.status(500).json({ message: 'Error checking user' });
  }

  if (existingUser && existingUser.length > 0) {
    return res.status(409).json({ message: 'User already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          fullname_en,
          email,
          password: hashedPassword,
          role: 'instructor',
        },
      ])
      .select() // 👈 get the inserted user back
      .single();

    if (error || !data) {
      return res.status(500).json({ message: 'Registration failed', error });
    }

    // ✅ Create JWT token after successful registration
    const token = jwt.sign(
      {
        id: data.id,
        name: data.fullname_en,
        email: data.email,
        role: data.role,
      },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: '365d' }
    );

    // ✅ Send cookie (same as login)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    return res.status(201).json({
      message: 'User registered and logged in successfully',
      token,
      user: {
        id: data.id,
        name: data.fullname_en,
        email: data.email,
        role: data.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error registering user',
      error: err.message,
    });
  }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};