import db from "@repo/db/client";
import CredenitalsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        CredenitalsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "1234567890" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any){
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const existingUser = await db.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });

                if(existingUser){
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if(passwordValidation){
                        return{
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            phone: existingUser.number
                        }
                    }
                    return null;
                }
                try{
                    const user = await db.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword
                        }
                    });

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        number: user.number
                    }
                } catch(error){
                    console.error(error);
                }

                return null;
            },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any){
            session.user.id = token.sub;

            return session;
        }
    }
}