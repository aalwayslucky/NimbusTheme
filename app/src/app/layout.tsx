import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "next-themes";
import ShadcnThemeEditor from "shadcn-theme-editor";
import ThemeEditor from "@/components/theme-editor";
import GithubCorner from "@/components/github-corner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadcn Theme Editor",
  description: "Shadcn Theme Editor is a user-friendly component designed to simplify the process of managing and customizing theme colors in Shadcn-based projects.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="customScrollBar">
      <body className={clsx("gradient_body", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="h-20">

          </header>
          <main className="w-full">
            <div className="w-full flex flex-col justify-between md:px-8 px-4 lg:px-12 min-h-screen max-w-[1700px] mx-auto">{children}</div>
            <ShadcnThemeEditor /> {/* for applying theme from localstorage */}
            <ThemeEditor />
          </main>
          <GithubCorner />
        </ThemeProvider>
      </body>
    </html>
  );
}
