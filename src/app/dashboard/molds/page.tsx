"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

interface Mold {
  id: string;
  styleNumber: string;
  styleName?: string | null;
  imageUrl?: string | null;
  moldMaterial?: string | null;
  dateMade?: string | null;
  condition: string;
  isPickedUp: boolean;
  notes?: string | null;
}

export default function MoldsPage() {
  const [molds, setMolds] = useState<Mold[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    fetch(`/api/molds?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setMolds(data.molds || []);
        setLoading(false);
      });
  }, [search]);

  const conditionVariant = (
    condition: string
  ): "success" | "warning" | "danger" | "default" => {
    const map: Record<string, "success" | "warning" | "danger" | "default"> = {
      GOOD: "success",
      FAIR: "warning",
      POOR: "danger",
      RETIRED: "default",
    };
    return map[condition] || "default";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Mold Inventory
      </h1>

      <div className="mb-6">
        <Input
          placeholder="Search by style number or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : molds.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No molds in inventory
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {molds.map((mold) => (
            <div
              key={mold.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex gap-4">
                {mold.imageUrl ? (
                  <img
                    src={mold.imageUrl}
                    alt={mold.styleName || mold.styleNumber}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {mold.styleNumber}
                  </p>
                  {mold.styleName && (
                    <p className="text-sm text-gray-600">
                      {mold.styleName}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {mold.moldMaterial || "N/A"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={conditionVariant(mold.condition)}>
                      {mold.condition}
                    </Badge>
                    {mold.isPickedUp && (
                      <Badge variant="info">Picked Up</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
