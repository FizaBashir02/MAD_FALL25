import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', icon: Icon, children, className = '', ...props }) => {
  const baseStyle = "relative overflow-hidden flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 border border-transparent",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10 backdrop-blur-sm",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/20",
    outline: "border border-teal-500/50 text-teal-400 hover:bg-teal-500/10",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <MotionButton 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {Icon && <Icon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />}
      {children}
    </MotionButton>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  delay?: number;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action, delay = 0 }) => (
  <MotionDiv 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className={`glass-panel rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden group ${className}`}
  >
    {/* Hover Glow Effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-600 opacity-0 group-hover:opacity-20 blur transition duration-500" />
    
    <div className="relative z-10">
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-2">
          {title && <h3 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  </MotionDiv>
);

interface BadgeProps {
  status: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const getStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case 'resolved':
      case 'ready':
      case 'collected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'in progress':
      case 'preparing':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border ${getStyle(status)} backdrop-blur-md`}>
      {status}
    </span>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="glass-panel w-[95%] md:w-full max-w-md rounded-3xl p-6 md:p-8 relative z-10 border border-white/10 shadow-2xl shadow-purple-500/20 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">{title}</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">&times;</button>
            </div>
            {children}
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};