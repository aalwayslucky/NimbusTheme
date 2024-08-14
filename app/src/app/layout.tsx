import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "next-themes";
import ShadcnThemeEditor from "shadcn-theme-editor";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="customScrollBar">
      <body className={clsx("", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="h-20">

          </header>
          <main className="w-full">
            <div className="w-full flex flex-col justify-between md:px-8 px-4 lg:px-12 min-h-screen">{children}</div>
            <ShadcnThemeEditor />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
