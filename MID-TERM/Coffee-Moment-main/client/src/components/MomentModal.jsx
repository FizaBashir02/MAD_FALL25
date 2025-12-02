import React, { useEffect, useRef, useState } from "react";
import { formatCurrencyVND } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDateTime";

const ANIM_DURATION = 250; // ms — must match CSS animation duration

export default function MomentModal({ open, onClose, moment }) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const timerRef = useRef(null);

  const startClose = () => {
    if (timerRef.current) return;
    setClosing(true);
    timerRef.current = setTimeout(() => {
      setMounted(false);
      setClosing(false);
      timerRef.current = null;
      onClose?.();
    }, ANIM_DURATION);
  };

  useEffect(() => {
    if (open) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!open && mounted) startClose();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        closing ? "animate-[fadeOut_0.25s_ease-in]" : "animate-[fadeIn_0.25s_ease-out]"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 transition-opacity ${
          closing ? "bg-opacity-0" : "bg-opacity-60"
        }`}
        onMouseDown={startClose}
      />

      {/* Modal box */}
      <div
        className={`relative z-10 w-full max-w-xl mx-4 bg-white rounded-xl shadow-lg transform ${
          closing ? "animate-[scaleOut_0.25s_ease-in]" : "animate-[scaleIn_0.25s_ease-out]"
        }`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={startClose}
          className="absolute top-3 right-3 text-stone-500 hover:text-stone-800"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-stone-800">Moment Details</h2>

          {moment ? (
            <div className="space-y-3">
              <p>
                <span className="font-medium text-stone-700">Cafe:</span> {moment.cafeId?.name || "-"}
              </p>
              <p>
                <span className="font-medium text-stone-700">Address:</span> {moment.cafeId?.address || "-"}
              </p>
              <p>
                <span className="font-medium text-stone-700">Description:</span> {moment.description || "-"}
              </p>
              <p>
                <span className="font-medium text-stone-700">Total Price:</span>{" "}
                <span className="text-amber-600 font-semibold">
                  {formatCurrencyVND(moment.totalPrice ?? 0)}
                </span>
              </p>
              <p>
                <span className="font-medium text-stone-700">Date & Time:</span>{" "}
                {formatDateTime(moment.dateTime)}
              </p>

              {/* Drinks */}
              {Array.isArray(moment.selectedDrinks) && moment.selectedDrinks.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-stone-700 mb-2">Drinks Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-stone-200 rounded-lg">
                      <thead className="bg-stone-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-center">Quantity</th>
                          <th className="px-4 py-2 text-right">Price</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {moment.selectedDrinks.map((d, i) => (
                          <tr key={i} className="border-t border-stone-200">
                            <td className="px-4 py-2 capitalize">{d.drinkName || d.name}</td>
                            <td className="px-4 py-2 text-center">{d.quantity}</td>
                            <td className="px-4 py-2 text-right text-amber-600">{formatCurrencyVND(d.price)}</td>
                            <td className="px-4 py-2 text-right text-amber-700 font-semibold">
                              {formatCurrencyVND((d.price || 0) * (d.quantity || 0))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {moment.imageUrl && (
                <div className="mt-4">
                  <img src={moment.imageUrl} alt="Moment" className="w-full h-64 object-cover rounded-lg shadow" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-stone-500">No data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
