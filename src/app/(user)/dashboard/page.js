"use server";
import SignoutButton from "@/components/elements/SignoutButton";
import "server-only";
export default async function page({ params, searchParams }) {
  return (
    <>
      <div> this is from page </div>
    </>
  );
}
