"use client";

import { use } from "react";
import OrderDetail from "@/components/orders/OrderDetail";

export default function EmployeeOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <OrderDetail orderId={id} isEmployee={true} />;
}
