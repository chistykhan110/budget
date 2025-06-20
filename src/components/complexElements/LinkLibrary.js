"use server";
import Link from "next/link";
const links = [
  "/reset-password",
  "/signin",
  "/signup",
  "/about-us",
  "/privacy-policy",
  "/accounts",
  "/analysis",
  "/budget",
  "/dashboard",
  "/investments",
  "/records",
];
export default async function LinkLibrary({ params, searchParams }) {
  return (
    <>
      <ul>
        {links.map((ele, ind) => {
          return (
            <Link key={ind} href={`${ele}`}>
              <li>{`${ele}`}</li>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
