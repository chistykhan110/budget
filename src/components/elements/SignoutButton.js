"use client";
import { Button } from "@/components/ui/button";
import signoutAction from "@/action/signout.action";
import { useActionState } from "react";
import Spinner from "@/components/elements/Spinner";
export default function SignoutButton() {
  const [state, action, isPending] = useActionState(signoutAction, false);
  return (
    <>
      <form action={action}>
        <Button variant='outline' disabled={isPending || state} className="w-full" type="submit">
          {isPending ? <Spinner /> : "Sign out"}
        </Button>
      </form>
    </>
  );
}
