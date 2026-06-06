import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAdminData } from "../hooks/useAdminData";
import { useAuth } from "../components/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

const exportCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const csvRows = data.map(row => 
    Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
  );
  const csvContent = [headers, ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  a.click();
};

export default function Admin() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isAdmin = user && user.email === "anandgowda82961@gmail.com";

  const handleLogout = async () => {
    await signOut();
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full px-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fas fa-lock"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Admin Access Required</h2>
            <p className="text-sm text-gray-500 mt-2">
              {user ? "You do not have permission to access the admin dashboard." : "Please log in with an admin account to access the dashboard."}
            </p>
          </div>
          
          <div className="space-y-4">
            {!user ? (
              <Link 
                to="/login" 
                className="flex justify-center w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
              >
                Go to Login
              </Link>
            ) : (
              <Link 
                to="/" 
                className="flex justify-center w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
              >
                Return Home
              </Link>
            )}
            <div className="text-center pt-4">
              <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-30 shadow-2xl md:shadow-sm transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
            Admin Panel
          </h2>
          <button 
            className="md:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarButton 
            active={activeTab === "overview"} 
            onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }}
            icon="fa-chart-pie"
            label="Overview"
          />
          <SidebarButton 
            active={activeTab === "events"} 
            onClick={() => { setActiveTab("events"); setIsSidebarOpen(false); }}
            icon="fa-calendar-alt"
            label="Events"
          />
          <SidebarButton 
            active={activeTab === "scanner"} 
            onClick={() => { setActiveTab("scanner"); setIsSidebarOpen(false); }}
            icon="fa-qrcode"
            label="Scanner"
          />
          <SidebarButton 
            active={activeTab === "ideas"} 
            onClick={() => { setActiveTab("ideas"); setIsSidebarOpen(false); }}
            icon="fa-lightbulb"
            label="Ideas"
          />
          <SidebarButton 
            active={activeTab === "projects"} 
            onClick={() => { setActiveTab("projects"); setIsSidebarOpen(false); }}
            icon="fa-laptop-code"
            label="Projects"
          />
          <SidebarButton 
            active={activeTab === "members"} 
            onClick={() => { setActiveTab("members"); setIsSidebarOpen(false); }}
            icon="fa-users"
            label="Members"
          />
          <SidebarButton 
            active={activeTab === "communications"} 
            onClick={() => { setActiveTab("communications"); setIsSidebarOpen(false); }}
            icon="fa-envelope"
            label="Communications"
          />
        </nav>

        <div className="p-4 border-t border-gray-100 bg-white">
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
      <main className="flex-1 h-full overflow-y-auto relative bg-gray-50/50 w-full">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
            Dashboard
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "scanner" && <ScannerTab />}
          {activeTab === "ideas" && <IdeasTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "members" && <MembersTab />}
          {activeTab === "communications" && <CommunicationsTab />}
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
  const { ideas, projects, rsvps, events, loading } = useAdminData();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  // Prepare data for BarChart (RSVPs per Event)
  const rsvpsByEvent = events.map(ev => ({
    name: ev.title,
    RSVPs: rsvps.filter(r => r.event_slug === ev.slug).length
  }));

  // Prepare data for PieChart (Ideas by Category)
  const ideaCategories = ideas.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const ideasPieData = Object.keys(ideaCategories).map(key => ({
    name: key, value: ideaCategories[key]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Events" value={events.length.toString()} icon="fa-calendar-check" color="blue" />
        <StatCard title="Ideas Submitted" value={ideas.length.toString()} icon="fa-lightbulb" color="yellow" />
        <StatCard title="Active Projects" value={projects.length.toString()} icon="fa-laptop-code" color="green" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-gray-800">RSVPs per Event</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rsvpsByEvent} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="RSVPs" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Ideas by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ideasPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {ideasPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
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
  const { rsvps, events, addEvent, deleteEvent } = useAdminData();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ slug: "", title: "", type: "Workshop", date: "", location: "", description: "" });

  // Default selection
  if (!selectedEvent && events.length > 0) {
    setSelectedEvent(events[0].slug);
  }

  const filteredRsvps = rsvps.filter(r => r.event_slug === selectedEvent);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEvent({ ...newEvent, status: "Upcoming", image_url: "" });
    setShowAddForm(false);
    setNewEvent({ slug: "", title: "", type: "Workshop", date: "", location: "", description: "" });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events & RSVPs</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors text-sm flex items-center gap-2">
          <i className="fas fa-plus"></i> {showAddForm ? "Cancel" : "Add Event"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddEvent} className="bg-white border border-gray-200 rounded-3xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder="Event Title" className="border border-gray-200 p-3 rounded-xl" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
          <input required placeholder="URL Slug (e.g. promptwars)" className="border border-gray-200 p-3 rounded-xl" value={newEvent.slug} onChange={e => setNewEvent({...newEvent, slug: e.target.value})} />
          <input required placeholder="Date (e.g. August 25, 2026)" className="border border-gray-200 p-3 rounded-xl" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
          <input required placeholder="Location" className="border border-gray-200 p-3 rounded-xl" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
          <select className="border border-gray-200 p-3 rounded-xl" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
            <option value="Workshop">Workshop</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Seminar">Seminar</option>
          </select>
          <button type="submit" className="bg-green-600 text-white p-3 rounded-xl font-bold">Save Event</button>
        </form>
      )}

      {/* Events List */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-semibold">Event</th>
              <th className="p-4 font-semibold">Date & Location</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">{ev.title} <div className="text-xs text-gray-400 font-normal">/{ev.slug}</div></td>
                <td className="p-4 text-gray-600">{ev.date} <div className="text-xs">{ev.location}</div></td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">{ev.type}</span></td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteEvent(ev.id)} className="text-gray-400 hover:text-red-600 transition-colors"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No events found.</td></tr>}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-wrap gap-4">
          {events.map(event => (
            <button
              key={event.slug}
              onClick={() => setSelectedEvent(event.slug)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedEvent === event.slug ? "bg-gray-900 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
            >
              {event.title} <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{rsvps.filter(r => r.event_slug === event.slug).length}</span>
            </button>
          ))}
        </div>
        {filteredRsvps.length > 0 && (
          <button onClick={() => exportCSV(filteredRsvps, `rsvps_${selectedEvent}`)} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2">
            <i className="fas fa-download"></i> Export CSV
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Attendance</th>
              <th className="p-4 font-semibold">RSVP Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRsvps.map((rsvp) => (
              <tr key={rsvp.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">{rsvp.name}</td>
                <td className="p-4 text-gray-600">{rsvp.email}</td>
                <td className="p-4">
                  {rsvp.attended ? (
                    <span className="px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold"><i className="fas fa-check-circle mr-1"></i> Checked In</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-semibold">Pending</span>
                  )}
                </td>
                <td className="p-4 text-gray-600">{new Date(rsvp.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {filteredRsvps.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No RSVPs yet for this event.</td>
              </tr>
            )}
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Submitted Ideas</h1>
        <button onClick={() => exportCSV(ideas, "ideas")} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2"><i className="fas fa-download"></i> Export CSV</button>
      </div>
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
        <button onClick={() => exportCSV(projects, "projects")} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2"><i className="fas fa-download"></i> Export CSV</button>
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

function MembersTab() {
  const { members, addMember, deleteMember } = useAdminData();
  const [newMember, setNewMember] = useState({ name: "", role: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newMember.name && newMember.role) {
      await addMember(newMember);
      setNewMember({ name: "", role: "" });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <button onClick={() => exportCSV(members, "members")} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2"><i className="fas fa-download"></i> Export CSV</button>
      </div>

      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-3xl p-6 mb-8 flex flex-col md:flex-row gap-4">
        <input required placeholder="Name" className="flex-1 border border-gray-200 p-3 rounded-xl" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
        <input required placeholder="Role (e.g. Developer)" className="flex-1 border border-gray-200 p-3 rounded-xl" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} />
        <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold">Add Member</button>
      </form>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">{member.name}</td>
                <td className="p-4 text-gray-600">{member.role}</td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteMember(member.id)} className="text-gray-400 hover:text-red-600 transition-colors"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-gray-500">No members found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommunicationsTab() {
  const { events } = useAdminData();
  const [audience, setAudience] = useState("all");
  const [customEmails, setCustomEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    try {
      const res = await fetch("/api/send-mass-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, subject, html, customEmails })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");
      setStatus({ loading: false, error: "", success: data.message });
      setSubject("");
      setHtml("");
      setCustomEmails("");
    } catch (err: any) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-8">Communications</h1>
      
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm max-w-3xl">
        <h2 className="text-xl font-bold mb-6">Send Mass Email</h2>
        
        {status.error && <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-6 font-medium">{status.error}</div>}
        {status.success && <div className="p-4 bg-green-50 text-green-700 rounded-xl mb-6 font-medium">{status.success}</div>}
        
        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Audience</label>
            <select className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={audience} onChange={e => setAudience(e.target.value)}>
              <option value="all">All RSVP'd Users</option>
              {events.map(ev => (
                <option key={ev.slug} value={ev.slug}>RSVPs for: {ev.title}</option>
              ))}
              <option value="custom">Custom Emails</option>
            </select>
          </div>
          
          {audience === "custom" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Emails (comma separated)</label>
              <textarea required rows={3} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="john@example.com, jane@example.com" value={customEmails} onChange={e => setCustomEmails(e.target.value)}></textarea>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input required type="text" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">Message (HTML Supported)</label>
              <button type="button" onClick={() => setShowPreview(!showPreview)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
            {showPreview ? (
              <div className="w-full border border-gray-200 p-4 rounded-xl min-h-[200px] max-h-[500px] overflow-auto bg-white shadow-inner" dangerouslySetInnerHTML={{ __html: html || '<p class="text-gray-400">Nothing to preview yet...</p>' }}></div>
            ) : (
              <textarea required rows={8} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="<h1>Hello</h1><p>Event is starting soon!</p>" value={html} onChange={e => setHtml(e.target.value)}></textarea>
            )}
          </div>
          
          <button type="submit" disabled={status.loading} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
            {status.loading ? "Sending Emails..." : "Send Mass Email"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ScannerTab() {
  const { markAttendance, rsvps } = useAdminData();
  const [scanResult, setScanResult] = useState<{status: 'success' | 'error' | null, message: string}>({status: null, message: ""});
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const rsvpsRef = useRef(rsvps);
  useEffect(() => {
    rsvpsRef.current = rsvps;
  }, [rsvps]);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: {width: 250, height: 250},
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      }, false);
      
      const onScanSuccess = async (decodedText: string) => {
        if (scannerRef.current) {
          scannerRef.current.pause(true); // Pause scanning after success to prevent multiple calls
        }
        const rsvpId = parseInt(decodedText);
        if (isNaN(rsvpId)) {
          setScanResult({status: 'error', message: "Invalid QR Code format. Please scan a valid Tech Club ticket."});
          setTimeout(() => scannerRef.current?.resume(), 3000);
          return;
        }

        // Check if valid RSVP using the ref
        const ticket = rsvpsRef.current.find(r => r.id === rsvpId);
        if (!ticket) {
          setScanResult({status: 'error', message: `Ticket #${rsvpId} not found in the system.`});
          setTimeout(() => scannerRef.current?.resume(), 3000);
          return;
        }

        if (ticket.attended) {
          setScanResult({status: 'error', message: `${ticket.name} (Ticket #${rsvpId}) has already checked in!`});
          setTimeout(() => scannerRef.current?.resume(), 3000);
          return;
        }

        try {
          await markAttendance(rsvpId);
          setScanResult({status: 'success', message: `Successfully checked in ${ticket.name}!`});
        } catch (err) {
          setScanResult({status: 'error', message: "Database error while updating attendance."});
        }
        
        // Resume scanning after 3 seconds
        setTimeout(() => {
          setScanResult({status: null, message: ""});
          scannerRef.current?.resume();
        }, 3000);
      };

      const onScanFailure = (_error: any) => {
        // ignore normal scanning failures
      };

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Ticket Scanner</h1>
      
      {scanResult.status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-3xl mb-8 text-center animate-in zoom-in duration-300 shadow-sm">
          <i className="fas fa-check-circle text-4xl mb-3"></i>
          <h3 className="text-xl font-bold">{scanResult.message}</h3>
        </div>
      )}
      
      {scanResult.status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-3xl mb-8 text-center animate-in zoom-in duration-300 shadow-sm">
          <i className="fas fa-exclamation-circle text-4xl mb-3"></i>
          <h3 className="text-xl font-bold">{scanResult.message}</h3>
        </div>
      )}

      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm overflow-hidden">
        <div id="reader" className="w-full mx-auto" style={{ border: 'none' }}></div>
      </div>
      <p className="text-center text-gray-500 mt-6 text-sm">Please allow camera permissions if prompted.</p>
    </div>
  );
}
