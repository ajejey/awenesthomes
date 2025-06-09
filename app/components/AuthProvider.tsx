'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// User type
export type UserRole = 'guest' | 'host' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: async () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch current user on mount
  useEffect(() => {
    async function fetchCurrentUser() {
      console.log("fetchCurrentUser");
      try {
        const res = await fetch('/api/auth/me');
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (res.ok) {
        setUser(null);
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Higher Order Component for protecting client components
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading && !user) {
        // Redirect to login if not authenticated
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    }, [user, isLoading, router, pathname]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Show component if authenticated
    if (user) {
      return <Component {...props} />;
    }

    // Return null while redirecting
    return null;
  };
}

// Higher Order Component for role-based access control
export function withRole<P extends object>(Component: React.ComponentType<P>, allowedRoles: UserRole[]) {
  return function RoleProtectedComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          // Redirect to login if not authenticated
          router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
        } else if (user && !allowedRoles.includes(user.role)) {
          // Redirect to unauthorized page if not authorized
          router.push('/unauthorized');
        }
      }
    }, [user, isLoading, router, pathname]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Show component if authenticated and authorized
    if (user && allowedRoles.includes(user.role)) {
      return <Component {...props} />;
    }

    // Return null while redirecting
    return null;
  };
}
