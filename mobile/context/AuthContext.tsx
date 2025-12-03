import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<void>;
    register: (userData: Partial<User>) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Find user in Firestore by firebaseUserId field
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('firebaseUserId', '==', firebaseUser.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    setUser({ id: userDoc.id, ...userDoc.data() } as User);
                } else {
                    // Handle case where user exists in Auth but not Firestore (shouldn't happen normally)
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email!,
                        name: firebaseUser.displayName || 'User',
                        addresses: [],
                        firebaseUserId: firebaseUser.uid
                    } as any);
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // const login = async (email: string, password?: string) => {
    //     if (!password) throw new Error('Password is required');
    //     await signInWithEmailAndPassword(auth, email, password);

    // };
    const login = async (email: string, password?: string) => {
        if (!password) {
            throw new Error('Password is required');
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful!");
        } catch (error: any) { // Use 'any' for simpler error handling, or specific FirebaseError type
            console.error("Firebase Authentication Error:", error.code, error.message);
            // You can add more specific handling here based on error.code
            if (error.code === 'auth/wrong-password') {
                console.log('The password you entered is incorrect.');
            } else if (error.code === 'auth/user-not-found') {
                console.log('No account found with that email address.');
            } else {
                console.log(error.message);
            }
            throw error; // Re-throw if you want to propagate the error further
        }
    };


    const register = async (userData: Partial<User>) => {
        if (!userData.email || !userData.password) throw new Error('Email and password required');
        console.log("Registering user:", userData);

        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const firebaseUser = userCredential.user;

        // Get the last user ID to auto-increment
        const usersSnapshot = await getDocs(collection(db, 'users'));
        let maxId = 0;
        usersSnapshot.docs.forEach(doc => {
            const id = parseInt(doc.id);
            if (!isNaN(id) && id > maxId) {
                maxId = id;
            }
        });
        const newUserId = (maxId + 1).toString();

        const newUser: User = {
            id: newUserId,
            email: userData.email,
            name: userData.name || 'User',
            phone: userData.phone || null,
            addresses: [],
            firebaseUserId: firebaseUser.uid, // Save Firebase UID separately
        } as any;

        // Save user data to Firestore with auto-incremented ID
        await setDoc(doc(db, 'users', newUserId), newUser);
        setUser(newUser);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateUser = async (data: Partial<User>) => {
        if (!user) return;
        // Update in Firestore
        await setDoc(doc(db, 'users', user.id.toString()), data, { merge: true });
        setUser({ ...user, ...data });
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
