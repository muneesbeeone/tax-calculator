import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
