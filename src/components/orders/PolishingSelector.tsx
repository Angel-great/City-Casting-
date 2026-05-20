"use client";

import { useState } from "react";
import { POLISHING_SERVICES } from "@/lib/constants";

interface PolishingSelectorProps {
  value: string[];
  onChange: (services: string[]) => void;
}

export default function PolishingSelector({
  value,
  onChange,
}: PolishingSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = POLISHING_SERVICES.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (service: string) => {
    if (value.includes(service)) {
      onChange(value.filter((s) => s !== service));
    } else {
      onChange([...value, service]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Polishing / Finishing Services (select multiple)
      </label>
      <input
        type="text"
        placeholder="Search services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
        {filtered.map((service) => (
          <button
            key={service}
            type="button"
            onClick={() => toggle(service)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors ${
              value.includes(service)
                ? "bg-amber-100 text-amber-800 font-medium"
                : "text-gray-700"
            }`}
          >
            {value.includes(service) && (
              <span className="mr-2">&#10003;</span>
            )}
            {service}
          </button>
        ))}
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {value.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs"
            >
              {s}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== s))}
                className="hover:text-amber-900"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
