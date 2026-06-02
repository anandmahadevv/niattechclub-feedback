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

    const userName = user.user_metadata?.name || user.email || formData.name || "Anonymous";

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
        <div className="w-full max-w-3xl form-card p-8 md:p-12 relative overflow-hidden bg-white/75 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200/55 dark:border-zinc-800/60 shadow-2xl rounded-3xl">
          <form onSubmit={submitIdeaForm} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2" htmlFor="name">
                Name <span className="text-red-500">*</span>
              </label>
              {user ? (
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled
                  value={user.user_metadata?.name || user.email || ""}
                  className="w-full input-field rounded-xl px-4 py-3 text-sm bg-gray-50 dark:bg-zinc-900/40 text-gray-400 dark:text-zinc-555 border border-gray-200 dark:border-zinc-800 cursor-not-allowed outline-none font-medium"
                />
              ) : (
                <div className="relative">
                  <select
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full input-field rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select your name...
                    </option>
                    <option value="DINESH A">DINESH A</option>
                    <option value="Divya">Divya</option>
                    <option value="Anand M">Anand M</option>
                    <option value="Darshan Dharmar">Darshan Dharmar</option>
                    <option value="Dhanush Shenoy H">Dhanush Shenoy H</option>
                    <option value="Raza Abbas Rizwan Haider Rizvi">Raza Abbas Rizwan Haider Rizvi</option>
                    <option value="Lin Joel Pais">Lin Joel Pais</option>
                    <option value="Akshay Krishna">Akshay Krishna</option>
                    <option value="Prathik BG">Prathik BG</option>
                    <option value="Madhu K M">Madhu K M</option>
                    <option value="Ajmeera Tharun">Ajmeera Tharun</option>
                    <option value="G R HARSHA">G R HARSHA</option>
                    <option value="Nidhi Deepak Shetty">Nidhi Deepak Shetty</option>
                    <option value="Ajay s m">Ajay s m</option>
                    <option value="Sangam J K">Sangam J K</option>
                    <option value="K K V N Saiteja">K K V N Saiteja</option>
                    <option value="Muhammed sufail M M">Muhammed sufail M M</option>
                    <option value="Nishan V">Nishan V</option>
                    <option value="Samarth Shetty">Samarth Shetty</option>
                    <option value="Yashas Y">Yashas Y</option>
                    <option value="Surya Narayana c k">Surya Narayana c k</option>
                    <option value="Deekshith k R">Deekshith k R</option>
                    <option value="Bindu S H">Bindu S H</option>
                    <option value="Punyashree Y">Punyashree Y</option>
                    <option value="Ananya Laxman Naik">Ananya Laxman Naik</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <i className="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2" htmlFor="category">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full input-field rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 appearance-none cursor-pointer"
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2" htmlFor="idea">
                Your Idea <span className="text-red-500">*</span>
              </label>
              <textarea
                id="idea"
                name="idea"
                required
                rows={5}
                value={formData.idea}
                onChange={handleInputChange}
                className="w-full input-field rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 resize-none outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Describe your idea in detail..."
              ></textarea>
            </div>

            {/* Technical Support */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">
                Do you need any technical support for your project or idea? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-8 flex-wrap">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="tech_support"
                    value="yes"
                    checked={formData.tech_support === "yes"}
                    onChange={() => handleRadioChange("yes")}
                    required
                    className="custom-radio border-gray-300 dark:border-zinc-700"
                  />
                  <span className="text-sm text-gray-600 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Yes, I need support.
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="tech_support"
                    value="no"
                    checked={formData.tech_support === "no"}
                    onChange={() => handleRadioChange("no")}
                    required
                    className="custom-radio border-gray-300 dark:border-zinc-700"
                  />
                  <span className="text-sm text-gray-600 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
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
