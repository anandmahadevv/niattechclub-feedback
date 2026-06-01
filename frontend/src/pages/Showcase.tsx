import { useState } from "react";
import Tilt from "react-parallax-tilt";
import { toast } from "sonner";

export default function Showcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    project_title: "",
    description: "",
    tags: "",
    link: "",
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
      const response = await fetch("https://formspree.io/f/xdajvbdp", {
        method: "POST",
        body: submissionData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        toast.success("Thank you! Your project has been submitted for review.", { id: toastId });
        // Reset form
        setFormData({
          name: "",
          project_title: "",
          description: "",
          tags: "",
          link: "",
        });
      } else {
        throw new Error("Form submission failed");
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
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Student Showcase</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Celebrating the brilliant projects, research, and achievements of our NIAT Tech Club members.
        </p>
      </header>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-6 w-full flex-grow flex justify-center items-start">
        <div className="w-full max-w-md">
          {/* Empty State / Add Project Card with 3D Tilt */}
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000}>
            <article
              onClick={openModal}
              className="project-card flex flex-col items-center justify-center h-[300px] border-dashed border-2 bg-white hover:bg-gray-50/80 cursor-pointer shadow-sm hover:shadow-xl hover:border-gray-300 group rounded-2xl transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-700 flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110">
                <i className="fas fa-plus"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Add Your Project</h3>
              <p className="text-gray-500 text-sm text-center px-8">
                Have you built something amazing? Submit your project to the club leads to be featured here!
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
