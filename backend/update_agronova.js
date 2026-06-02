const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAgronova() {
  const newNames = "Dhanush Shenoy H, Archana A jalihal, Vijay Kumar, Dinesh A, Anand M";
  
  const { data, error } = await supabase
    .from('projects')
    .update({ name: newNames })
    .ilike('project_title', '%agronova%')
    .select('id, project_title, name');

  if (error) {
    console.error("Error updating project:", error);
  } else {
    console.log("Successfully updated project:", data);
  }
}

updateAgronova();
