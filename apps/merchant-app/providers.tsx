"use client"
import { RecoilRoot } from "recoil";
// import { SessionProvider } from "next-auth/react";

export const Providers = ({children}: {children: React.ReactNode}) => {
    console.log("We are in the providers")
    return (
        <RecoilRoot>
            {children}
        </RecoilRoot>
    )
}