"use client"

import { useState, useEffect } from "react"
import { WebGLBackground } from "@/components/WebGLBackground"
import { LoginModal } from "@/components/LoginModal"
import { Dashboard } from "@/components/Dashboard"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { toast, Toaster } from "sonner"
import { Loader2 } from "lucide-react"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserEmail(session.user.email || "")
        setIsAuthenticated(true)
        
        // Show welcome message
        const isNewUser = session.user.created_at === session.user.last_sign_in_at
        toast.success(isNewUser ? 'Welcome to Bharat Authentication!' : 'Welcome back!', {
          description: `Logged in as ${session.user.email}`,
          duration: 3000,
        })
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setUserEmail("")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserEmail(session.user.email || "")
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Error checking user session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Logout failed', {
          description: error.message
        })
      } else {
        setIsAuthenticated(false)
        setUserEmail("")
        toast.success('Logged out successfully')
      }
    } catch (error) {
      toast.error('Logout failed', {
        description: 'An unexpected error occurred'
      })
    }
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard userEmail={userEmail} onLogout={handleLogout} />
  }

  // Otherwise show landing page with WebGL background
  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="relative w-screen h-screen overflow-hidden">
      {/* WebGL Shader Background */}
      <WebGLBackground />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Bar with Login Button */}
        <header className="flex items-center justify-end p-6">
          <Button 
            onClick={() => setLoginModalOpen(true)}
            size="lg"
            className="bg-white/90 text-black hover:bg-white backdrop-blur-sm shadow-lg font-semibold"
          >
            Login
          </Button>
        </header>

        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight drop-shadow-2xl">
                Bharat Authentication
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-lg">
                Secure, Fast, and Reliable Access Platform
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-4">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
              <p className="text-green-400 font-medium">System Active</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="p-6 text-center">
          <p className="text-white/70 text-sm">
            Protected by advanced encryption technology
          </p>
        </footer>
      </div>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        onLogin={handleLogin}
      />
      </div>
    </>
  )
}

export default App
