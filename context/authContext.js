"use client";
/**
 * AuthProvider component that provides authentication context to its children.
 * It uses Firebase authentication to track the user's authentication state.
 * If the user is not authenticated, it redirects to the login page.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthContext provider with user and loading state.
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase"; // Make sure to initialize Firebase app

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const authChange = onAuthStateChanged(auth, (user) => {
            console.log("authChange", user);
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                    router.push("/login");
            }
            setLoading(false);
        });

        return () => authChange();
    }, [auth, router]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
