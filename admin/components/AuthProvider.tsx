"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const profile = await api.getUserProfile(firebaseUser.uid);
                    if (profile && profile.role === "Admin") {
                        setUser(firebaseUser);
                        setIsAdmin(true);
                    } else {
                        // Not an admin
                        setUser(null);
                        setIsAdmin(false);
                        if (pathname !== "/login") {
                            router.push("/login");
                        }
                    }
                } catch (error) {
                    console.error("Error verifying admin status:", error);
                    setUser(null);
                    setIsAdmin(false);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
                if (pathname !== "/login") {
                    router.push("/login");
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin }}>
            {loading ? (
                <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent dark:border-zinc-50"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}
