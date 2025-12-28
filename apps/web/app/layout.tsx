import "./globals.css";
import "@repo/ui/styles.css";
import Wrapper from "@repo/ui/Wrapper";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "BlitzQ",
  description: "Enter any topic and get instant, personalized quizzes to enhance your learning. Receive detailed analytics and curated resources to fill knowledge gaps.",
  openGraph: {
    title: "BlitzQ",
    siteName: "BlitzQ",
    url: "https://blitzq.site/",
    description:
      "Enter any topic and get instant, personalized quizzes to enhance your learning. Receive detailed analytics and curated resources to fill knowledge gaps.",
    type: "website",
    images: [
      {
        url: "https://blitzq.site/BlitzQ.png",
        width: 1200,
        height: 630,
        alt: "BlitzQ Cover Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlitzQ",
    description:
      "Enter any topic and get instant, personalized quizzes to enhance your learning. Receive detailed analytics and curated resources to fill knowledge gaps.",
    images: ["https://blitzq.site/BlitzQ.png"],
    creator: "@VyankateshD206"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Wrapper>
          {children}
        </Wrapper>
        <Analytics />
      </body>
    </html>
  );
}
