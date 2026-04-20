import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "عقل اصطناعي | توليد الفيديوهات بالذكاء الاصطناعي",
  description:
    "حوّل نصوصك إلى فيديوهات عربية واقعية في ثوانٍ باستخدام أحدث نماذج الذكاء الاصطناعي.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <body
          className={`${tajawal.className} bg-deep-space text-white antialiased overflow-x-hidden`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
