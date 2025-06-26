"use server";
import "server-only";
import Link from "next/link";
import Logo from "../elements/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignoutButton from "@/components/elements/SignoutButton";
import NavItems from "../elements/NavItems";

const navItems = [
  "Dashboard",
  "Records",
  "Accounts",
  "Analysis",
  "Budget",
  "Investments",
];

export default async function Navbar() {
  //
  return (
    <nav className=" grid grid-cols-12 px-10 py-2">
      <div className="col-start-1 col-end-4">
        <Logo />
      </div>
      <div className="col-start-4 col-end-11  ">
        <NavItems navItems={navItems} />
      </div>
      <div className="col-start-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <Link href="/help">
              <DropdownMenuItem>Help</DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
            <SignoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
