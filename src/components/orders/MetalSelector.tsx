"use client";

import { useState } from "react";
import { METALS } from "@/lib/constants";

interface MetalSelectorProps {
  value: string[];
  onChange: (metals: string[]) => void;
  multiple?: boolean;
}

export default function MetalSelector({
  value,
  onChange,
  multiple = false,
}: MetalSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = METALS.filter((m) =>
    m.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMetal = (metal: string) => {
    if (multiple) {
      if (value.includes(metal)) {
        onChange(value.filter((m) => m !== metal));
      } else {
        onChange([...value, metal]);
      }
    } else {
      onChange([metal]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Metal {multiple && "(select multiple)"}
      </label>
      <input
        type="text"
        placeholder="Search metals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
        {filtered.map((metal) => (
          <button
            key={metal}
            type="button"
            onClick={() => toggleMetal(metal)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors ${
              value.includes(metal)
                ? "bg-amber-100 text-amber-800 font-medium"
                : "text-gray-700"
            }`}
          >
            {value.includes(metal) && (
              <span className="mr-2">&#10003;</span>
            )}
            {metal}
          </button>
        ))}
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {value.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs"
            >
              {m}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== m))}
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
