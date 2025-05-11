import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  });
  // set Supabase JWT on the client object,
  // so it is sent up with all Supabase requests
  return supabase;
};

// Function to get jobs
export const getJobs = async (supabaseAccessToken) => {
  const supabase = await supabaseClient(supabaseAccessToken);
  const { data, error } = await supabase.from('jobs').select('*');
  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
  return data;
};

// Function to get internships
export const getInternships = async (supabaseAccessToken) => {
  const supabase = await supabaseClient(supabaseAccessToken);
  const { data, error } = await supabase.from('internships').select('*');
  if (error) {
    console.error('Error fetching internships:', error);
    return [];
  }
  return data;
};

// Function to add a job
export const addJob = async (supabaseAccessToken, jobData) => {
  const supabase = await supabaseClient(supabaseAccessToken);
  const { data, error } = await supabase.from('jobs').insert([jobData]);
  if (error) {
    console.error('Error adding job:', error);
    return null;
  }
  return data;
};

// Function to add an internship
export const addInternship = async (supabaseAccessToken, internshipData) => {
  const supabase = await supabaseClient(supabaseAccessToken);
  const { data, error } = await supabase.from('internships').insert([internshipData]);
  if (error) {
    console.error('Error adding internship:', error);
    return null;
  }
  return data;
};

export default supabaseClient;
