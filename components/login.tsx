"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

import { authClient } from "@/lib/auth-client";
import { Calendar1, Loader2 } from "lucide-react";
import { useState } from "react";

export function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
    });

    if (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging in. Please try again.",
      });

      console.log("Error login google:", error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <Calendar1 />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Login to start track your days
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border" />

        <Button onClick={loginWithGoogle} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Continue with Google"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
