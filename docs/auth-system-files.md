# Authentication System Files

This document contains the key files for the authentication system in the MysticArcana application.

## 1. client/src/hooks/use-auth.tsx

```tsx
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
```

  const signup = async (email: string, password: string, username: string) => {
    console.log("signup function called with:", {
      email,
      username,
      passwordLength: password?.length,
    });
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

      console.log("Making Supabase auth.signUp call...");
      // Sign up the user with Supabase Auth
      const signUpResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      console.log("Supabase signUp response:", {
        success: !!signUpResponse.data?.user,
        error: signUpResponse.error ? signUpResponse.error.message : null,
      });

      const {
        data: { user },
        error,
      } = signUpResponse;

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

## 2. client/src/pages/auth-page.tsx

```tsx
import AuthForm from "@/components/ui/auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Redirect, useLocation } from "wouter";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  // Get the tab from URL query parameters
  const params = new URLSearchParams(location.split("?")[1] || "");
  const tabParam = params.get("tab");
  // Force the default tab to be "login" if not specified or invalid
  const defaultTab = tabParam === "register" ? "register" : "login";

  // Log the tab parameter for debugging
  console.log("Tab parameter:", tabParam, "Default tab:", defaultTab);

  // Force the active tab to match the URL parameter immediately
  if (activeTab !== defaultTab) {
    setActiveTab(defaultTab);
  }

  // Set the active tab based on the URL parameter
  useEffect(() => {
    setActiveTab(defaultTab);
    console.log("Auth page loaded with tab:", defaultTab);

    // Additional logging for debugging
    console.log("Auth page: checking if user is already authenticated");
  }, [defaultTab]);

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Redirect to="/" />;
  }

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row bg-dark"
      style={{
        backgroundImage: `
             radial-gradient(circle at 10% 20%, rgba(74, 33, 116, 0.2) 0%, rgba(26, 26, 74, 0.1) 80%),
             url('https://images.unsplash.com/photo-1518818608552-195ed130cda4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')
           `,
        backgroundBlendMode: "overlay",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      {/* Auth Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary border border-accent flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-accent"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
              </div>
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2 text-accent bg-gradient-to-r from-[#D4AF37] to-[#F5E1A4] bg-clip-text text-transparent">
              Mystic Arcana
            </h1>
            <p className="text-light/80">Discover your cosmic destiny</p>
          </div>

          <div className="bg-gradient-to-b from-primary/40 to-secondary/40 backdrop-blur-md rounded-xl border border-accent/30 p-6">
            <Tabs
              value={activeTab}
              defaultValue={defaultTab}
              className="w-full"
              onValueChange={(value) => {
                console.log("Tab changed to:", value);
                setActiveTab(value);
                // Update URL to reflect tab change without page reload
                window.history.replaceState(null, "", `/auth?tab=${value}`);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <AuthForm type="login" />
              </TabsContent>

              <TabsContent value="register">
                <AuthForm type="register" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-primary/70 to-secondary/70 backdrop-blur-md p-12 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-dark/30 border-2 border-accent flex items-center justify-center">
              <div className="text-accent text-4xl rotate-12 transform transition-transform animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12"
                >
                  <path d="M12 22v-9" />
                  <path d="m15.4 10.7 1.1-11.3 1.3 3.2 2.7-2.1-.7 4.7 2.9 1.8-2.1 2 2.2 3-4.6-.3-.6 4-2.6-2-2.6 2-.6-4-4.6.3 2.2-3-2.1-2 2.9-1.8-.7-4.7 2.7 2.1 1.3-3.2 1.1 11.3" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="font-heading text-4xl font-bold mb-4 text-light">
            Begin Your Mystical Journey
          </h2>

          <p className="text-light/90 mb-6">
            Unlock the ancient secrets of tarot and astrology with Mystic
            Arcana. Discover personalized insights through AI-powered readings,
            celestial charts, and mystical guidance.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-dark/20 backdrop-blur-sm rounded-lg p-4 border border-light/10">
              <div className="text-accent text-xl mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 mx-auto mb-2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16 10-4 4-4-4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-light mb-1">
                Tarot Readings
              </h3>
              <p className="text-light/70 text-sm">
                Interactive card spreads with deep insights
              </p>
            </div>

            <div className="bg-dark/20 backdrop-blur-sm rounded-lg p-4 border border-light/10">
              <div className="text-accent text-xl mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 mx-auto mb-2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-light mb-1">
                Astrology Charts
              </h3>
              <p className="text-light/70 text-sm">
                Personalized celestial forecasts
              </p>
            </div>
          </div>

          <div className="text-accent/80 text-sm italic">
            "The cosmos holds answers to questions you haven't even thought to
            ask."
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 3. client/src/components/ui/auth-form.tsx

```tsx
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";
import { Input } from "./input";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema
  .extend({
    username: z.string().min(3, "Username must be at least 3 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const { login, signup } = useAuth();
  console.log("Auth functions available:", {
    login: !!login,
    signup: !!signup,
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(type);

  // Update active tab when type prop changes
  useEffect(() => {
    setActiveTab(type);
    console.log("Auth form type changed to:", type);
  }, [type]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Log form state changes for debugging
  useEffect(() => {
    console.log("Register form state:", {
      isDirty: registerForm.formState.isDirty,
      isValid: registerForm.formState.isValid,
      errors: registerForm.formState.errors,
    });
  }, [registerForm.formState]);

  const onLoginSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      console.log("Attempting to login with:", { email: data.email });

      // Attempt to login
      const user = await login(data.email, data.password);
      console.log("Login successful, user data:", user);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      // Add a small delay to ensure the toast is shown before redirect
      setTimeout(() => {
        // Redirect to home page after successful login
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      console.log("Registering with:", {
        email: data.email,
        username: data.username,
      });

      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Attempt to sign up
      console.log("Calling signup function with:", {
        email: data.email,
        password: "[REDACTED]",
        username: data.username,
      });
      const user = await signup(data.email, data.password, data.username);
      console.log("Signup result:", user);
      console.log("Registration successful, user data:", user);

      toast({
        title: "Success",
        description: "Registered successfully",
      });

      // Add a small delay to ensure the toast is shown before redirect
      setTimeout(() => {
        // Redirect to home page after successful registration
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to register",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {type === "login" ? (
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
          <div className="space-y-4">
            <Input
              {...loginForm.register("email")}
              type="email"
              placeholder="Email"
              error={loginForm.formState.errors.email?.message}
            />
            <Input
              {...loginForm.register("password")}
              type="password"
              placeholder="Password"
              error={loginForm.formState.errors.password?.message}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Register form submitted");
            const formData = registerForm.getValues();
            console.log("Form data on submit:", formData);
            registerForm.handleSubmit(onRegisterSubmit)(e);
          }}
        >
          <div className="space-y-4">
            <Input
              {...registerForm.register("username")}
              placeholder="Username"
              error={registerForm.formState.errors.username?.message}
            />
            <Input
              {...registerForm.register("email")}
              type="email"
              placeholder="Email"
              error={registerForm.formState.errors.email?.message}
            />
            <Input
              {...registerForm.register("password")}
              type="password"
              placeholder="Password"
              error={registerForm.formState.errors.password?.message}
            />
            <Input
              {...registerForm.register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              error={registerForm.formState.errors.confirmPassword?.message}
            />
            <Button
              type="button"
              className="w-full"
              disabled={isLoading}
              onClick={() => {
                console.log("Register button clicked");
                const formData = registerForm.getValues();
                console.log("Form data:", formData);
                // Validate the form
                registerForm.trigger().then((isValid) => {
                  console.log("Form validation result:", isValid);
                  if (isValid) {
                    console.log("Form is valid, submitting");
                    onRegisterSubmit(formData);
                  } else {
                    console.log(
                      "Form is invalid, errors:",
                      registerForm.formState.errors
                    );
                  }
                });
              }}
            >
              {isLoading ? "Loading..." : "Register"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

## 4. server/auth.ts

```typescript
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

declare global {
  namespace Express {
    // Define the User interface for the session
    interface User {
      id: number;
      username: string;
      email: string;
      birthDate?: Date | null;
      birthTime?: string | null;
      birthLocation?: string | null;
      subscriptionLevel: string;
      profileImage?: string | null;
      createdAt: Date;
      password?: string; // Include but mark as optional
    }
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const isProduction = process.env.NODE_ENV === "production";

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "mystic-arcana-secret",
    resave: true,
    saveUninitialized: true,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      // Replit requires these specific cookie settings
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    }
  };

  // Trust proxy required for cookies to work properly in Replit environment
  app.set('trust proxy', 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log("DEBUG - deserializeUser - looking up user with ID:", id);
      if (id === 999) {
        // Special case for our directly injected test user
        console.log("DEBUG - deserializeUser - returning test user");
        return done(null, {
          id: 999,
          username: "newuser",
          email: "newuser@example.com",
          birthDate: null,
          createdAt: new Date(),
          profileImage: null,
          subscriptionLevel: "basic",
          password: "" // Empty password but still included in the object
        });
      }

      console.log("DEBUG - deserializeUser - checking storage");
      const user = await storage.getUser(id);
      console.log("DEBUG - deserializeUser - user from storage:", user ? "Found user" : "User not found");

      if (!user) {
        console.log("DEBUG - deserializeUser - user not found");
        // Instead of throwing error, just return false to indicate no user found
        // This allows the app to continue working for unauthenticated requests
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      console.error("DEBUG - deserializeUser - error:", error);
      // Don't crash the app, just indicate auth failed
      done(null, false);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);

      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        subscriptionLevel: "free" // Default subscription level
      });

      req.login(user, (err) => {
        if (err) return next(err);

        // Exclude password from the response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Authentication failed" });

      req.login(user, (err) => {
        if (err) return next(err);

        // Exclude password from the response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Exclude password from the response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Add /api/auth/me endpoint
  app.get("/api/auth/me", (req, res) => {
    console.log("Getting auth status, isAuthenticated:", req.isAuthenticated());

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Exclude password from the response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

## 5. netlify/functions/auth.ts

```typescript
// Import types for Netlify functions
type NetlifyEvent = {
  httpMethod: string;
  path: string;
  headers: Record<string, string>;
  body?: string;
};

type NetlifyContext = {
  clientContext: any;
};

type Handler = (
  event: NetlifyEvent,
  context: NetlifyContext
) => Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}>;

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const path = event.path.replace("/.netlify/functions/auth/", "");
    // Parse body if needed for other endpoints
    // const body = JSON.parse(event.body || "{}");

    switch (path) {
      case "me":
        // Get current user
        // Extract the auth token from the Authorization header
        const authHeader =
          event.headers.authorization || event.headers.Authorization;
        if (!authHeader) {
          return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Unauthorized - No auth header" }),
          };
        }

        // The header format should be "Bearer <token>"
        const token = authHeader.replace("Bearer ", "");

        try {
          // Get user from the token
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser(token);

          if (error || !user) {
            return {
              statusCode: 401,
              headers: corsHeaders,
              body: JSON.stringify({ error: "Unauthorized - Invalid token" }),
            };
          }

          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(user),
          };
        } catch (authError) {
          console.error("Auth error:", authError);
          return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Unauthorized - Auth error" }),
          };
        }

      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Not found" }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
```

## Conclusion

This document contains the key files for the authentication system in the MysticArcana application. The system uses:

1. **Supabase Authentication** on the client side (in the React application)
2. **Passport.js with Local Strategy** on the server side (for the Express API)
3. **Netlify Functions** for serverless authentication endpoints

The authentication flow works as follows:

1. Users can sign up or log in through the auth-form.tsx component
2. The use-auth.tsx hook provides authentication context and methods throughout the application
3. The server/auth.ts file handles server-side authentication with Passport.js
4. The netlify/functions/auth.ts file provides serverless authentication endpoints

This dual approach allows the application to work in both development and production environments, with appropriate security measures in place.
