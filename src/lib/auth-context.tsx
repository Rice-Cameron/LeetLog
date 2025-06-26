import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const stackSession = await useUser();
        setUser(stackSession);
        setSession(stackSession);
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
