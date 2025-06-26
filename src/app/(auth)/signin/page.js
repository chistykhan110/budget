"use server";
import Center from "@/components/elements/Center";
import Logo from "@/components/elements/Logo";
import SignoutButton from "@/components/elements/SignoutButton";
import SigninForm from "@/components/forms/SigninForm";

export default async function page({ params, searchParams }) {
  return (
    <>
      <Center>
        <div className="w-96" >
          <div className="text-center" >
            <Logo />
          </div>
          <SigninForm />
        </div>
      </Center>
    </>
  );
}
