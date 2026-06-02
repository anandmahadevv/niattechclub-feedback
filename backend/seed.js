const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Starting seed process...");

  // Seed Members
  try {
    const membersData = JSON.parse(fs.readFileSync('./Data/members.json', 'utf8'));
    if (membersData && membersData.members) {
      console.log(`Found ${membersData.members.length} members to insert.`);
      const { error } = await supabase.from('members').insert(membersData.members);
      if (error) throw error;
      console.log("Successfully seeded members.");
    }
  } catch (error) {
    console.error("Error seeding members:", error.message);
  }

  // Seed Dummy Projects
  const defaultProjects = [
    { 
      name: "Anand Mahadev, Dhanush Shenoy H, Dinesh A", 
      project_title: "HACK-MATE", 
      description: "An AI-powered hackathon co-pilot built to help teams build projects faster, collaborate better, and simplify hackathon workflows. Reached 1000+ users across 10+ countries with 1,280 Git clones in just one month. Built fully open-source with an active community.", 
      tags: "React, TypeScript, AI, Open-Source", 
      link: "https://hackmate.anandmahadev.in/", 
      date: "June 1, 2026", 
      status: "published",
      image_url: "/hackmate.jpeg"
    },
    { 
      name: "Divya K", 
      project_title: "Campus Navigator App", 
      description: "An interactive map to help freshmen find their classrooms across the university campus.", 
      tags: "React Native, Firebase", 
      link: "https://github.com", 
      date: "June 1, 2026", 
      status: "published",
      image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  try {
    const { error } = await supabase.from('projects').insert(defaultProjects);
    if (error) throw error;
    console.log("Successfully seeded default projects.");
  } catch (error) {
    console.error("Error seeding projects:", error.message);
  }

  // Seed Dummy Ideas
  const defaultIdeas = [
    { name: "Rahul S", category: "Workshop", idea: "Docker for Beginners", tech: "Yes", date: "June 1, 2026" },
    { name: "Priya M", category: "Guest Lecture", idea: "Cybersecurity Basics", tech: "No", date: "June 2, 2026" }
  ];

  try {
    const { error } = await supabase.from('ideas').insert(defaultIdeas);
    if (error) throw error;
    console.log("Successfully seeded default ideas.");
  } catch (error) {
    console.error("Error seeding ideas:", error.message);
  }

  console.log("Seeding complete!");
}

seed();
