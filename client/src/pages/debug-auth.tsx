import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function DebugAuthPage() {
  const { user, isLoading, login } = useAuth();
  const [apiStatus, setApiStatus] = useState<{ [key: string]: string }>({});
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Function to test authentication with different APIs
  const testApiAuthentication = async () => {
    setIsTestingApi(true);
    const apis = [
      "/api/user",
      "/api/tarot-readings",
      "/api/auth-test", // Add our new auth test endpoint
    ];

    const newStatus: { [key: string]: string } = {};

    for (const api of apis) {
      try {
        // Use apiRequest which handles credentials and headers properly
        const data = await apiRequest(api);
        console.log(`Data from ${api}:`, data);

        let statusText = "200 OK";

        // For our special auth-test endpoint, add more details
        if (api === "/api/auth-test" && data.status) {
          statusText += ` (${data.status})`;
        }

        newStatus[api] = statusText;
      } catch (err: any) {
        // If this is an HTTP error, try to extract the status code
        if (err?.message?.includes("HTTP error")) {
          const statusMatch = err.message.match(/(\d{3})/);
          if (statusMatch) {
            newStatus[api] = `${statusMatch[1]} Error`;
          } else {
            newStatus[api] = `Error: ${err?.message || "Unknown error"}`;
          }
        } else {
          newStatus[api] = `Error: ${err?.message || "Unknown error"}`;
        }
      }
    }

    setApiStatus(newStatus);
    setIsTestingApi(false);
  };

  // Test manual login
  const testDirectLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login("newuser", "password123");
    } catch (err: any) {
      console.error("Login error:", err?.message || "Unknown error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Get cookie info
  const getCookieInfo = () => {
    return document.cookie
      ? "Cookies present: " + document.cookie
      : "No cookies found";
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>
            Use this tool to diagnose authentication issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">
                Current Authentication Status
              </h3>
              {isLoading ? (
                <div className="flex items-center mt-2">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Checking authentication...</span>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    Status:
                    {user ? (
                      <Badge className="bg-green-500">Authenticated</Badge>
                    ) : (
                      <Badge variant="destructive">Not Authenticated</Badge>
                    )}
                  </div>
                  {user && (
                    <div className="mt-2">
                      <p>Username: {user.username}</p>
                      <p>Email: {user.email}</p>
                      <p>User ID: {user.id}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Cookie Information</h3>
              <pre className="mt-2 bg-card-muted p-2 rounded text-sm">
                {getCookieInfo()}
              </pre>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">API Authentication Tests</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <a
                    href="/api/direct-login-test"
                    className="text-blue-500 underline hover:text-blue-700"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/api/direct-login-test";
                    }}
                  >
                    Direct Login via Browser
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will perform a direct login and then return to this
                    page to test if cookies were set correctly.
                  </p>
                </div>

                <Button
                  onClick={testApiAuthentication}
                  disabled={isTestingApi}
                  variant="outline"
                >
                  {isTestingApi && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Test API Authentication
                </Button>

                {Object.keys(apiStatus).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium">Results:</h4>
                    <ul className="space-y-2 mt-2">
                      {Object.entries(apiStatus).map(([api, status]) => (
                        <li key={api} className="flex flex-col">
                          <span className="font-mono text-sm">{api}: </span>
                          <Badge
                            className={`w-fit mt-1 ${
                              status.startsWith("2")
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/auth")}
          >
            Go to Login Page
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/api/direct-login-test", "_blank")}
          >
            Try Server Direct Login
          </Button>
          <Button onClick={testDirectLogin} disabled={isLoggingIn}>
            {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Direct Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
