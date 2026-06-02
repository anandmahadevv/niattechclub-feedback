import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { toast } from "sonner";
import { useAdminData } from "../hooks/useAdminData";
import ReactMarkdown from "react-markdown";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthContext";

export default function Showcase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { projects, addProject } = useAdminData();
  const [formData, setFormData] = useState({
    name: "",
    project_title: "",
    description: "",
    tags: "",
    link: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    if (!user) {
      toast.error("Please log in to submit a project!");
      navigate("/login?redirect=/showcase");
      return;
    }
    setIsOpen(true);
    setFormData((prev) => ({
      ...prev,
      name: user.user_metadata?.name || "",
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      name: user?.user_metadata?.name || "",
      project_title: "",
      description: "",
      tags: "",
      link: "",
    });
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your project...");

    const submissionData = new FormData();
    submissionData.append("form_type", "Project Showcase Submission");
    submissionData.append("name", formData.name);
    submissionData.append("project_title", formData.project_title);
    submissionData.append("description", formData.description);
    submissionData.append("tags", formData.tags);
    submissionData.append("link", formData.link);

    try {
      let uploadedImageUrl = "";

      if (imageFile) {
        toast.loading("Uploading image...", { id: toastId });
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('project_images')
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('project_images')
          .getPublicUrl(fileName);
          
        uploadedImageUrl = publicUrl;
      }

      // Save locally and to Supabase via Admin Dashboard hook
      await addProject({
        name: formData.name,
        project_title: formData.project_title,
        description: formData.description,
        tags: formData.tags,
        link: formData.link,
        image_url: uploadedImageUrl
      });

      const response = await fetch("https://formspree.io/f/xdajvbdp", {
        method: "POST",
        body: submissionData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        toast.success("Thank you! Your project has been submitted and will be published soon.", { id: toastId });
        closeModal();
      } else {
        toast.error("Failed to submit project.", { id: toastId });
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      const errorMsg = error?.message || "There was a problem submitting your project.";
      toast.error(`Oops! ${errorMsg}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col pb-20">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center w-full">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Student Showcase
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Celebrating the brilliant projects, research, and achievements of our NIAT Tech Club members.
        </p>
      </header>

      {/* Projects Grid */}
      <main className="max-w-6xl mx-auto px-6 w-full flex-grow flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {projects.filter(p => (p.status || 'published') === 'published').map((project) => (
            <Tilt key={project.id} tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.02} transitionSpeed={2000} className="w-full flex">
              <article className="project-card flex flex-col w-full bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all">
                {project.image_url && (
                  <div className="w-full h-48 bg-gray-100 border-b border-gray-100 overflow-hidden shrink-0">
                    <img src={project.image_url} alt={project.project_title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow w-full">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{project.project_title}</h3>
                    <p className="text-xs font-semibold text-gray-500">By {project.name}</p>
                  </div>
                  
                  <div className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow overflow-hidden line-clamp-3">
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        a: ({node, ...props}) => <a className="text-red-600 hover:text-red-800 underline" target="_blank" rel="noreferrer" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-base font-bold mb-1 mt-2 text-gray-900" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-sm font-bold mb-1 mt-2 text-gray-900" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xs font-bold mb-1 mt-2 text-gray-900" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                      }}
                    >
                      {project.description}
                    </ReactMarkdown>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.split(',').slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{tag.trim()}</span>
                      ))}
                    </div>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg shrink-0">
                        View <i className="fas fa-external-link-alt text-[10px]"></i>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Tilt>
          ))}
          
          {/* Add Project Card/Button Inline in Grid */}
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.02} transitionSpeed={2000} className="w-full flex">
            <article
              onClick={openModal}
              className="project-card flex flex-col items-center justify-center p-6 border-dashed border-2 border-gray-200 bg-gray-50/30 hover:bg-gray-50 cursor-pointer shadow-sm hover:shadow-md hover:border-gray-300 group rounded-2xl transition-all w-full min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center text-xl mb-3 transition-transform group-hover:scale-110">
                <i className="fas fa-plus"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Share Your Project</h3>
              <p className="text-gray-500 text-xs text-center px-4">
                Submit your work to be featured in the tech club showcase!
              </p>
            </article>
          </Tilt>
        </div>
      </main>

      {/* Add Project Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeModal}></div>

          {/* Modal Content */}
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 relative z-10 p-8 shadow-2xl transition-all">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Your Project</h2>
              <p className="text-gray-500 text-sm mt-1">Submit your work to be featured on the showcase page.</p>
            </div>

              <form onSubmit={submitProjectForm} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contributors / Authors Names</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="e.g. Divya, Rahul"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    name="project_title"
                    required
                    value={formData.project_title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="e.g. HACK-MATE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
                    Project Description <span className="text-gray-400 font-normal">(Markdown supported)</span> <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                    placeholder="Briefly describe your project..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                      placeholder="e.g. React, Python"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Project Link (Optional)</label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preview Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? "Submitting..." : "Submit Project"}</span>
                  <i
                    className={
                      isSubmitting ? "fas fa-circle-notch fa-spin text-sm" : "fas fa-paper-plane text-sm"
                    }
                  ></i>
                </button>
              </form>
          </div>
        </div>
      )}
    </div>
  );
}
