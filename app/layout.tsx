import "./globals.css";
import { Poppins, Raleway } from "next/font/google";
import { AuthProvider } from "./providers";

export const metadata = {
  title: "Justice",
  description: "Semantic search for lawyers",
};

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const ralewayFont = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-raleway",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppinsFont.variable} ${ralewayFont.variable} font-poppins`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}