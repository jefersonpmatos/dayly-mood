"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

import { authClient } from "@/lib/auth-client";
import { Calendar1, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Email must be a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

const loginSchema = z.object({
  email: z.string().email("Email must be a valid email address"),
  password: z.string().min(6),
});

type RegisterSchema = z.infer<typeof registerSchema>;
type LoginSchema = z.infer<typeof loginSchema>;

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const formRegister = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const formLogin = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const registerWithEmail = async ({
    name,
    email,
    password,
  }: RegisterSchema) => {
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging in. Please try again.",
      });
    }
  };

  const loginWithEmail = async ({ email, password }: LoginSchema) => {
    setIsLoading(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast({
        title: "An error occurred while logging in",
        description: "Please try again.",
      });
    }

    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
    });
    if (error) {
      toast({
        title: "An error occurred while logging in",
        description: "Please try again.",
      });
    }

    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
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

        {isRegistering && (
          <Form {...formRegister}>
            <form onSubmit={formRegister.handleSubmit(registerWithEmail)}>
              <FormField
                control={formRegister.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formRegister.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formRegister.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formRegister.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full mt-6" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Get started"
                )}
              </Button>
            </form>
          </Form>
        )}

        {!isRegistering && (
          <Form {...formLogin}>
            <form onSubmit={formLogin.handleSubmit(loginWithEmail)}>
              <FormField
                control={formLogin.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formLogin.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full mt-6" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center text-sm">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </div>

        <div className="relative flex items-center">
          <div className="absolute left-0 top-1/2 h-px w-full bg-border"></div>
          <div className="relative flex-grow text-center">
            <span className="bg-bg px-2 text-sm text-text">or</span>
          </div>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={loginWithGoogle}
          disabled={isLoading}
        >
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
