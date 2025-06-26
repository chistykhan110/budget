import Link from "next/link";
export default function Logo() {
  return (
    <Link href="/">
      <div className="text-2xl font-bold inline-flex items-baseline gap-1 whitespace-nowrap">
        <div>BUDGET</div>
        <sup className="text-muted-foreground font-light">plan</sup>
        <sub className="text-muted-foreground font-medium">wisely</sub>
      </div>
    </Link>
  );
}
