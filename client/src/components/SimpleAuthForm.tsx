import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function SimpleAuthForm() {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState("signin");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Logging in with:", { email: loginEmail });
      await login(loginEmail, loginPassword);
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      alert(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Signing up with:", { email: signupEmail, name: signupName });
      await signup(signupEmail, signupPassword, signupName);
      console.log("Signup successful");
      alert("Account created successfully!");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="tabs">
        <div
          className={`tab ${activeTab === "signin" ? "active" : ""}`}
          onClick={() => setActiveTab("signin")}
        >
          Sign In
        </div>
        <div
          className={`tab ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </div>
      </div>

      {activeTab === "signin" ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signupConfirmPassword}
            onChange={(e) => setSignupConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
      )}

      <style jsx>{`
        .auth-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .tabs {
          display: flex;
          margin-bottom: 20px;
        }

        .tab {
          flex: 1;
          text-align: center;
          padding: 10px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          border-bottom: 2px solid #6b46c1;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: rgba(0, 0, 0, 0.2);
          color: white;
        }

        button {
          padding: 10px;
          background-color: #6b46c1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
