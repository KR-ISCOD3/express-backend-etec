// controllers/roomController.js
import supabase from '../../config/supabaseClient.js';

export const getRoomsWithBranches = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        *,
        branches (
          id,
          branch_name
        )
      `)
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ rooms: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
