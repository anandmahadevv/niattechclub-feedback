const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteProject() {
  const { error } = await supabase.from('projects').delete().eq('project_title', 'Campus Navigator App');
  if (error) console.error("Error deleting project:", error.message);
  else console.log("Successfully deleted Campus Navigator App.");
}

deleteProject();
