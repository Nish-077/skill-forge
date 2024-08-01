import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Account, User as AuthUser } from 'next-auth';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import connect from '../../../../utils/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: { email: string; password: string } | undefined) {
        if (!credentials) {
          return null;
        }
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email }).lean();
          if (user && user.password) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return { id: user._id.toString(), email: user.email } as AuthUser;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser | typeof User; account: Account | null }) {
      if (account?.provider === "credentials") {
        return user ? true : false;
      }
      if (account?.provider === "github") {
        await connect();
        try {
          const existingUser = await User.findOne<typeof User>({ email: (user as AuthUser).email });
          if (!existingUser) {
            const newUser = new User({
              email: (user as AuthUser).email,
            });
            await newUser.save();
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
