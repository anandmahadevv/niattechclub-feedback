import { useState } from "react";
import { toast } from "sonner";
import { useAdminData } from "../hooks/useAdminData";

export default function Ideas() {
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

  const { ideas, addIdea, upvoteIdea } = useAdminData();

  const submitIdeaForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your idea...");

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("category", formData.category);
    submissionData.append("idea", formData.idea);
    submissionData.append("tech_support", formData.tech_support);

    try {
      // Save locally for the Admin Dashboard
      addIdea({
        name: formData.name,
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
    <div className="flex-grow w-full flex flex-col pb-12">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Event Ideas</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Please share your vision and ideas for upcoming events so we can improve and together make it successful.
        </p>
      </header>

      {/* Form Container */}
      <div className="flex-grow flex items-start justify-center px-4 w-full">
        <div className="w-full max-w-3xl form-card p-8 md:p-12 relative overflow-hidden">
            <form onSubmit={submitIdeaForm} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full input-field rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none cursor-pointer"
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
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full input-field rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="idea">
                  Your Idea <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="idea"
                  name="idea"
                  required
                  rows={5}
                  value={formData.idea}
                  onChange={handleInputChange}
                  className="w-full input-field rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
                  placeholder="Describe your idea in detail..."
                ></textarea>
              </div>

              {/* Technical Support */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                      className="custom-radio"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
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
                      className="custom-radio"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
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
                  className="w-full submit-btn text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? "Submitting..." : "Submit Idea"}</span>
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

      {/* Idea Board Section */}
      <section className="max-w-7xl mx-auto px-6 w-full mt-24 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Idea Board</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Vote on the ideas you want to see come to life next! The most upvoted ideas will be prioritized.
          </p>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No ideas submitted yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)).map((idea) => (
              <div key={idea.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {idea.category}
                  </span>
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => upvoteIdea(idea.id)}
                      className="w-10 h-10 rounded-full flex flex-col items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors border border-gray-100 hover:border-red-100"
                      title="Upvote this idea"
                    >
                      <i className="fas fa-arrow-up text-sm"></i>
                    </button>
                    <span className="text-sm font-bold text-gray-700 mt-1">{idea.upvotes || 0}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{idea.idea}</h3>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {idea.name.charAt(0)}
                    </div>
                    {idea.name}
                  </span>
                  <span>{idea.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
