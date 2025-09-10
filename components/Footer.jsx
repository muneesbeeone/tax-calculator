export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
      <div className="container mx-auto px-4 py-6 text-sm text-slate-600 flex items-center justify-between">
        <p>
          © {new Date().getFullYear()} Tax Calculator. All rights reserved.
        </p>
        <p className="hidden sm:block">Built with Next.js and Tailwind CSS</p>
      </div>
    </footer>
  );
}


