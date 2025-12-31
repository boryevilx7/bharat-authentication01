import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";

interface Login1Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
  onLogin?: (email: string) => void;
}

const Login1 = ({
  heading = "Login",
  logo = {
    url: "#",
    src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=80&fit=crop",
    alt: "Bharat Authentication",
    title: "Bharat Authentication",
  },
  buttonText = "Login",
  googleText = "Sign up with Google",
  signupText = "Don't have an account?",
  signupUrl = "#",
  onLogin,
}: Login1Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
  
    setIsLoading(true);
    try {
      if (isSignupMode) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
      
        if (error) {
          console.error('Signup error:', error);
          toast.error("Signup failed", {
            description: error.message || "Unable to create account. Please try again.",
            duration: 5000,
          });
        } else if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            toast.warning("Account already exists", {
              description: "This email is already registered. Please login instead.",
              duration: 5000,
            });
            setIsSignupMode(false);
          } else {
            toast.success("Account created!", {
              description: data.user.confirmed_at 
                ? "You can now login with your credentials." 
                : "Please check your email to confirm your account.",
              duration: 5000,
            });
            // Switch to login mode
            setIsSignupMode(false);
          }
        }
      } else {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (error) {
          toast.error("Login failed", {
            description: error.message,
          });
        } else if (data.user) {
          toast.success("Login successful!", {
            description: `Welcome back, ${data.user.email}`,
          });
          if (onLogin) {
            onLogin(data.user.email || email);
          }
        }
      }
    } catch (error) {
      toast.error(isSignupMode ? "Signup failed" : "Login failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    // Show initial toast
    toast.info("Redirecting to Google...", {
      description: "You'll be redirected to sign in with your Google account",
    });
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        toast.error("Google login failed", {
          description: error.message,
        });
        setIsGoogleLoading(false);
      }
      // If successful, user will be redirected to Google - don't set loading to false
    } catch (error) {
      toast.error("Google login failed", {
        description: "An unexpected error occurred",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="relative bg-white dark:bg-neutral-950 h-screen overflow-hidden">
      {/* Animated Background */}
      <BackgroundPaths />
      <div className="flex h-full items-center justify-center relative z-10">
        <div className="border-muted bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-2xl">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <a href={logo.url}>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {logo.title}
                </h1>
              </a>
            </div>
            {heading && <h1 className="text-3xl font-semibold">{isSignupMode ? "Create Account" : heading}</h1>}
            <p className="text-sm text-muted-foreground">
              {isSignupMode ? "Sign up to get started" : "Welcome back! Please login to continue"}
            </p>
          </div>
          <form onSubmit={handleEmailLogin} className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="mt-2 w-full"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignupMode ? "Creating account..." : "Logging in..."}
                    </>
                  ) : (
                    isSignupMode ? "Sign Up" : buttonText
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FcGoogle className="mr-2 size-5" />
                      {googleText}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{isSignupMode ? "Already have an account?" : signupText}</p>
            <button
              type="button"
              onClick={() => setIsSignupMode(!isSignupMode)}
              className="text-primary font-medium hover:underline"
              disabled={isLoading || isGoogleLoading}
            >
              {isSignupMode ? "Login" : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login1 };
