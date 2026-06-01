import { useState } from "react";
import Tilt from "react-parallax-tilt";
import { toast } from "sonner";
import { useAdminData } from "../hooks/useAdminData";

export default function Showcase() {
  const [isOpen, setIsOpen] = useState(false);
  const { projects, addProject } = useAdminData();
  const [formData, setFormData] = useState({
    name: "",
    project_title: "",
    description: "",
    tags: "",
    link: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      name: "",
      project_title: "",
      description: "",
      tags: "",
      link: "",
      imageUrl: "",
    });
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
      // Save locally for the Admin Dashboard
      addProject({
        name: formData.name,
        project_title: formData.project_title,
        description: formData.description,
        tags: formData.tags,
        link: formData.link,
        imageUrl: formData.imageUrl
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
    } catch (error) {
      toast.error("Oops! There was a problem submitting your project.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col pb-20">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center w-full">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Student Showcase
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Celebrating the brilliant projects, research, and achievements of our NIAT Tech Club members.
        </p>
      </header>

      {/* Projects Grid */}
      <main className="max-w-6xl mx-auto px-6 w-full flex-grow flex flex-col items-center">
        <div className="flex flex-col gap-8 w-full">
          {projects.filter(p => (p.status || 'published') === 'published').map((project) => (
            <Tilt key={project.id} tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2000} className="w-full">
              <article className="project-card flex flex-col md:flex-row w-full bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all">
                {project.imageUrl && (
                  <div className="w-full md:w-2/5 h-64 md:h-auto shrink-0 bg-gray-100 border-b md:border-b-0 md:border-r border-gray-100">
                    <img src={project.imageUrl} alt={project.project_title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow w-full">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.project_title}</h3>
                    <p className="text-sm font-semibold text-gray-500">By {project.name}</p>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed mb-8 flex-grow">{project.description}</p>
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold uppercase tracking-wider">{tag.trim()}</span>
                      ))}
                    </div>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-2 font-semibold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg">
                        View Project <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Tilt>
          ))}
        </div>
          
        {/* Add Project Card/Button Below */}
        <div className="mt-16 w-full max-w-2xl">
          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
            <article
              onClick={openModal}
              className="project-card flex flex-col items-center justify-center p-10 border-dashed border-2 bg-gray-50/50 hover:bg-gray-50 cursor-pointer shadow-sm hover:shadow-md hover:border-gray-300 group rounded-2xl transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-700 flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110">
                <i className="fas fa-plus"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Have a project to share?</h3>
              <p className="text-gray-500 text-base text-center">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="e.g. Divya"
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
                    placeholder="e.g. Campus Navigator App"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preview Image URL (Optional)</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                    placeholder="https://example.com/image.png"
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
