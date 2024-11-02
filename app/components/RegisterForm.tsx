"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("Please fill in all of the fields!");
            return;
        }

        try {
            const resUserExists = await fetch('api/userExists', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const {user} = await resUserExists.json();

            if (user) {
                setError("User already exists");
                return;
            }

            const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                }),
            });
            if (res.ok) {
                const form = e.target;
                form.reset();
                router.push("/");
            }
            else {
                console.log("User registration failed.");
            }
        } catch (error) {
            console.log("Error during registration: ", error);
        }
    };

    return (
        <div className="h-screen grid place-items-center">
            <div className="shadow-lg p-12 rounded-lg border-t-4 bg-white">

                <h1 className="text-xl font-bold mb-8">Create Your Account</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input onChange={e => setName(e.target.value)} type="text" placeholder="Full Name" />
                    <input onChange={e => setEmail(e.target.value)} type="text" placeholder="Email" />
                    <input onChange={e => setPassword(e.target.value)} type="text" placeholder="Password" />

                    <button className="bg-slate-800 px-6 py-2 cursor-pointer text-white">Register</button>

                    {error && (
                    <div className="text-sm text-red-800 w-fit mt-2 font-bold">
                        {error}</div>
                    )}
                    <Link href={"/"} className="text-sm text-right">Already have an account? <span className="underline">Login</span>
                    </Link>
                </form>
            </div>
        </div>

    )
}