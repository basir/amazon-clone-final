"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Product } from "@/lib/api";

interface ProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, "id"> | Product) => Promise<void>;
    product?: Product | null;
}

export default function ProductDialog({
    isOpen,
    onClose,
    onSave,
    product,
}: ProductDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        images: "",
        category: "",
        brand: "",
        rating: "",
        numReviews: "",
        countInStock: "",
        isDeal: false,
        discount: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                price: product.price?.toString() || "",
                description: product.description || "",
                image: product.image || "",
                images: product.images?.join(", ") || "",
                category: product.category || "",
                brand: product.brand || "",
                rating: product.rating?.toString() || "",
                numReviews: product.numReviews?.toString() || "",
                countInStock: product.countInStock?.toString() || "",
                isDeal: product.isDeal || false,
                discount: product.discount?.toString() || "",
            });
        } else {
            // Reset form for new product
            setFormData({
                name: "",
                price: "",
                description: "",
                image: "",
                images: "",
                category: "",
                brand: "",
                rating: "0",
                numReviews: "0",
                countInStock: "",
                isDeal: false,
                discount: "",
            });
        }
        setError("");
    }, [product, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.name || !formData.price || !formData.category) {
                setError("Please fill in all required fields");
                setLoading(false);
                return;
            }

            const productData: any = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                image: formData.image,
                images: formData.images
                    .split(",")
                    .map((img) => img.trim())
                    .filter((img) => img),
                category: formData.category,
                brand: formData.brand,
                rating: parseFloat(formData.rating) || 0,
                numReviews: parseInt(formData.numReviews) || 0,
                countInStock: parseInt(formData.countInStock) || 0,
                isDeal: formData.isDeal,
                discount: formData.discount ? parseFloat(formData.discount) : undefined,
            };

            if (product) {
                productData.id = product.id;
            }

            await onSave(productData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-xl shadow-xl">
                <div className="sticky top-0 flex items-center justify-between border-b bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {product ? "Edit Product" : "Add Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Price *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Stock Count *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.countInStock}
                                onChange={(e) =>
                                    setFormData({ ...formData, countInStock: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Category *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Brand
                            </label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) =>
                                    setFormData({ ...formData, brand: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Main Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) =>
                                    setFormData({ ...formData, image: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Additional Images (comma-separated URLs)
                            </label>
                            <input
                                type="text"
                                value={formData.images}
                                onChange={(e) =>
                                    setFormData({ ...formData, images: e.target.value })
                                }
                                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Rating
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={(e) =>
                                    setFormData({ ...formData, rating: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Number of Reviews
                            </label>
                            <input
                                type="number"
                                value={formData.numReviews}
                                onChange={(e) =>
                                    setFormData({ ...formData, numReviews: e.target.value })
                                }
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                            />
                        </div>

                        <div className="col-span-2 flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isDeal}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isDeal: e.target.checked })
                                    }
                                    className="rounded border-zinc-300 dark:border-zinc-700"
                                />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Is Deal
                                </span>
                            </label>

                            {formData.isDeal && (
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Discount amount"
                                        value={formData.discount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, discount: e.target.value })
                                        }
                                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-50"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : product ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
