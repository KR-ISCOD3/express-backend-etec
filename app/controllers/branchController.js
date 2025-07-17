// controllers/branchController.js
import supabase from '../../config/supabaseClient.js';

export const getBranches = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('id', { ascending: true }); // or descending as you want

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ branches: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
