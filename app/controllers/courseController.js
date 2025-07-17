import supabase from '../../config/supabaseClient.js'; // adjust path

// Fetch all courses
export const getAllCourses = async (req, res) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ courses: data });
};

// Create a new course
export const createCourse = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Course name is required.' });
  }

  const { data, error } = await supabase
    .from('courses')
    .insert([{ name }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Course created', course: data[0] });
};

// Update a course by id
export const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Course name is required.' });
  }

  const { data, error } = await supabase
    .from('courses')
    .update({ name })
    .eq('id', courseId)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Course not found.' });
  }

  res.json({ message: 'Course updated', course: data[0] });
};

// Delete a course by id (hard delete)
export const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  const { data, error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Course not found.' });
  }

  res.json({ message: 'Course deleted', course: data[0] });
};
