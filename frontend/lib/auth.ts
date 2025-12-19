import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string;
};

/**
 * Fetches the current authenticated user based on the Supabase session.
 * Redirects to the login page if there is no valid session.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  console.log("[requireUser] Fetching authenticated user");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("[requireUser] Error fetching user:", {
      error,
      errorCode: error.message,
      errorDetails: error,
    });
    redirect("/auth/login");
  }

  if (!data.user) {
    console.log("[requireUser] No user in session data, redirecting to login");
    redirect("/auth/login");
  }

  const user: AuthenticatedUser = {
    id: data.user.id,
    email: data.user.email ?? "",
  };

  console.log("[requireUser] User authenticated:", {
    userId: user.id,
    userEmail: user.email,
  });

  return user;
}


