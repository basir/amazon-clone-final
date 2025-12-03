export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
}

export interface User {
    id: string;
    email: string;
    password?: string; // Optional for frontend state
    name: string;
    phone: string | null;
    addresses: Address[];
    firebaseUserId?: string; // Firebase Auth UID
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    categoryId: string;
    subCategoryId: string;
    category: string;
    subCategory: string;
    images: string[];
    inStock: boolean;
    stockQuantity: number;
    rating: number;
    ratingCount: number;
    brand: string;
    isDeal: boolean;
    isBestseller: boolean;
    description?: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
    order: number;
    subCategories?: { id: string; name: string; image: string }[];
}

export interface Banner {
    id: string;
    image: string;
    title: string;
    link: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
    product?: Product; // Populated field
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    productName: string;
    productImage: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: Address;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    statusHistory: { status: string; date: string }[];
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt?: string;
}

export interface Wishlist {
    id: string;
    userId: string;
    products: string[]; // Array of product IDs
}

export interface Banner {
    id: string;
    image: string;
    title: string;
    link: string;
}

export interface ProductFilter {
    query?: string;
    categoryId?: string;
    subCategoryId?: string;
    brand?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    sortOrder?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
    isDeal?: boolean;
}
