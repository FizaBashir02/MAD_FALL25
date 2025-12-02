import { useEffect } from "react";
import { Coffee, Star, Users, Clock } from "lucide-react";

const Dashboard = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Example stats
  const stats = [
    { id: 1, title: "Cafes", value: 12, icon: <Coffee className="w-6 h-6 text-amber-600" /> },
    { id: 2, title: "Moments", value: 34, icon: <Star className="w-6 h-6 text-yellow-500" /> },
    { id: 3, title: "Users", value: 128, icon: <Users className="w-6 h-6 text-green-600" /> },
  ];

  // Example recent activity
  const recentActivity = [
    { id: 1, desc: "Added a new cafe: Cafe Sunrise", time: "2 hours ago" },
    { id: 2, desc: "Created a moment at Cafe Latte", time: "1 day ago" },
    { id: 3, desc: "User John Doe joined", time: "2 days ago" },
  ];

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-semibold mb-6 text-center">Welcome to the Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow"
          >
            <div className="p-3 bg-amber-100 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" /> Recent Activity
        </h2>
        <ul className="space-y-3">
          {recentActivity.map((act) => (
            <li
              key={act.id}
              className="flex justify-between border-b border-gray-100 pb-2 last:border-0"
            >
              <span className="text-gray-700">{act.desc}</span>
              <span className="text-gray-400 text-sm">{act.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Dashboard;
