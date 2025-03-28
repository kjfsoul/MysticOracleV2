// client/src/hooks/use-auth-fixed.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>({ name: "Mira" });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // TEMP: simulate login
    setUser({ name: "Mira", email });
    return { name: "Mira", email };
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    // TEMP: simulate register
    setUser({ name: username, email });
    return { name: username, email };
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
