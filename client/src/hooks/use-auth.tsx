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
        // Try to get user data from the users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userError) {
          console.warn(
            "User not found in users table during checkAuth, using session data"
          );
          // Create a basic user object from session data
          const basicUser = {
            id: session.user.id,
            email: session.user.email,
            username:
              session.user.user_metadata?.username ||
              session.user.email?.split("@")[0] ||
              "user",
            created_at: session.user.created_at || new Date(),
          };
          setUser(basicUser);
        } else {
          setUser(userData);
        }
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
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userError) {
          console.warn(
            "User not found in users table during auth state change, using session data"
          );
          // Create a basic user object from session data
          const basicUser = {
            id: session.user.id,
            email: session.user.email,
            username:
              session.user.user_metadata?.username ||
              session.user.email?.split("@")[0] ||
              "user",
            created_at: session.user.created_at || new Date(),
          };
          setUser(basicUser);
        } else {
          setUser(userData);
        }
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
      console.log("Attempting to sign in with:", { email });

      // Sign in with Supabase Auth
      const {
        data: { user: authUser, session },
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error during login:", authError);
        throw authError;
      }

      if (!authUser) {
        console.error("No user returned from auth");
        throw new Error("Authentication failed");
      }

      console.log("Auth successful, user ID:", authUser.id);
      console.log("Session:", session ? "Valid" : "Missing");

      // Get user data from the users table
      // First check if the users table exists
      const { data: tableData, error: tableError } = await supabase
        .from("users")
        .select("count")
        .limit(1);

      // If there's an error with the users table, just use the auth user data
      if (tableError) {
        console.warn(
          "Error accessing users table, using auth data only:",
          tableError.message
        );
        const basicUser = {
          id: authUser.id,
          email: authUser.email,
          username: authUser.user_metadata?.username || email.split("@")[0],
          created_at: authUser.created_at,
        };
        setUser(basicUser);
        return basicUser;
      }

      // Get user data from the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      console.log("User data query result:", { userData, userError });

      if (userError) {
        console.warn(
          "User not found in users table, creating basic user object"
        );
        // If the user doesn't exist in the users table, create a basic user object
        const basicUser = {
          id: authUser.id,
          email,
          username: email.split("@")[0], // Default username from email
          created_at: new Date(),
          last_login: new Date(),
        };

        // Try to create the user record
        try {
          const { error: insertError } = await supabase
            .from("users")
            .insert([basicUser]);
          if (insertError) {
            console.error("Error creating user record:", insertError);
          } else {
            console.log("Created new user record in users table");
          }
        } catch (insertError) {
          console.error("Exception creating user record:", insertError);
        }

        setUser(basicUser);
        return basicUser;
      }

      console.log("User data retrieved successfully:", userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
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
          username, // Include the username
          created_at: new Date(),
        };

        console.log("Attempting to create user record:", newUser);

        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert([newUser])
          .select()
          .single();

        console.log("User record creation result:", { userData, userError });

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
        username, // Include the username
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
