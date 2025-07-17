import supabase from "../../config/supabaseClient.js"; // adjust path as needed



export const getInstructorDashboard = (req, res) => {
    res.json({
      message: 'Welcome to the Instructor Dashboard',
      user: req.user,
    });
};


export const addClass = async (req, res) => {
  const {
    teacher_id,
    room_id,
    branch_id,
    course_id,
    lesson,
    total_student,
    class_status, // optional
    status,
  } = req.body;

  // Optional: validate required fields
  if (
    !teacher_id || !room_id || !branch_id ||
    !course_id ||!lesson|| !total_student || !status
  ) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const { data, error } = await supabase
    .from('classes')
    .insert([
      {
        teacher_id,
        room_id,
        branch_id,
        course_id,
        lesson,
        total_student,
        class_status: class_status || null, // allow null
        status,
        isdeleted: 'disable'
      }
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Class added successfully', data });
};


export const updateClass = async (req, res) => {
  const classId = req.params.id;
  const {
    teacher_id,
    room_id,
    branch_id,
    course_id,
    lesson,
    total_student,
    class_status, // optional
    status,
  } = req.body;

  // Validate required fields (adjust if any are optional)
  if (
    !teacher_id || !room_id || !branch_id ||
    !course_id ||!lesson|| !total_student || !status
  ) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const { data, error } = await supabase
    .from('classes')
    .update({
      teacher_id,
      room_id,
      branch_id,
      course_id,
      lesson,
      total_student,
      class_status: class_status || null,
      status,
    })
    .eq('id', classId)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Class not found' });
  }

  res.json({ message: 'Class updated successfully', data });
};


export const softDeleteClass = async (req, res) => {
  const classId = req.params.id;

  const { data, error } = await supabase
    .from('classes')
    .update({ isdeleted: 'enable' })
    .eq('id', classId)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Class not found' });
  }

  res.json({ message: 'Class deleted (soft) successfully', data });
};
