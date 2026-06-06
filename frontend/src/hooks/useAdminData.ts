import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface Idea {
  id: number;
  name: string;
  category: string;
  idea: string;
  tech: string;
  date: string;
}

export interface RSVP {
  id: number;
  event_slug: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
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
  image_url?: string;
  upvotes: number;
}

export function useAdminData() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch Ideas
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .order('id', { ascending: false });
        
      if (!ideasError && ideasData) {
        setIdeas(ideasData as Idea[]);
      } else {
        console.error("Error fetching ideas:", ideasError);
      }

      // Fetch Projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
        
      if (!projectsError && projectsData) {
        setProjects(projectsData as Project[]);
      } else {
        console.error("Error fetching projects:", projectsError);
      }
      
      // Fetch RSVPs
      const { data: rsvpsData, error: rsvpsError } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!rsvpsError && rsvpsData) {
        setRsvps(rsvpsData as RSVP[]);
      } else {
        console.error("Error fetching RSVPs:", rsvpsError);
      }
      
      setLoading(false);
    }

    fetchData();

    // Set up real-time subscriptions with unique channel names to allow multiple components to use this hook
    const channelId = Math.random().toString(36).substring(7);
    
    const ideasSubscription = supabase.channel(`custom-all-ideas-${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => {
        fetchData(); // Simplest way to handle real-time sync is to re-fetch
      })
      .subscribe();

    const projectsSubscription = supabase.channel(`custom-all-projects-${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchData();
      })
      .subscribe();

    const rsvpsSubscription = supabase.channel(`custom-all-rsvps-${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ideasSubscription);
      supabase.removeChannel(projectsSubscription);
      supabase.removeChannel(rsvpsSubscription);
    };
  }, []);

  const addIdea = async (idea: Omit<Idea, "id" | "date">) => {
    const newIdea = {
      ...idea,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    
    // Optimistic UI update
    const tempId = Date.now();
    setIdeas((prev) => [{ ...newIdea, id: tempId }, ...prev]);
    
    const { error } = await supabase.from('ideas').insert(newIdea);
    if (error) {
      console.error("Failed to add idea to Supabase:", error);
      // Revert optimistic update
      setIdeas((prev) => prev.filter(i => i.id !== tempId));
    }
  };

  const deleteIdea = async (id: number) => {
    // Optimistic UI update
    const prevIdeas = [...ideas];
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    
    const { error } = await supabase.from('ideas').delete().eq('id', id);
    if (error) {
      console.error("Failed to delete idea from Supabase:", error);
      setIdeas(prevIdeas);
    }
  };

  const addProject = async (project: Omit<Project, "id" | "date" | "status" | "upvotes">) => {
    const newProject = {
      ...project,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "pending",
      upvotes: 0
    };
    
    // Optimistic UI update
    const tempId = Date.now();
    setProjects((prev) => [{ ...newProject, id: tempId, status: 'pending' as const }, ...prev]);

    const { error } = await supabase.from('projects').insert(newProject);
    if (error) {
      console.error("Failed to add project to Supabase:", error);
      setProjects((prev) => prev.filter(p => p.id !== tempId));
      throw error;
    }
  };

  const deleteProject = async (id: number) => {
    // Optimistic UI update
    const prevProjects = [...projects];
    setProjects((prev) => prev.filter((p) => p.id !== id));
    
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error("Failed to delete project from Supabase:", error);
      setProjects(prevProjects);
    }
  };

  const publishProject = async (id: number) => {
    // Optimistic UI update
    const prevProjects = [...projects];
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, status: 'published' as const } : p));
    
    const { error } = await supabase.from('projects').update({ status: 'published' }).eq('id', id);
    if (error) {
      console.error("Failed to publish project in Supabase:", error);
      setProjects(prevProjects);
    }
  };

  const upvoteProject = async (id: number, currentUpvotes: number) => {
    // Optimistic UI update
    setProjects((prev) => 
      prev.map((p) => p.id === id ? { ...p, upvotes: currentUpvotes + 1 } : p)
    );
    
    const { error } = await supabase
      .from('projects')
      .update({ upvotes: currentUpvotes + 1 })
      .eq('id', id);
      
    if (error) {
      console.error("Failed to upvote project:", error);
      // Revert if error
      setProjects((prev) => 
        prev.map((p) => p.id === id ? { ...p, upvotes: currentUpvotes } : p)
      );
    }
  };

  return {
    ideas,
    addIdea,
    deleteIdea,
    projects,
    addProject,
    deleteProject,
    publishProject,
    upvoteProject,
    rsvps,
    loading
  };
}
