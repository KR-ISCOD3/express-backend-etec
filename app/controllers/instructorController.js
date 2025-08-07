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
    total_student = 0,
    class_status,
    status = "progress",
    term,
    time,
  } = req.body;

  console.log("Received addClass request:", req.body);

  if (
    !teacher_id || (!room_id && class_status !== "Online") ||
    !branch_id || !course_id || !lesson || total_student == null || !status ||
    !term || !time
  ){
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
        class_status: class_status || null,
        status,
        term,
        time,
        isdeleted: 'disable',
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
    total_student = 0,
    class_status,
    status = "progress",
    term,
    time,
  } = req.body;

  // Validate required fields similar to addClass:
  if (
    !teacher_id ||
    (!room_id && class_status !== "Online") ||
    !branch_id ||
    !course_id ||
    !lesson ||
    total_student == null ||
    !status ||
    !term ||
    !time
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const { data, error } = await supabase
    .from("classes")
    .update({
      teacher_id,
      room_id,
      branch_id,
      course_id,
      lesson,
      total_student,
      class_status: class_status || null,
      status,
      term,
      time,
    })
    .eq("id", classId)
    .select()

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: "Class not found" });
  }

  res.json({ message: "Class updated successfully", data });
};

export const preEndClass = async (req, res) => {
  const classId = req.params.id;

  const { data, error } = await supabase
    .from('classes')
    .update({ status: 'pre-end' })
    .eq('id', classId)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Class not found' });
  }

  res.json({ message: 'Class pre-end successfully', data });
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


export const getClassByUserId = async (req, res) => {
  const userId = req.params.userId;

  // Using Supabase RPC style join via select with foreign table columns
  // The syntax: '*, room:rooms(*), branch:branches(*), course:courses(*)'
  const { data, error } = await supabase
  .from('classes')
  .select(`
    *,
    rooms:room_id (
      id,
      room_number
    ),
    branches:branch_id (
      id,
      branch_name
    ),
    courses:course_id (
      id,
      name
    )
  `)
  .eq('teacher_id', userId)
  .eq('isdeleted', 'disable')
  .order('id', { ascending: false });


  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'No classes found for this user.' });
  }

  res.json({ data });
};

export const createStudent = async (req, res) => {
  const { name, gender, phone, teacher_id, class_id } = req.body;

  // Basic validation
  if (!name || !gender || !teacher_id || !class_id) {
    return res.status(400).json({ error: 'Missing required fields: name, gender, teacher_id, class_id' });
  }

  // Validate gender value
  const validGenders = ['Male', 'Female', 'Other'];
  if (!validGenders.includes(gender)) {
    return res.status(400).json({ error: 'Invalid gender. Allowed values: Male, Female, Other' });
  }

  try {
    const { data, error } = await supabase
      .from('students')
      .insert([{ name, gender, phone, teacher_id, class_id }])
      .select();  // returns the inserted row(s)

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Student created successfully', student: data[0] });
  } catch (err) {
    res.status(500).json({ error: 'Unexpected server error' });
  }
};
