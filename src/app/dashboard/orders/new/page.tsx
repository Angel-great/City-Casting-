"use client";

import CreateOrderForm from "@/components/orders/CreateOrderForm";

export default function NewOrderPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Place New Order
      </h1>
      <CreateOrderForm isEmployee={false} />
    </div>
  );
}
