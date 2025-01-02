"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import User from "../models/user";
import FileUpload from "../components/UploadFile";
import PreviousSessions from "../components/PreviousSessions";

export default function Landing() {
    const { data: session } = useSession();
    const sessions = [
        { id: 1, date: "2024-06-01", file: "report1.pdf" },
        { id: 2, date: "2024-06-15", file: "report2.pdf" },
        { id: 3, date: "2024-06-20", file: "summary.docx" },
      ];

    /*

    */

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