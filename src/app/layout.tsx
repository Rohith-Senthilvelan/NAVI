import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { fontVariables } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Navi — AI Financial Coach",
    template: "%s | Navi",
  },
  description:
    "AI-powered financial coach for individuals and SMEs in the UAE.",
  openGraph: {
    title: "Navi — Money that thinks for you.",
    description:
      "AI-powered financial coach for individuals and SMEs in the UAE.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${fontVariables} min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
