import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import PoweredByAviato from "@/components/PoweredByAviato";

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Pathway — See where your first job can take you",
  description: "Explore career exits from Bain & Company. Visualize where consultants go after consulting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ibmPlexMono.className}>
        {children}
        <PoweredByAviato />
      </body>
    </html>
  );
}

