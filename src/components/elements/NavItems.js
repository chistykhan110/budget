"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItems({ navItems }) {
  const pathname = usePathname();

  return (
    <ul className="flex gap-5 justify-around max-w-2xl overflow-hidden">
      {navItems.map((e, i) => {
        const href = `/${e.toLowerCase()}`;
        const isActive = pathname === href;

        return (
          <li key={`${e}${i}`}>
            <Link
              href={href}
              className={`hover:text-gray-900 ${
                isActive ? "text-black font-semibold" : "text-gray-500"
              }`}
            >
              {e}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
