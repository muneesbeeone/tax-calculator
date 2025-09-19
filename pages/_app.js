import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Script from "next/script";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* ✅ Load Google Ads script once */}
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4391323106927085"
        crossOrigin="anonymous"
      />

      <div
        className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 relative overflow-x-hidden`}
      >
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </>
  );
}
