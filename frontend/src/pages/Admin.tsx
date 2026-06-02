import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminData } from "../hooks/useAdminData";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("adminAuth") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple frontend hardcoded credential check
    if (password === "43517@niat.me") {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full px-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fas fa-lock"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Admin Login</h2>
            <p className="text-sm text-gray-500 mt-2">Enter your credentials to access the dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200'} focus:outline-none focus:ring-4 transition-all`}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-2 font-semibold">Incorrect password.</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
            >
              Access Dashboard
            </button>
            <div className="text-center pt-4">
              <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                &larr; Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 relative z-20 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarButton 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")}
            icon="fa-chart-pie"
            label="Overview"
          />
          <SidebarButton 
            active={activeTab === "events"} 
            onClick={() => setActiveTab("events")}
            icon="fa-calendar-alt"
            label="Events"
          />
          <SidebarButton 
            active={activeTab === "ideas"} 
            onClick={() => setActiveTab("ideas")}
            icon="fa-lightbulb"
            label="Ideas"
          />
          <SidebarButton 
            active={activeTab === "projects"} 
            onClick={() => setActiveTab("projects")}
            icon="fa-laptop-code"
            label="Projects"
          />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <Link 
            to="/"
            className="flex items-center gap-3 w-full px-4 py-3 mt-1 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <i className="fas fa-home"></i> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative bg-gray-50/50">
        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "ideas" && <IdeasTab />}
          {activeTab === "projects" && <ProjectsTab />}
        </div>
      </main>
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
        active 
          ? "bg-red-50 text-red-700 shadow-sm border border-red-100" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
      }`}
    >
      <i className={`fas ${icon} ${active ? "text-red-500" : "text-gray-400"}`}></i> {label}
    </button>
  );
}

function OverviewTab() {
  const { ideas, projects, loading } = useAdminData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Events" value="2" icon="fa-calendar-check" color="blue" />
        <StatCard title="Ideas Submitted" value={loading ? "..." : ideas.length.toString()} icon="fa-lightbulb" color="yellow" />
        <StatCard title="Active Projects" value={loading ? "..." : projects.length.toString()} icon="fa-laptop-code" color="green" />
      </div>
      
      <div className="mt-10 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Welcome to the Admin Panel</h3>
        <p className="text-gray-600">
          This dashboard is now connected to Supabase! Any changes made here are instantly reflected in the live database.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${colorMap[color]}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function EventsTab() {
  const [events] = useState([
    { id: 1, title: "Intro to Dev Tools", type: "Workshop", status: "Completed", date: "April 30, 2026" },
    { id: 2, title: "AI in the Real World", type: "Seminar", status: "Upcoming", date: "June 15, 2026" }
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors text-sm flex items-center gap-2">
          <i className="fas fa-plus"></i> Add Event
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">{event.title}</td>
                <td className="p-4 text-gray-600">{event.type}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${event.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {event.status}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{event.date}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors"><i className="fas fa-edit"></i></button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IdeasTab() {
  const { ideas, deleteIdea } = useAdminData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-8">Submitted Ideas</h1>
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-semibold">Submitted By</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Idea</th>
              <th className="p-4 font-semibold">Needs Tech</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ideas.map((idea) => (
              <tr key={idea.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">
                  {idea.name}
                  <div className="text-xs text-gray-400 font-normal">{idea.date}</div>
                </td>
                <td className="p-4 text-gray-600">
                  <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold">{idea.category}</span>
                </td>
                <td className="p-4 text-gray-700 max-w-xs truncate">{idea.idea}</td>
                <td className="p-4 text-gray-600">{idea.tech}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-gray-400 hover:text-green-600 transition-colors" title="Approve"><i className="fas fa-check"></i></button>
                  <button onClick={() => deleteIdea(idea.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete"><i className="fas fa-times"></i></button>
                </td>
              </tr>
            ))}
            {ideas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No ideas submitted yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectsTab() {
  const { projects, deleteProject, publishProject } = useAdminData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
      </div>
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-semibold">Project Title</th>
              <th className="p-4 font-semibold">Author</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{project.project_title}</div>
                  <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">{project.link || "No link"}</a>
                </td>
                <td className="p-4 text-gray-900 font-medium">
                  {project.name}
                  <div className="text-xs text-gray-400 font-normal">{project.date}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${(project.status || 'published') === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {(project.status || 'published').toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {(project.status || 'published') === 'pending' && (
                    <button onClick={() => publishProject(project.id)} className="text-gray-400 hover:text-green-600 transition-colors" title="Publish"><i className="fas fa-check"></i></button>
                  )}
                  <button onClick={() => deleteProject(project.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No projects added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
