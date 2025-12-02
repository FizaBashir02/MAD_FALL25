import { Link } from "react-router-dom";
import {
  Coffee,
  Home,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-stone-200 pt-16 overflow-hidden">
      {/* Coffee bean decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-12 h-12 rounded-full bg-amber-600 blur-sm"></div>
        <div className="absolute bottom-40 right-1/4 w-16 h-16 rounded-full bg-amber-500 blur-sm"></div>
        <div className="absolute top-1/3 right-20 w-10 h-10 rounded-full bg-amber-400 blur-sm"></div>
        <div className="absolute bottom-20 left-1/3 w-14 h-14 rounded-full bg-amber-300 blur-sm"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 relative z-10">
        {/* Logo & About */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Coffee className="text-amber-500" size={30} />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">
              My Coffee
            </h2>
          </div>
          <p className="text-stone-300 leading-relaxed">
            Discover specialty coffees with a cozy atmosphere and exquisite flavors.
          </p>
          <div className="flex items-center gap-3 text-amber-400">
            <Clock size={18} />
            <span className="text-stone-300">Open: 7:00 AM - 10:00 PM daily</span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-stone-100 flex items-center gap-2">
            <ChevronRight size={18} className="text-amber-500" />
            <span>Navigation</span>
          </h3>
          <ul className="space-y-3">
            {[
              { label: "Home", to: "/", icon: <Home size={16} /> },
              { label: "Cafes", to: "/cafe", icon: <Coffee size={16} /> },
              { label: "Moments", to: "/moment", icon: <MapPin size={16} /> },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 text-stone-300 hover:text-amber-400 group transition-colors duration-200"
                >
                  <span className="text-amber-500 group-hover:text-amber-400 transition-colors">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-stone-100 flex items-center gap-2">
            <ChevronRight size={18} className="text-amber-500" />
            <span>Contact</span>
          </h3>
          <ul className="space-y-3 text-stone-300">
            <li className="flex items-center gap-3 hover:text-amber-400 transition-colors duration-200">
              <Mail size={16} className="text-amber-500" />
              <a href="mailto:support@mycoffee.vn">support@mycoffee.pk</a>
            </li>
            <li className="flex items-center gap-3 hover:text-amber-400 transition-colors duration-200">
              <Phone size={16} className="text-amber-500" />
              <a href="tel:1900123456">123 456 789</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-amber-500" />
              <span>Hostel city , Islamabad</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-stone-100">
            Newsletter
          </h3>
          <div className="space-y-4">
            <p className="text-stone-300">
              Get special offers and the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-stone-700 border border-stone-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-100"
              />
              <button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-4 py-2 rounded-r-lg transition-all duration-300">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gradient-to-b from-stone-900/80 to-stone-950 border-t border-stone-800 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} My Coffee. All rights reserved by{" "}
          <span className="text-amber-400 font-medium">Fiza Bashir</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
