"use client";

import Link from 'next/link';
import Image from "next/image";
import LoginForm from './components/LoginForm';

export default function Home() {
  return (
    <div className="flex flex-col bg-slate-300 min-h-screen">
      <div className="flex flex-col md:flex-row px-24 flex-grow">
        <div className="w-full md:w-3/4 text-left md:px-2">
          <h2 className="text-4xl md:text-9xl font-bold leading-tight mt-60 mb-10 text-black">Justice</h2>
          <h3 className="text-xl md:text-3xl font-thin leading-tight mb-12 text-black">Semantic search for depositions.</h3>
        </div>

        <div className="w-full flex justify-center md:justify-end px-20">
          <LoginForm />
        </div>
      </div>

      <footer className="w-full p-6 text-center text-black mb-12 md:mb-0">
        <p>© 2024 Justice. All rights reserved.</p>
      </footer>
    </div>
  );
}