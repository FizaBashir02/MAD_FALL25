import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  Camera,
  Home,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ isMobile }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Moments", path: "/moment-manage", icon: <Camera size={20} /> },
    { name: "Coffees", path: "/cafe-manage", icon: <Coffee size={20} /> },
  ];

  const CoffeeBeans = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div className="absolute -top-10 -left-10 rotate-12">
        <Coffee size={120} />
      </div>
      <div className="absolute bottom-0 right-0 -rotate-12">
        <Coffee size={100} />
      </div>
    </div>
  );

  const NavLinks = ({ onClick }) => (
    <nav className="flex flex-col gap-2 relative z-10">
      {links.map((link) => {
        const active = pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClick}
            className={`group relative flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              active
                ? "bg-amber-600/20 text-amber-100 shadow-inner"
                : "text-slate-200 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-transparent hover:scale-[1.02] hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={active ? "text-amber-300" : "text-slate-300"}>
                {link.icon}
              </span>
              <span className="truncate">{link.name}</span>
            </div>
            {active && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-amber-300"
              >
                <ChevronRight size={18} />
              </motion.div>
            )}
          </Link>
        );
      })}
    </nav>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex flex-col w-72 h-full bg-gradient-to-b from-neutral-950 via-neutral-900 via-30% to-neutral-800 text-slate-50 p-5 shadow-lg border-r border-neutral-800">
      <CoffeeBeans />
      <div className="mb-6 px-1 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Cafe Admin</h2>
            <p className="text-xs text-slate-300">System Management</p>
          </div>
        </div>
      </div>
      <NavLinks />
      <div className="mt-auto pt-6 border-t border-neutral-800 relative z-10">
        <div className="flex items-center gap-3 px-1 py-2 text-slate-200 hover:text-white transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600/90 to-amber-400 flex items-center justify-center text-slate-900">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-slate-300">Administrator</p>
          </div>
        </div>
        <button className="w-full mt-3 flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-white rounded-lg hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-transparent transition-all">
          <LogOut size={18} className="text-slate-300" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-neutral-950 via-neutral-900 via-30% to-neutral-800 shadow-xl z-50 flex flex-col p-5 md:hidden"
          >
            <CoffeeBeans />
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Coffee className="w-7 h-7 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Cafe Admin</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-md bg-neutral-800/30 hover:bg-neutral-700/50 transition-all duration-200"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <NavLinks onClick={() => setOpen(false)} />
            <div className="mt-auto pt-6 border-t border-neutral-800">
              <div className="flex items-center gap-3 px-1 py-2 text-slate-200">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-300">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-slate-300">Administrator</p>
                </div>
              </div>
              <button className="w-full mt-3 flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-white rounded-lg hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-transparent transition-all">
                <LogOut size={18} className="text-slate-300" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-b from-neutral-950 via-neutral-900 via-30% to-neutral-800 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Coffee className="w-7 h-7 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Cafe Admin</h3>
          </div>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded-md bg-neutral-800/30 hover:bg-neutral-700/50 transition-all duration-200"
          >
            <Menu size={20} className="text-white" />
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />
    </>
  );
}
