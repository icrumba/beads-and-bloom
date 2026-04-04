"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

type Mode = "login" | "signup";

export function AuthModal() {
  const [mode, setMode] = useState<Mode>("login");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up actual auth
    setOpen(false);
  }

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    setEmail("");
    setPassword("");
    setName("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="inline-flex items-center justify-center rounded-lg p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <User className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl">
        {/* Header with gradient */}
        <div className="gradient-hero px-6 pt-8 pb-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {mode === "login" ? "Welcome back" : "Join Beads & Bloom"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to track orders and save favorites"
                : "Create an account for faster checkout"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" className={labelClass}>
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className={labelClass}>
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="auth-password" className={labelClass}>
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl text-sm font-semibold"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Guest checkout note */}
          <p className="text-center text-xs text-muted-foreground">
            No account needed to shop! You can always check out as a guest.
          </p>

          {/* Switch mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-foreground underline underline-offset-2 transition-colors hover:text-primary"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
