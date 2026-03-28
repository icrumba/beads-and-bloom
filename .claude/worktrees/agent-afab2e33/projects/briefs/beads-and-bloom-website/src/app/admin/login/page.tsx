"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/admin-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
            <Lock className="h-6 w-6 text-teal-600" />
          </div>
          <CardTitle className="text-xl text-stone-900">Admin Login</CardTitle>
          <CardDescription className="text-stone-500">
            Enter the admin password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-stone-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            {state?.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
