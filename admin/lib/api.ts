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

    getOrder: async (id: string) => {
        const docRef = doc(db, "orders", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() } as Order;
        }
        return null;
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

    getUserProfile: async (firebaseUserId: string) => {
        // Query users collection by firebaseUserId field
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("firebaseUserId", "==", firebaseUserId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() } as User;
        }
        return null;
    },

    updateUser: async (id: string, data: Partial<User>) => {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, data);
    },

    deleteUser: async (id: string) => {
        await deleteDoc(doc(db, "users", id));
    },

    // Monthly Revenue
    getMonthlyRevenue: async () => {
        const ordersSnap = await getDocs(collection(db, "orders"));
        const currentYear = new Date().getFullYear();

        // Initialize all 12 months with 0 revenue
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = monthNames.map((name, index) => ({
            name,
            total: 0,
            month: index,
        }));

        // Aggregate revenue by month
        ordersSnap.docs.forEach((doc) => {
            const orderData = doc.data();
            const createdAt = orderData.createdAt;

            if (createdAt) {
                // Parse the date (assuming ISO string format)
                const orderDate = new Date(createdAt);
                const orderYear = orderDate.getFullYear();
                const orderMonth = orderDate.getMonth();

                // Only count orders from the current year
                if (orderYear === currentYear) {
                    monthlyData[orderMonth].total += orderData.totalAmount || 0;
                }
            }
        });

        // Return only the name and total for the chart
        return monthlyData.map(({ name, total }) => ({ name, total }));
    },
};
