import { NextResponse } from "next/server";
import { auth } from "@/auth";
// Paths
const userPath = [
  "/accounts",
  "/analysis",
  "/budget",
  "/dashboard",
  "/investments",
  "/records",
];
const authPath = ["/signin", "/signup", "/reset-password"];
const helpPath = ["/about-us", "/privacy-policy"];
// Utility class
class IsPath {
  constructor(authPath, helpPath, userPath) {
    this.authPath = authPath;
    this.helpPath = helpPath;
    this.userPath = userPath;
    this.allPath = [...this.authPath, ...this.helpPath, ...this.userPath];
  }

  auth(pathname) {
    return this.authPath.some((e) => pathname.startsWith(e));
  }
  help(pathname) {
    return this.helpPath.some((e) => pathname.startsWith(e));
  }
  user(pathname) {
    return this.userPath.some((e) => pathname.startsWith(e));
  }
  matcher() {
    return this.allPath.flatMap((path) => [path, `${path}/:path*`]);
  }
}
const isPath = new IsPath(authPath, helpPath, userPath);
//Middleware
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  //session check
  const session = await auth();
  //When there is session
  if (session) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } //
    if (isPath.auth(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } //
    //end of session
  }
  //When there is no session
  if (!session) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/signin", request.url));
    } //
    if (isPath.user(pathname)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    } //
    //end of no session
  }
  return NextResponse.next();
  //end of middleware function
}

//copy and pase
//console.log(isPath.matcher());
export const config = {
  matcher: [
    "/", // ITS A MUST
    "/signin",
    "/signin/:path*",
    "/signup",
    "/signup/:path*",
    "/reset-password",
    "/reset-password/:path*",
    "/about-us",
    "/about-us/:path*",
    "/privacy-policy",
    "/privacy-policy/:path*",
    "/accounts",
    "/accounts/:path*",
    "/analysis",
    "/analysis/:path*",
    "/budget",
    "/budget/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/investments",
    "/investments/:path*",
    "/records",
    "/records/:path*",
  ],
};
