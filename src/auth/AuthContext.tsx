import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from "react";
  import { onAuthStateChanged, signOut, User } from "firebase/auth";
  import { auth } from "./firebase";
  
  // Updated interface with `user` and `isLoading`
  interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
  }
  
  const AuthContext = createContext<AuthContextType | null>(null);
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      // Only initialize Firebase auth on client side
      if (typeof window !== 'undefined') {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setIsLoading(false);
        });
  
        return () => unsubscribe();
      } else {
        // On server side, set loading to false immediately
        setIsLoading(false);
      }
    }, []);
  
    return (
        <AuthContext.Provider value={{ user, isLoading, signOut: () => signOut(auth) }}>

        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      // During SSR, provide a default context to prevent errors
      if (typeof window === 'undefined') {
        return {
          user: null,
          isLoading: true,
          signOut: async () => {}
        };
      }
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
