import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}


// Ensure required environment variables are set
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET");
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.readonly",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // Store access token
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Pass access token to session
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Export the handler for both GET and POST requests
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
