"use client";

import { ORDER_TYPES } from "@/lib/constants";

interface OrderTypeSelectorProps {
  onSelect: (type: string) => void;
}

const orderTypeDescriptions: Record<string, string> = {
  STRAIGHT_CAST: "Drop off piece(s) for casting",
  MAKE_MOLD: "Create a new mold and cast",
  MOLD_CAST: "Cast from existing mold inventory",
  FILE_CAST: "Upload STL/3DM file or CAD order",
  CAD_EDIT: "Edit existing CAD files",
  FINISHING: "Polishing & finishing services only",
  QUOTE_REQUEST: "Request a price quote",
};

const orderTypeIcons: Record<string, string> = {
  STRAIGHT_CAST: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  MAKE_MOLD: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  MOLD_CAST: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  FILE_CAST: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
  CAD_EDIT: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  FINISHING: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  QUOTE_REQUEST: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
};

export default function OrderTypeSelector({
  onSelect,
}: OrderTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(ORDER_TYPES).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
            <svg
              className="w-6 h-6 text-amber-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={orderTypeIcons[key] || "M12 4v16m8-8H4"}
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 text-sm">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              {orderTypeDescriptions[key]}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
