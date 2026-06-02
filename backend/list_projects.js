const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listProjects() {
  const { data, error } = await supabase.from('projects').select('id, project_title');
  if (error) console.error(error);
  else console.log("Current projects in DB:", data);
}

listProjects();
