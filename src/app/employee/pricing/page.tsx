"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";

interface MetalPrice {
  id: string;
  metalType: string;
  karat?: string | null;
  color?: string | null;
  pricePerOz: number;
  pricePerGram: number;
  updatedAt: string;
}

export default function EmployeePricingPage() {
  const [prices, setPrices] = useState<MetalPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/metals")
      .then((r) => r.json())
      .then((data) => {
        setPrices(data.prices || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const goldPrices = prices.filter((p) => p.metalType === "GOLD");
  const otherPrices = prices.filter((p) => p.metalType !== "GOLD");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Metal Pricing Management
      </h1>
      <p className="text-gray-500 mb-8">
        Current market prices for precious metals
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Gold Prices" subtitle="By karat purity">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-sm font-semibold text-gray-600">
                  Karat
                </th>
                <th className="text-right py-2 text-sm font-semibold text-gray-600">
                  Per Ounce
                </th>
                <th className="text-right py-2 text-sm font-semibold text-gray-600">
                  Per Gram
                </th>
              </tr>
            </thead>
            <tbody>
              {goldPrices.map((price) => (
                <tr
                  key={price.id}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 font-semibold text-amber-700">
                    {price.karat}
                  </td>
                  <td className="py-3 text-right font-mono font-semibold">
                    ${price.pricePerOz.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-mono text-gray-600">
                    ${price.pricePerGram.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Other Precious Metals">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-sm font-semibold text-gray-600">
                  Metal
                </th>
                <th className="text-right py-2 text-sm font-semibold text-gray-600">
                  Per Ounce
                </th>
                <th className="text-right py-2 text-sm font-semibold text-gray-600">
                  Per Gram
                </th>
              </tr>
            </thead>
            <tbody>
              {otherPrices.map((price) => (
                <tr
                  key={price.id}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 font-semibold text-gray-900">
                    {price.metalType}
                  </td>
                  <td className="py-3 text-right font-mono font-semibold">
                    ${price.pricePerOz.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-mono text-gray-600">
                    ${price.pricePerGram.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
