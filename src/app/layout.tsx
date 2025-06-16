"use client";

import { ReactNode } from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f3f4f6; /* bg-gray-100 */
    min-height: 100vh; /* min-h-screen */
    color: #000; /* text-black */
    margin: 0;
    font-family: inherit;
    max-width: 100vw;
    overflow-x: hidden;
  }
`;

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <head />
      <body>
        <GlobalStyle />
        {children}
      </body>
    </html>
  );
}
