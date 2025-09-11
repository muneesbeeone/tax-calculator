import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          Tax Calculator
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-slate-700 hover:text-slate-900">
            Home
          </Link>
          <Link href="/calculator" className="text-slate-700 hover:text-slate-900">
            Calculator
          </Link>
          <Link href="/learn" className="text-slate-700 hover:text-slate-900">
            Learn
          </Link>
        </nav>
      </div>
    </header>
  );
}


