import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { registerSchema } from "@/helper/server-side-validator/validator.js";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        let user = null;
        
        return user;
      },
    }),
  ],
});
