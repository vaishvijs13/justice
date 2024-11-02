import NextAuth from 'next-auth/next'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from '@/app/lib/mongodb';
import User from '@/app/models/user';
import bcrypt from 'bcryptjs';

const options = {
    providers: [
        CredentialsProvider({
          name: "credentials",
          credentials: {},
          async authorize(credentials) {
            const { email, password } = credentials;
            try {
              await connectMongoDB();
                const user = await User.findOne({ email });

                if (!user) {
                  return null;
                }

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                  return null;
                }

                return user;
            }
            catch (error) {
              console.log("Error: ", error);
            }
          },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
};

const handler = NextAuth(options);
export { handler as GET, handler as POST };