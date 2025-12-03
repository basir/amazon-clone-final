"use client";

import { useEffect, useState } from "react";
import { Search, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { api, Order } from "@/lib/api";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.getOrders();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="p-8">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Orders
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50"
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800">
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Order ID
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    User ID
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Date
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Items
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Total
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Status
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800"
                                >
                                    <td className="p-4 align-middle font-medium text-zinc-900 dark:text-white">
                                        {order.id}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className="font-medium text-zinc-900 dark:text-white">
                                            {order.userId}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-zinc-500 dark:text-zinc-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 align-middle text-zinc-500 dark:text-zinc-400">
                                        {order.items?.length || 0} items
                                    </td>
                                    <td className="p-4 align-middle text-zinc-900 dark:text-white">
                                        ${order.totalAmount}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === "Completed"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : order.status === "Processing"
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                            >
                                                <Eye className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                            </Link>
                                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
