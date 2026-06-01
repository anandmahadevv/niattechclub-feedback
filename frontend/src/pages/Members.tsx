import { useEffect, useState } from "react";

interface Member {
  name: string;
  role: string;
}

const defaultMembers: Member[] = [
  { name: "DINESH A", role: "President" },
  { name: "Divya", role: "Vice President" },
  { name: "Anand M", role: "Member" },
  { name: "Darshan Dharmar", role: "Member" },
  { name: "Dhanush Shenoy H", role: "Member" },
  { name: "Raza Abbas Rizwan Haider Rizvi", role: "Member" },
  { name: "Lin Joel Pais", role: "Member" },
  { name: "Akshay Krishna", role: "Member" },
  { name: "Prathik BG", role: "Member" },
  { name: "Madhu K M", role: "Member" },
  { name: "Ajmeera Tharun", role: "Member" },
  { name: "G R HARSHA", role: "Member" },
  { name: "Nidhi Deepak Shetty", role: "Member" },
  { name: "Ajay s m", role: "Member" },
  { name: "Sangam J K", role: "Member" },
  { name: "K K V N Saiteja", role: "Member" },
  { name: "Muhammed sufail M M", role: "Member" },
  { name: "Nishan V", role: "Member" },
  { name: "Samarth Shetty", role: "Member" },
  { name: "Yashas Y", role: "Member" },
  { name: "Surya Narayana c k", role: "Member" },
  { name: "Deekshith k R", role: "Member" },
  { name: "Bindu S H", role: "Member" },
  { name: "Punyashree Y", role: "Member" },
  { name: "Ananya Laxman Naik", role: "Member" },
];

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // Fetch data from local JSON database
    fetch("/data/members.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.members && data.members.length > 0) {
          setMembers(data.members);
        } else {
          setMembers(defaultMembers);
        }
      })
      .catch((error) => {
        console.error("Error fetching members, using fallback data:", error);
        setMembers(defaultMembers);
      });
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    let initials = parts[0].charAt(0).toUpperCase();
    if (parts.length > 1) {
      initials += parts[parts.length - 1].charAt(0).toUpperCase();
    }
    return initials;
  };

  // Split into leadership vs general members
  const leadership = members.filter((m) => {
    const roleLower = (m.role || "").toLowerCase();
    return (
      (roleLower.includes("president") && !roleLower.includes("vice")) ||
      roleLower.includes("vice president") ||
      roleLower.includes("vp")
    );
  });

  const generalMembers = members.filter((m) => {
    const roleLower = (m.role || "").toLowerCase();
    return !(
      (roleLower.includes("president") && !roleLower.includes("vice")) ||
      roleLower.includes("vice president") ||
      roleLower.includes("vp")
    );
  });

  return (
    <div className="flex-grow w-full flex flex-col pb-20">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Meet the 2025-26 Team</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          The brilliant minds driving innovation and technology at NIAT Tech Club.
        </p>
      </header>

      {/* Members Grid */}
      <main className="max-w-7xl mx-auto px-6 w-full flex-grow">
        {/* Leadership */}
        {leadership.length > 0 && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
            {leadership.map((member, index) => {
              const roleLower = (member.role || "").toLowerCase();
              const isPresident = roleLower.includes("president") && !roleLower.includes("vice");

              return (
                <div
                  key={`leader-${index}`}
                  className="member-card p-8 flex flex-col items-center text-center w-full md:w-80 shadow-lg border-2 border-red-50"
                >
                  <div className="w-24 h-24 rounded-full avatar-gradient text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md ring-4 ring-red-50">
                    {getInitials(member.name)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{member.name}</h3>
                  {isPresident ? (
                    <p className="text-xs text-amber-500 font-bold mt-2 uppercase tracking-wide">
                      <i className="fas fa-crown mr-1"></i> {member.role}
                    </p>
                  ) : (
                    <p className="text-xs text-blue-600 font-bold mt-2 uppercase tracking-wide">
                      <i className="fas fa-star mr-1"></i> {member.role}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Members */}
        {generalMembers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {generalMembers.map((member, index) => (
              <div key={`member-${index}`} className="member-card p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full avatar-gradient text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md">
                  {getInitials(member.name)}
                </div>
                <h3 className="font-bold text-gray-900 leading-tight">{member.name}</h3>
                <p className="text-xs text-red-600 font-semibold mt-2 uppercase tracking-wide">{member.role}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
