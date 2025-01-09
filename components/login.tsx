"use client";

import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";

export function Login() {
  const login = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };
  return <Button onClick={login}>Login with Google</Button>;
}
