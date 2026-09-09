import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/SoundProvider";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "YUKI — big dream small dih",
  description:
    "Omar Abdelhamed aka YUKI — The Fool's portfolio. Power grids, graphic design, video editing, and vibe coding.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
