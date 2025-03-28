import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { , LoginData, registerSchema, RegisterData } from "@/hooks/use-auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, User, Calendar } from "lucide-react";
import { z } from "zod";

interface AuthFormProps {
  type: "login" | "register";
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AuthForm({ type }: AuthFormProps) {
  const { loginMutation, registerMutation } = ();
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: undefined,
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        console.log("Login successful, redirecting to home page...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    });
  };

  const onRegisterSubmit = (data: RegisterData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        console.log("Registration successful, redirecting to home page...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    });
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;
  const form = type === "login" ? loginForm : registerForm;
  const onSubmit = type === "login" ? onLoginSubmit : onRegisterSubmit;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light/80">Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-light/60" />
                  <Input
                    type="text"
                    className="bg-dark/60 border-light/20 pl-10 text-light focus:border-accent/50"
                    placeholder="Enter your username"
                    disabled={isPending}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {type === "register" && (
          <>
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light/80">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-light/60" />
                      <Input
                        type="email"
                        className="bg-dark/60 border-light/20 pl-10 text-light focus:border-accent/50"
                        placeholder="Enter your email"
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light/80">Birth Date (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-light/60" />
                      <Input
                        type="date"
                        className="bg-dark/60 border-light/20 pl-10 text-light focus:border-accent/50"
                        placeholder="YYYY-MM-DD"
                        disabled={isPending}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light/80">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-light/60" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="bg-dark/60 border-light/20 pl-10 pr-10 text-light focus:border-accent/50"
                    placeholder="Enter your password"
                    disabled={isPending}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-light/60 hover:text-light"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {type === "register" && (
          <FormField
            control={registerForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light/80">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-light/60" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="bg-dark/60 border-light/20 pl-10 text-light focus:border-accent/50"
                      placeholder="Confirm your password"
                      disabled={isPending}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        )}

        {type === "login" && (
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-accent bg-dark border-light/30" 
              />
              <span className="text-light/70">Remember me</span>
            </label>
            <a href="#" className="text-accent hover:underline">Forgot password?</a>
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-6 bg-accent text-dark font-medium rounded-lg hover:bg-accent/90 transition-colors"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type === "login" ? "Signing in..." : "Creating account..."}
            </>
          ) : (
            <>{type === "login" ? "Sign In" : "Create Account"}</>
          )}
        </Button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-light/10"></div>
          <span className="flex-shrink mx-3 text-light/50 text-sm">or continue with</span>
          <div className="flex-grow border-t border-light/10"></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex justify-center items-center p-3 bg-dark/60 border border-light/20 rounded-lg hover:bg-dark/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-light">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex justify-center items-center p-3 bg-dark/60 border border-light/20 rounded-lg hover:bg-dark/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-light">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex justify-center items-center p-3 bg-dark/60 border border-light/20 rounded-lg hover:bg-dark/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-light">
              <path d="M16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2 0-.68.06-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z" />
            </svg>
          </Button>
        </div>
      </form>
    </Form>
  );
}
