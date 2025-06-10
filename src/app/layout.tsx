import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MFE Profile",
  description: "Micro front-end de profile",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt_BR">
      <head />
      <body className="bg-white text-black">
        {children}
      </body>
    </html>
  );
}