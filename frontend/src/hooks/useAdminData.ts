import { useState, useEffect } from "react";

export interface Idea {
  id: number;
  name: string;
  category: string;
  idea: string;
  tech: string;
  date: string;
}

export interface Project {
  id: number;
  name: string;
  project_title: string;
  description: string;
  tags: string;
  link: string;
  date: string;
  status: 'pending' | 'published';
  imageUrl?: string;
}

export function useAdminData() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const storedIdeas = localStorage.getItem("techclub_ideas");
    if (storedIdeas) {
      setIdeas(JSON.parse(storedIdeas));
    } else {
      // Default dummy data if empty
      const defaultIdeas = [
        { id: 1, name: "Rahul S", category: "Workshop", idea: "Docker for Beginners", tech: "Yes", date: "June 1, 2026" },
        { id: 2, name: "Priya M", category: "Guest Lecture", idea: "Cybersecurity Basics", tech: "No", date: "June 2, 2026" }
      ];
      setIdeas(defaultIdeas);
      localStorage.setItem("techclub_ideas", JSON.stringify(defaultIdeas));
    }

    const storedProjects = localStorage.getItem("techclub_projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Default dummy data if empty
      const defaultProjects: Project[] = [
        { 
          id: 1, 
          name: "Anand Mahadev, Dhanush Shenoy H, Dinesh A", 
          project_title: "HACK-MATE", 
          description: "An AI-powered hackathon co-pilot built to help teams build projects faster, collaborate better, and simplify hackathon workflows. Reached 1000+ users across 10+ countries with 1,280 Git clones in just one month. Built fully open-source with an active community.", 
          tags: "React, TypeScript, AI, Open-Source", 
          link: "https://Inkd.in/g7qWnZ7k", 
          date: "June 1, 2026", 
          status: "published",
          imageUrl: "/images/hack-mate.gif" // User to drop image here
        },
        { 
          id: 2, 
          name: "Divya K", 
          project_title: "Campus Navigator App", 
          description: "An interactive map to help freshmen find their classrooms across the university campus.", 
          tags: "React Native, Firebase", 
          link: "https://github.com", 
          date: "June 1, 2026", 
          status: "published",
          imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800"
        }
      ];
      setProjects(defaultProjects);
      localStorage.setItem("techclub_projects", JSON.stringify(defaultProjects));
    }
  }, []);

  const addIdea = (idea: Omit<Idea, "id" | "date">) => {
    const newIdea = {
      ...idea,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    const updated = [...ideas, newIdea];
    setIdeas(updated);
    localStorage.setItem("techclub_ideas", JSON.stringify(updated));
  };

  const deleteIdea = (id: number) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    localStorage.setItem("techclub_ideas", JSON.stringify(updated));
  };

  const addProject = (project: Omit<Project, "id" | "date" | "status">) => {
    const newProject: Project = {
      ...project,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "pending"
    };
    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem("techclub_projects", JSON.stringify(updated));
  };

  const deleteProject = (id: number) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("techclub_projects", JSON.stringify(updated));
  };

  const publishProject = (id: number) => {
    const updated = projects.map(p => p.id === id ? { ...p, status: 'published' as const } : p);
    setProjects(updated);
    localStorage.setItem("techclub_projects", JSON.stringify(updated));
  };

  return {
    ideas,
    addIdea,
    deleteIdea,
    projects,
    addProject,
    deleteProject,
    publishProject
  };
}
