require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addRepo(owner, repo) {
    console.log(`Adding ${owner}/${repo} to tracked repositories...`);
    
    const { data, error } = await supabase
        .from('tracked_repos')
        .insert([{ owner, repo }]);
        
    if (error) {
        console.error('Error adding repository:', error.message);
    } else {
        console.log('Successfully added repository to the database!');
    }
}

// Get arguments from command line
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.log('Usage: node add_repo.js <owner> <repo>');
    process.exit(1);
}

addRepo(args[0], args[1]);
