"use server";
import { auth, signOut } from "@/auth";
import "server-only";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
export default async function signoutAction(previousState, formData) {
  try {
    const session = await auth();
    if (session) {
      await signOut({
        redirect: false,
      });
      redirect("/signin");
    }
    if (!session) {
      return true;
    }
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }
  }
}
