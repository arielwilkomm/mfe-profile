import { ReactNode } from "react";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MFE Profile",
  description: "Micro front-end de profile",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt_BR">
      <head />
      <body className="bg-gray-100 min-h-screen text-black">
        {children}
      </body>
    </html>
  );
}