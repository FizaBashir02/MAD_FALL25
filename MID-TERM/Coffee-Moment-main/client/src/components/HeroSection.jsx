import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, ChevronRight, MapPin, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const images = [
    "https://i.postimg.cc/5NCP22P2/IMG-20250325-174109.jpg",
    "https://i.postimg.cc/NGrx4QKX/20250305-200103.jpg",
    "https://i.postimg.cc/QxQk2Skx/20250216-151113.jpg",
    "https://i.postimg.cc/L8vkXXbc/20230128-101158.jpg",
    "https://i.postimg.cc/zDWnhpQS/20230215-110632.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-screen min-h-full flex items-center justify-center text-center overflow-hidden">
      {/* Slider images */}
      {images.map((src, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1 }}
        />
      ))}

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 to-black/50"></div>

      {/* Floating coffee beans decoration */}
      <div className="absolute inset-0 opacity-20">
        <Coffee className="absolute top-1/4 left-1/4 w-16 h-16 text-amber-300 animate-float" />
        <Coffee className="absolute top-1/3 right-1/4 w-14 h-14 text-amber-300 animate-float-delay" />
        <Coffee className="absolute bottom-1/4 left-1/3 w-12 h-12 text-amber-300 animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-white max-w-5xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-amber-300 to-amber-200 bg-clip-text text-transparent">
            Capture Every Coffee Moment
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-2xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Keep track of the cafes you visit, your favorite drinks, and memorable stories.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/moment")}
            className="group relative overflow-hidden bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white px-10 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <div className="relative z-10 flex items-center justify-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-full">
                <Coffee className="w-6 h-6 text-amber-200 group-hover:text-white transition-colors" />
              </div>
              <span className="text-lg tracking-wide">Get Started</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <ChevronRight className="w-5 h-5 text-amber-200 group-hover:text-white transition-colors" />
              </motion.div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/cafe")}
            className="group flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-amber-100 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-amber-200/20 hover:border-amber-200/40 transition-all duration-300"
          >
            <MapPin className="w-5 h-5 text-amber-200 group-hover:text-white" />
            <span>Explore Cafes</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-amber-100"
        >
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-300" />
            <span>10,000+ moments</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-300" />
            <span>2,000+ cafes</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-amber-200"
      >
        <ChevronRight className="w-8 h-8 rotate-90" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
