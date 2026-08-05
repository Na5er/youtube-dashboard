import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "لوحة تحكم شبكة يوتيوب",
  description: "نظام إدارة أرباح وإحصائيات قنوات شبكة يوتيوب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        {/* React's RSC dev instrumentation can call performance.measure with a negative
            timestamp (clock skew, tab suspend/resume) and throw, crashing the whole page.
            Patch it before any Next.js code runs so that failure is swallowed instead. */}
        <Script id="patch-performance-measure" strategy="beforeInteractive">
          {`
            (function () {
              if (typeof window === "undefined" || !window.performance) return;
              var originalMeasure = window.performance.measure;
              if (typeof originalMeasure !== "function") return;
              window.performance.measure = function () {
                try {
                  return originalMeasure.apply(window.performance, arguments);
                } catch (e) {
                  return undefined;
                }
              };
            })();
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
