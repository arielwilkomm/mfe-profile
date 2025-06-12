import { ReactNode } from "react";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <head />
      <body className="bg-gray-100 min-h-screen text-black">
        {children}
      </body>
    </html>
  );
}
