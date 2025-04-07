import { supabase } from "@/lib/supabaseClient";
import { createContext, useContext, useEffect, useState } from "react";
// Define User type inline to match the actual table structure
interface User {
  id: string;
  email: string;
  created_at: Date;
  last_login?: Date;
  [key: string]: any; // Allow for additional properties
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, username: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null | void>;
  isAuthenticated?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userError) throw userError;
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (userError) {
        console.warn(
          "User not found in users table, creating basic user object"
        );
        // If the user doesn't exist in the users table, create a basic user object
        const basicUser = {
          id: user!.id,
          email,
          created_at: new Date(),
          last_login: new Date(),
        };

        // Try to create the user record
        try {
          await supabase.from("users").insert([basicUser]);
        } catch (insertError) {
          console.error("Error creating user record:", insertError);
        }

        setUser(basicUser);
        return basicUser;
      }

      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting to sign up with:", { email, username });

      // First check if the user table exists
      const { error: tableCheckError } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      const userTableExists = !tableCheckError;
      console.log("User table exists:", userTableExists);

      // Sign up the user with Supabase Auth
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      if (!user) {
        throw new Error(
          "Signup successful, but no user returned. Check your email for confirmation."
        );
      }

      console.log("User signed up successfully:", user.id);

      // Only try to create a user record if the users table exists
      if (userTableExists) {
        // Create a user record that matches your table structure
        const newUser = {
          id: user.id,
          email,
          created_at: new Date(),
        };

        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert([newUser])
          .select()
          .single();

        if (userError) {
          console.error("Error creating user record:", userError);
          // Don't throw here, as the auth signup was successful
        } else {
          setUser(userData);
          return userData;
        }
      }

      // If we don't have a users table or couldn't insert, return a basic user object
      const basicUser = {
        id: user.id,
        email,
        created_at: new Date(),
      };

      setUser(basicUser);
      return basicUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
