import './global.css'
import type { Metadata } from 'next'
import { Merriweather } from "next/font/google";
import { Montserrat } from 'next/font/google';
import cn from 'classnames';
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from './providers/themeProvider'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { ThemeSelector } from './components/ThemeSelector';

const merriweather = Merriweather({ weight: ["400", "700"], subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Next.js Portfolio Starter',
    template: '%s | Next.js Portfolio Starter',
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(merriweather.className, "dark:bg-slate-900 dark:text-slate-400")}
      suppressHydrationWarning
    >
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <ThemeProvider
          attribute="data-mode"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
        >
          <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
            <div className="absolute top-4 right-4">
              <ThemeSelector />
            </div>
            <Navbar />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
