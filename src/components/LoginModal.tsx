"use client"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Login1 } from "@/components/ui/login-1"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (email: string) => void
}

export function LoginModal({ open, onOpenChange, onLogin }: LoginModalProps) {
  const handleLogin = (email: string) => {
    onLogin(email);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-full p-0 border-0 bg-transparent shadow-none max-w-7xl">
        <Login1 onLogin={handleLogin} />
      </DialogContent>
    </Dialog>
  )
}
