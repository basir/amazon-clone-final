
import { Order } from "@/lib/api";

interface RecentOrdersProps {
    orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <div className="rounded-xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Recent Orders
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Latest transactions from your store.
                </p>
            </div>
            <div className="p-6 pt-0">
                <div className="space-y-8">
                    {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-medium dark:bg-zinc-800">
                                {order.userId.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none text-zinc-900 dark:text-white">
                                    {order.userId}
                                </p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {order.id}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-zinc-900 dark:text-white">
                                ${order.totalAmount}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
