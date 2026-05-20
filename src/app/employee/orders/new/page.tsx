"use client";

import CreateOrderForm from "@/components/orders/CreateOrderForm";

export default function EmployeeNewOrderPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Place Order for Customer
      </h1>
      <CreateOrderForm isEmployee={true} />
    </div>
  );
}
