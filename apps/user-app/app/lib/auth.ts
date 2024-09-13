import db from "@repo/db/client";
import CredenitalsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CredentialsType{
    phone: string;
    password: string;
}

interface CustomSession extends Session {
    user: {
        id: string;  // Add the `id` property
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export const authOptions = {
    providers: [
        CredenitalsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "1234567890" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: CredentialsType | undefined){
                if(!credentials){
                    console.error("No credentials provided.");
                    throw new Error("Missing credentials.");
                }

                try{
                    if(credentials.phone.length === 0 || credentials.password.length === 0){
                        return null;
                    }
                    const existingUser = await db.user.findFirst({
                        where: {
                            number: credentials.phone
                        }
                    });

                    if(existingUser){
                        const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
                        if(!isPasswordValid){
                            console.error(`Invalid passowrd for phone: ${credentials.phone}`);
                            throw new Error("Invalid password.");
                        }

                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            phone: existingUser.number
                        };
                    }

                    return null;
                } catch(error){
                    console.error("Error during authorization:", error);
                    throw new Error("Authorization failed. Please try again later.");
                }
            }
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: {token: JWT, session: CustomSession}){
            session.user!.id = token.sub!;

            return session;
        }
    }
}