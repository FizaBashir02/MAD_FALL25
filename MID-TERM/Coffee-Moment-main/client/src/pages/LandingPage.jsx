import {
  Coffee,
  BookOpen,
  Camera,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Coffee01 from "../assets/images/coffee_01.jpg";
import { useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";

export default function LandingPage() {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section className="py-16 px-6 mx-auto text-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 opacity-70 pointer-events-none"></div>

        {/* Decorative Coffee icons */}
        <Coffee className="absolute -top-10 -left-10 w-32 h-32 text-amber-300 opacity-10 rotate-12" strokeWidth={1.5} />
        <Coffee className="absolute bottom-0 right-0 w-28 h-28 text-amber-400 opacity-10 -rotate-12" strokeWidth={1.5} />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-400 shadow-lg mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Coffee className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            About <span className="text-amber-600">Cafe Moments</span>
          </h2>
          <p className="text-stone-600 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
            Cafe Moments is the place to store and share your coffee experiences. 
            You can save cafe info, drinks, photos, and emotions for every visit.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent mb-4"
            >
              Unique Coffee Experience
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-amber-900/80 max-w-3xl mx-auto"
            >
              Explore features that help you save every memorable coffee moment.
            </motion.p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Coffee size={48} className="text-amber-100" />,
                title: "Save Favorite Cafes",
                desc: "Keep track of every cafe you visit with full details.",
                gradient: "bg-gradient-to-br from-amber-700/90 to-amber-600",
              },
              {
                icon: <Camera size={48} className="text-amber-100" />,
                title: "Share Moments",
                desc: "Save your best photos and emotions at each cafe.",
                gradient: "bg-gradient-to-br from-amber-600/90 to-amber-500",
              },
              {
                icon: <BookOpen size={48} className="text-amber-100" />,
                title: "Personal Coffee Journal",
                desc: "Organize and manage all your coffee experiences easily.",
                gradient: "bg-gradient-to-br from-amber-800/90 to-amber-700",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${feature.gradient} opacity-90`}></div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 rotate-12">
                    <Coffee size={80} />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  <div className="mb-6 p-4 bg-amber-900/30 rounded-full w-max backdrop-blur-sm">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-amber-50 mb-3">{feature.title}</h3>
                  <p className="text-amber-100/90 mb-6 flex-grow">{feature.desc}</p>

                  <button className="mt-auto w-full flex items-center justify-between px-4 py-3 bg-amber-900/30 hover:bg-amber-900/40 rounded-lg backdrop-blur-sm border border-amber-700/50 hover:border-amber-600 transition-all group/button">
                    <span className="text-amber-50 font-medium">Explore</span>
                    <div className="flex items-center">
                      <span className="w-6 h-0.5 bg-amber-300 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></span>
                      <ChevronRight className="w-5 h-5 text-amber-300 ml-1 group-hover/button:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute -inset-2 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={Coffee01}
              alt="Cafe inspiration"
              className="relative z-10 w-full h-80 lg:h-96 object-cover rounded-xl shadow-xl group-hover:shadow-2xl transition-all duration-500"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent rounded-xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
              Capture Memorable Moments
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Every visit to a cafe is a new story. Save photos, emotions, and your favorite drinks to smile at sweet memories later.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/moment")}
              className="group relative overflow-hidden bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                <div className="p-1 bg-amber-500/20 rounded-full">
                  <Coffee className="w-6 h-6 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </div>
                <span className="text-lg tracking-wide">Discover Now</span>
                <ChevronRight className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
              </div>
            </motion.button>

            <div className="flex items-center gap-3 text-sm text-stone-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span>Over 1000+ moments saved</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-50 drop-shadow-md">
            Ready to save your coffee memories?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Share your favorite coffee moments
          </p>
          <button
            onClick={() => navigate("/create-moment")}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-amber-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Coffee className="inline mr-3" size={22} />
            Create New Moment
            <ChevronRight className="inline ml-2" size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
