import { authClient } from "@/lib/auth-client"; // import the auth client

export function useSession() {
  const { data: session, isPending, error } = authClient.useSession();

  return {
    session,
    isPending,
    error,
  };
}
