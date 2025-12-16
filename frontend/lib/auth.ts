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
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/auth/login");
  }

  return {
    id: data.user.id,
    email: data.user.email ?? "",
  };
}


