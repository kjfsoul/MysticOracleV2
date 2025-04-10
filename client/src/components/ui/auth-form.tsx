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
  });

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

      // Redirect to home page after successful login
      window.location.href = "/";
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

      // Attempt to sign up
      const user = await signup(data.email, data.password, data.username);
      console.log("Registration successful, user data:", user);

      toast({
        title: "Success",
        description: "Registered successfully",
      });

      // Redirect to home page or login tab after successful registration
      window.location.href = "/auth?tab=login";
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
        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
