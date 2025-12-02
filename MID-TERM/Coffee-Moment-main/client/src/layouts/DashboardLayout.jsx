import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-100 overflow-hidden">
      {/* Sidebar - hidden on mobile unless toggled */}
      <Sidebar isMobile={isMobile} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto  bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
