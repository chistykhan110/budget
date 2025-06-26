"use server";
import Center from "@/components/elements/Center";
import Logo from "@/components/elements/Logo";

import SignupForm from "@/components/forms/SignupForm";
export default async function page({ params, searchParams }) {
  return (
    <>
      <Center>
        <div className="w-96">
          <div className="text-center">
            <Logo />
          </div>
          <SignupForm />
        </div>
      </Center>
    </>
  );
}
