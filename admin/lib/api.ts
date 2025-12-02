import { db } from "./firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    limit,
    Timestamp,
} from "firebase/firestore";

// Types (simplified for admin)
export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    images: string[];
    category: string;
    brand: string;
    rating: number;
    numReviews: number;
    countInStock: number;
    isDeal: boolean;
    discount?: number;
    createdAt?: string;
}

export interface Order {
    id: string;
    userId: string;
    items: any[];
    totalAmount: number;
    status: string;
    createdAt: string;
    shippingAddress: any;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export const api = {
    // Stats
    getStats: async () => {
        // In a real app, you might use aggregation queries or cloud functions for this.
        // For now, we'll fetch all and count (not efficient for large datasets but fine for this demo).
        const productsSnap = await getDocs(collection(db, "products"));
        const ordersSnap = await getDocs(collection(db, "orders"));
        const usersSnap = await getDocs(collection(db, "users"));

        const totalRevenue = ordersSnap.docs.reduce(
            (acc, doc) => acc + (doc.data().totalAmount || 0),
            0
        );

        return {
            totalRevenue,
            totalOrders: ordersSnap.size,
            totalProducts: productsSnap.size,
            totalUsers: usersSnap.size,
        };
    },

    // Products
    getProducts: async () => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc")); // Assuming createdAt exists, else remove orderBy
        // Fallback if createdAt doesn't exist in all docs:
        // const q = query(collection(db, "products"));
        const snapshot = await getDocs(collection(db, "products"));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];
    },

    createProduct: async (product: Omit<Product, "id">) => {
        const docRef = await addDoc(collection(db, "products"), {
            ...product,
            createdAt: new Date().toISOString(),
        });
        return { id: docRef.id, ...product };
    },

    updateProduct: async (id: string, data: Partial<Product>) => {
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, data);
        return { id, ...data };
    },

    deleteProduct: async (id: string) => {
        await deleteDoc(doc(db, "products", id));
    },

    // Orders
    getOrders: async () => {
        const snapshot = await getDocs(collection(db, "orders"));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Order[];
    },

    updateOrderStatus: async (id: string, status: string) => {
        const docRef = doc(db, "orders", id);
        await updateDoc(docRef, { status });
    },

    // Users
    getUsers: async () => {
        const snapshot = await getDocs(collection(db, "users"));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as User[];
    },

    getUserProfile: async (id: string) => {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as User;
        }
        return null;
    },
};
