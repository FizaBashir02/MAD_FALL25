import React from "react";
import {
  MapPin,
  Star,
  Calendar,
  Coffee,
  GlassWater,
} from "lucide-react";
import { formatCurrencyVND } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDateTime";

const MomentCard = ({ moment }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-gray-200">
      {/* Image */}
      <div className="relative overflow-hidden">
        {moment.imageUrl && (
          <img
            src={moment.imageUrl}
            alt={moment.description || "Moment"}
            className="w-full h-48 md:h-64 object-cover hover:scale-110 duration-500"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Coffee size={18} className="text-amber-300" />
            <span>{moment.cafeId?.name}</span>
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        {/* Basic Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-semibold bg-amber-50 text-amber-800 px-2 py-1 rounded-full">
            <Calendar size={12} />
            <span>{formatDateTime(moment.dateTime)}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold bg-amber-100 text-amber-900 px-2 py-1 rounded-full">
            <Star size={12} className="text-amber-600 fill-amber-600" />
            <span>{moment.cafeId?.rating || 0}</span>
          </div>
        </div>

        {/* Address */}
        <p className="text-sm text-amber-800 flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-amber-600 flex-shrink-0" />
          <span>{moment.cafeId?.address}</span>
        </p>

        {/* Description */}
        {moment.description && (
          <p className="text-sm text-stone-600 mb-4 font-semibold">
            {moment.description}
          </p>
        )}

        {/* Selected Drinks */}
        {moment.selectedDrinks?.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 font-medium text-amber-800 mb-2">
              <GlassWater size={16} className="text-amber-600" />
              <span>Ordered Drinks</span>
            </div>

            <div className="space-y-2">
              {moment.selectedDrinks.map((drink, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-amber-100 pb-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-700">
                      {drink.drinkName}
                    </span>
                    <span className="text-stone-400 font-semibold">
                      x{drink.quantity}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-600 font-semibold">
                      {formatCurrencyVND(drink.price)}
                    </div>
                    <div className="text-stone-400 font-semibold">
                      = {formatCurrencyVND(drink.price * drink.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="mt-auto pt-3 border-t border-amber-100">
          <div className="flex items-center justify-between">
            <span className="font-medium text-stone-600">Total:</span>
            <span className="font-bold text-amber-700 text-2xl">
              {formatCurrencyVND(moment.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomentCard;
