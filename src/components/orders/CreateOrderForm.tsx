"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrderTypeSelector from "./OrderTypeSelector";
import OrderItemForm, { OrderItemData, createEmptyItem } from "./OrderItemForm";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store";
import { ORDER_TYPES } from "@/lib/constants";

interface Mold {
  id: string;
  styleNumber: string;
  styleName?: string | null;
  imageUrl?: string | null;
  moldMaterial?: string | null;
}

interface CreateOrderFormProps {
  isEmployee?: boolean;
}

export default function CreateOrderForm({
  isEmployee = false,
}: CreateOrderFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState<"auth" | "type" | "items" | "review">("type");
  const [orderType, setOrderType] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [customerPin, setCustomerPin] = useState("");
  const [overridePin, setOverridePin] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [items, setItems] = useState<OrderItemData[]>([createEmptyItem()]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [molds, setMolds] = useState<Mold[]>([]);
  const [customers, setCustomers] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      companyName?: string | null;
      customerCode?: string | null;
    }>
  >([]);

  useEffect(() => {
    if (isEmployee) {
      fetch("/api/customers")
        .then((r) => r.json())
        .then((data) => setCustomers(data.customers || []))
        .catch(() => {});
    }
  }, [isEmployee]);

  useEffect(() => {
    const custId = isEmployee ? selectedCustomerId : user?.id;
    if (custId && (orderType === "MOLD_CAST" || orderType === "MAKE_MOLD")) {
      fetch(`/api/molds?customerId=${custId}`)
        .then((r) => r.json())
        .then((data) => setMolds(data.molds || []))
        .catch(() => {});
    }
  }, [selectedCustomerId, user?.id, isEmployee, orderType]);

  const handleTypeSelect = (type: string) => {
    setOrderType(type);
    setItems([createEmptyItem()]);
    if (isEmployee) {
      setStep("auth");
    } else {
      setStep("items");
    }
  };

  const handleAuthSubmit = () => {
    if (!selectedCustomerId) {
      setError("Please select a customer");
      return;
    }
    setError("");
    setStep("items");
  };

  const handleItemChange = (index: number, item: OrderItemData) => {
    const newItems = [...items];
    newItems[index] = item;
    setItems(newItems);
  };

  const handleItemRemove = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const processedItems = await Promise.all(
        items.map(async (item) => {
          let imageUrl = item.imageUrl;
          let fileUrl = item.fileUrl;

          if (item.imageFile) {
            imageUrl = await uploadFile(item.imageFile);
          }
          if (item.fileFile) {
            fileUrl = await uploadFile(item.fileFile);
          }

          return {
            styleName: item.styleName || null,
            imageUrl: imageUrl || null,
            metal: item.metals.length > 0 ? item.metals.join(", ") : item.metal || null,
            moldType: item.moldType || null,
            moldId: item.moldId || null,
            quantity: item.quantity,
            waxSize: item.waxSize || null,
            polishingServices: item.polishingServices,
            printType: item.printType || null,
            fileUrl: fileUrl || null,
            fileType: item.fileType || null,
            cadEditNotes: item.cadEditNotes || null,
            notes: item.notes || null,
          };
        })
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          customerId: isEmployee ? selectedCustomerId : undefined,
          items: processedItems,
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create order");
      }

      const data = await res.json();
      router.push(
        isEmployee
          ? `/employee/orders/${data.order.id}`
          : `/dashboard/orders/${data.order.id}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span
            className={
              step === "type" ? "text-amber-600 font-semibold" : ""
            }
          >
            1. Select Type
          </span>
          <span>&rarr;</span>
          {isEmployee && (
            <>
              <span
                className={
                  step === "auth" ? "text-amber-600 font-semibold" : ""
                }
              >
                2. Select Customer
              </span>
              <span>&rarr;</span>
            </>
          )}
          <span
            className={
              step === "items" ? "text-amber-600 font-semibold" : ""
            }
          >
            {isEmployee ? "3" : "2"}. Add Items
          </span>
          <span>&rarr;</span>
          <span
            className={
              step === "review" ? "text-amber-600 font-semibold" : ""
            }
          >
            {isEmployee ? "4" : "3"}. Review & Submit
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {step === "type" && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Select Order Type
          </h2>
          <OrderTypeSelector onSelect={handleTypeSelect} />
        </div>
      )}

      {step === "auth" && isEmployee && (
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Select Customer -{" "}
            {ORDER_TYPES[orderType as keyof typeof ORDER_TYPES]}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName || `${c.firstName} ${c.lastName}`} (
                    {c.customerCode})
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Customer Code (optional verification)"
              value={customerCode}
              onChange={(e) => setCustomerCode(e.target.value)}
              placeholder="CC-XXXXXX"
            />
            <Input
              label="Customer PIN (optional verification)"
              type="password"
              value={customerPin}
              onChange={(e) => setCustomerPin(e.target.value)}
              placeholder="****"
            />
            <Input
              label="Override PIN (Account Manager)"
              type="password"
              value={overridePin}
              onChange={(e) => setOverridePin(e.target.value)}
              placeholder="****"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("type")}>
                Back
              </Button>
              <Button onClick={handleAuthSubmit}>Continue</Button>
            </div>
          </div>
        </div>
      )}

      {step === "items" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {ORDER_TYPES[orderType as keyof typeof ORDER_TYPES]} - Add
              Items
            </h2>
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              + Add Another Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <OrderItemForm
                key={idx}
                orderType={orderType}
                index={idx}
                item={item}
                onChange={handleItemChange}
                onRemove={handleItemRemove}
                molds={molds}
              />
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              General Order Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Any additional notes for the entire order..."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(isEmployee ? "auth" : "type")}
            >
              Back
            </Button>
            <Button onClick={() => setStep("review")}>
              Review Order
            </Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Review Order
          </h2>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Order Type</span>
                <p className="font-semibold">
                  {ORDER_TYPES[orderType as keyof typeof ORDER_TYPES]}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Items</span>
                <p className="font-semibold">{items.length}</p>
              </div>
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                className="border-t border-gray-100 pt-4 mt-4"
              >
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt="Item"
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                    {item.styleName && (
                      <div>
                        <span className="text-gray-500">Style:</span>{" "}
                        {item.styleName}
                      </div>
                    )}
                    {(item.metal || item.metals.length > 0) && (
                      <div>
                        <span className="text-gray-500">Metal:</span>{" "}
                        {item.metals.length > 0
                          ? item.metals.join(", ")
                          : item.metal}
                      </div>
                    )}
                    {item.moldType && (
                      <div>
                        <span className="text-gray-500">Mold:</span>{" "}
                        {item.moldType}
                      </div>
                    )}
                    {item.quantity > 1 && (
                      <div>
                        <span className="text-gray-500">Qty:</span>{" "}
                        {item.quantity}
                      </div>
                    )}
                    {item.waxSize && (
                      <div>
                        <span className="text-gray-500">Size:</span>{" "}
                        {item.waxSize}
                      </div>
                    )}
                    {item.polishingServices.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-500">
                          Polishing:
                        </span>{" "}
                        {item.polishingServices.join(", ")}
                      </div>
                    )}
                    {item.notes && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Notes:</span>{" "}
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {notes && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <span className="text-sm text-gray-500">Order Notes:</span>
                <p className="text-sm mt-1">{notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("items")}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Order"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
