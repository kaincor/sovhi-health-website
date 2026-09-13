import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sovhi Health",
  description:
    "A clearer path to better health. Intelligence trained on your history rather than a population average, and guidance that adapts as you do.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
