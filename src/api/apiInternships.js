import supabase from "@/utils/supabase";

// Get all internships
export const getInternships = async () => {
  let { data, error } = await supabase.from("internships").select("*, company(*)");
  if (error) throw error;
  return data;
};

// Get a single internship
export const getSingleInternship = async ({ internship_id }) => {
  let { data, error } = await supabase
    .from("internships")
    .select("*, company(*), applications(*)")
    .eq("id", internship_id)
    .single();
  if (error) throw error;
  return data;
};

// Create a new internship posting
export const createInternship = async (internshipData) => {
  let { data, error } = await supabase.from("internships").insert([internshipData]).select();
  if (error) throw error;
  return data;
};

// Delete an internship
export const deleteInternship = async ({ internship_id }) => {
  let { error } = await supabase.from("internships").delete().eq("id", internship_id);
  if (error) throw error;
};

// Update internship details
export const updateInternship = async ({ internship_id, updatedData }) => {
  let { data, error } = await supabase.from("internships").update(updatedData).eq("id", internship_id);
  if (error) throw error;
  return data;
};

// Update internship hiring status (open/closed)
export const updateInternshipStatus = async ({ internship_id, isOpen }) => {
  let { data, error } = await supabase
    .from("internships")
    .update({ isOpen })
    .eq("id", internship_id);
  if (error) throw error;
  return data;
};

// Apply for an internship
export const applyInternship = async (applicationData) => {
  let { data, error } = await supabase.from("applications").insert([applicationData]).select();
  if (error) throw error;
  return data;
};

// ✅ FIXED: Add getSavedInternships function
export const getSavedInternships = async ({ user_id }) => {
  let { data, error } = await supabase
    .from("saved_internships") // Ensure this matches your database table name
    .select("*, internship(*)") // Adjust if needed
    .eq("user_id", user_id);

  if (error) throw error;
  return data;
};

// ✅ FIXED: Ensure saveInternship exists
export const saveInternship = async ({ user_id, internship_id }) => {
  let { data, error } = await supabase.from("saved_internships").insert([{ user_id, internship_id }]).select();
  if (error) throw error;
  return data;
};
