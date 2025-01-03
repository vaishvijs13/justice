"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import User from "../models/user";
import FileUpload from "../components/UploadFile";
import PreviousSessions from "../components/PreviousSessions";

interface Session {
    id: number;
    date: string;
    file: string;
}

export default function Landing() {
    const { data: session } = useSession();

    return (
        <section className="bg-slate-300 min-h-screen">
            <div className="text-white py-4 px-8 flex justify-between items-center">
            <h1 className="text-5xl leading-tight mt-10 text-center text-slate-800">Welcome, {session?.user?.name || "Guest"}!</h1>
                <button onClick={() => signOut()} className="mt-6 bg-slate-800 text-white p-3 w-fit text-sm text-black rounded-lg">Log out</button>
            </div>

            <div className="w-full flex ml-8 mt-12">
                <FileUpload />
            </div>
            <div className="p-8">
                <PreviousSessions />
            </div>
        </section>
        
    )
}