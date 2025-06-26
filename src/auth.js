import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = credentials; 
        if (!user) return null;
        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token._id = user._id;
      }
      if (trigger === "update" && session) {
        token.email = session.email;
        token.name = session.name;
        token.image = session.image;
        token._id = session._id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user._id = token._id;
      }
      return session;
    },
  },
});
