import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdminData } from "../hooks/useAdminData";
import { useAuth } from "../components/AuthContext";

export default function Ideas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    idea: "",
    tech_support: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tech_support: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      idea: "",
      tech_support: "",
    });
  };

  const { addIdea } = useAdminData();

  const submitIdeaForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect to login if user is not authenticated
    if (!user) {
      toast.error("Please log in to submit your event idea!");
      navigate("/login?redirect=/ideas");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your idea...");

    const userName = user.name || user.email || formData.name || "Anonymous";

    const submissionData = new FormData();
    submissionData.append("name", userName);
    submissionData.append("category", formData.category);
    submissionData.append("idea", formData.idea);
    submissionData.append("tech_support", formData.tech_support);

    try {
      addIdea({
        name: userName,
        category: formData.category,
        idea: formData.idea,
        tech: formData.tech_support
      });

      const response = await fetch("https://formspree.io/f/xdajvbdp", {
        method: "POST",
        body: submissionData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        toast.success("Idea submitted successfully! We will review it shortly.", {
          id: toastId,
        });
        resetForm();
      } else {
        toast.error("Failed to submit idea. Please try again.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please check your connection.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col pb-12 bg-white">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">Event Ideas</h1>
        <p className="text-lg text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Please share your vision and ideas for upcoming events so we can improve and together make it successful.
        </p>
      </header>

      {/* Form Container */}
      <div className="flex-grow flex items-start justify-center px-4 w-full">
        <div className="w-full max-w-3xl form-card p-6 md:p-12 relative overflow-hidden bg-white/75 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200/55 dark:border-zinc-800/60 shadow-2xl rounded-3xl">
          <form onSubmit={submitIdeaForm} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-900 mb-2" htmlFor="name">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled
                value={user ? (user.name || user.email || "") : "Please log in to auto-fill your name"}
                className="w-full input-field rounded-xl px-4 py-3 text-sm bg-gray-50 dark:bg-zinc-900/40 text-gray-500 dark:text-zinc-500 border border-gray-200 dark:border-zinc-800 cursor-not-allowed outline-none font-medium"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-900 mb-2" htmlFor="category">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full input-field rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-900 bg-white/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-gray-400">
                    Select a category...
                  </option>
                  <option value="workshop">Workshop Request</option>
                  <option value="event">Event Suggestion</option>
                  <option value="suggestion">General Suggestion</option>
                  <option value="project">Project Proposal</option>
                  <option value="other">Other Innovative Idea</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            {/* Idea Text Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-900 mb-2" htmlFor="idea">
                Your Idea <span className="text-red-500">*</span>
              </label>
              <textarea
                id="idea"
                name="idea"
                required
                rows={5}
                value={formData.idea}
                onChange={handleInputChange}
                className="w-full input-field rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-slate-900 bg-white/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 resize-none outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Describe your idea in detail..."
              ></textarea>
            </div>

            {/* Technical Support */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">
                Do you need any technical support for your project or idea? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6 flex-wrap mt-2">
                <label className="flex items-center cursor-pointer group px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200">
                  <input
                    type="radio"
                    name="tech_support"
                    value="yes"
                    checked={formData.tech_support === "yes"}
                    onChange={() => handleRadioChange("yes")}
                    required
                    className="custom-radio border-gray-300 dark:border-zinc-600"
                  />
                  <span className="text-base font-medium text-gray-800 dark:text-zinc-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    Yes, I need support.
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200">
                  <input
                    type="radio"
                    name="tech_support"
                    value="no"
                    checked={formData.tech_support === "no"}
                    onChange={() => handleRadioChange("no")}
                    required
                    className="custom-radio border-gray-300 dark:border-zinc-600"
                  />
                  <span className="text-base font-medium text-gray-800 dark:text-zinc-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    No, I'm good.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full submit-btn text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{isSubmitting ? "Submitting..." : (user ? "Submit Idea" : "Log in to Submit Idea")}</span>
                <i
                  className={
                    isSubmitting ? "fas fa-circle-notch fa-spin text-sm" : "fas fa-paper-plane text-sm"
                  }
                ></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
