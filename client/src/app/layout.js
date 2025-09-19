import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers";
import { Toaster } from "sonner";
import { Suspense } from "react";
import Loading from "./loading";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata = {
  title: "Sweet Delights - Premium Sweet Shop",
  description: "Discover our premium collection of sweets, chocolates, and confections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} antialiased`}
        style={{ fontFamily: 'var(--font-plus-jakarta-sans), var(--font-geist-sans), sans-serif' }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            <SessionProvider>
              {children}
              <Toaster
                position="top-center"
                richColors
              // closeButton
              />
            </SessionProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}