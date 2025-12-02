import React from "react";
import { MapPin, Star, Coffee, ChevronRight } from "lucide-react";

const CafeCard = ({ cafe }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-gray-200 group">
      {/* Image with overlay */}
      <div className="relative overflow-hidden">
        {cafe.imageUrl && (
          <img
            src={cafe.imageUrl}
            alt={cafe.name}
            className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Cafe Name */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
            <Coffee size={18} className="text-amber-600" />
            <span className="">{cafe.name}</span>
          </h3>
          <ChevronRight
            size={18}
            className="text-amber-400 group-hover:text-amber-600 transition-colors"
          />
        </div>

        {/* Address */}
        <p className="text-sm text-amber-800 flex items-center gap-2 mb-3">
          <MapPin size={20} className="text-amber-600 flex-shrink-0" />
          <span className="">{cafe.address}</span>
        </p>

        {/* Description */}
        {cafe.description && (
          <p className="font-medium text-stone-600 mb-4 text-sm">
            {cafe.description}
          </p>
        )}

        {/* Rating and Action */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
            <Star size={16} className="text-amber-600 fill-amber-600" />
            <span className="text-sm font-medium text-amber-900">
              {cafe.rating?.toFixed(1) || "0.0"} / 5
            </span>
          </div>

          {/* Uncomment if you want a "View Details" button */}
          {/* <button className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
            View Details
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default CafeCard;
