"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, MoreHorizontal, Search, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { api, Product } from "@/lib/api";
import ProductDialog from "@/components/ProductDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // Filter products based on search query
        if (searchQuery.trim() === "") {
            setFilteredProducts(products);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query) ||
                    product.brand?.toLowerCase().includes(query)
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    useEffect(() => {
        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchProducts = async () => {
        try {
            setError("");
            const data = await api.getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsProductDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsProductDialogOpen(true);
        setOpenMenuId(null);
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
        setOpenMenuId(null);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        setDeleteLoading(true);
        try {
            await api.deleteProduct(productToDelete.id);
            setProducts(products.filter((p) => p.id !== productToDelete.id));
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSaveProduct = async (productData: Omit<Product, "id"> | Product) => {
        if ("id" in productData) {
            // Update existing product
            await api.updateProduct(productData.id, productData);
            setProducts(
                products.map((p) =>
                    p.id === productData.id ? { ...p, ...productData } : p
                )
            );
        } else {
            // Create new product
            const newProduct = await api.createProduct(productData);
            setProducts([newProduct, ...products]);
        }
    };

    const toggleMenu = (productId: string) => {
        setOpenMenuId(openMenuId === productId ? null : productId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-zinc-500 dark:text-zinc-400">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Products
                </h2>
                <button
                    onClick={handleAddProduct}
                    className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:text-white"
                    />
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800">
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Image
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Name
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Category
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Price
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Stock
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Rating
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-zinc-500 dark:text-zinc-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                                        {searchQuery ? "No products found matching your search" : "No products yet"}
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800"
                                    >
                                        <td className="p-4 align-middle">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                                                {product.image ? (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                                                        IMG
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-medium text-zinc-900 dark:text-white">
                                            {product.name}
                                        </td>
                                        <td className="p-4 align-middle text-zinc-500 dark:text-zinc-400">
                                            {product.category}
                                        </td>
                                        <td className="p-4 align-middle text-zinc-900 dark:text-white">
                                            ${product.price}
                                        </td>
                                        <td className="p-4 align-middle text-zinc-500 dark:text-zinc-400">
                                            {product.countInStock}
                                        </td>
                                        <td className="p-4 align-middle text-zinc-500 dark:text-zinc-400">
                                            {product.rating}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="relative" ref={openMenuId === product.id ? menuRef : null}>
                                                <button
                                                    onClick={() => toggleMenu(product.id)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                >
                                                    <MoreHorizontal className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                                </button>
                                                {openMenuId === product.id && (
                                                    <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg dark:bg-zinc-900 dark:border-zinc-800 z-10">
                                                        <button
                                                            onClick={() => handleEditProduct(product)}
                                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-t-lg"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(product)}
                                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-b-lg"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductDialog
                isOpen={isProductDialogOpen}
                onClose={() => {
                    setIsProductDialogOpen(false);
                    setSelectedProduct(null);
                }}
                onSave={handleSaveProduct}
                product={selectedProduct}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setProductToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                productName={productToDelete?.name || ""}
                loading={deleteLoading}
            />
        </div>
    );
}
