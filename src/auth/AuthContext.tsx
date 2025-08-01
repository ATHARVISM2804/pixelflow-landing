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
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setIsLoading(false);
      });
  
      return () => unsubscribe();
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
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  