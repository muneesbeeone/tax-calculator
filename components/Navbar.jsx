import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          Tax Calculator
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-slate-700 hover:text-slate-900 flex items-center gap-2" aria-label="Home">
            <span className="hidden sm:inline">Home</span>
            <svg className="sm:hidden h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 11l9-8 9 8"></path>
              <path d="M9 22V12h6v10"></path>
            </svg>
          </Link>
          <Link href="/calculator" className="text-slate-700 hover:text-slate-900 flex items-center gap-2" aria-label="Calculator">
            <span className="hidden sm:inline">Calculator</span>
            <svg className="sm:hidden h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="3" width="16" height="18" rx="2" ry="2"></rect>
              <line x1="8" y1="7" x2="16" y2="7"></line>
              <line x1="8" y1="11" x2="8" y2="11"></line>
              <line x1="12" y1="11" x2="12" y2="11"></line>
              <line x1="16" y1="11" x2="16" y2="11"></line>
              <line x1="8" y1="15" x2="8" y2="15"></line>
              <line x1="12" y1="15" x2="12" y2="15"></line>
              <line x1="16" y1="15" x2="16" y2="15"></line>
            </svg>
          </Link>
          <Link href="/learn" className="text-slate-700 hover:text-slate-900 flex items-center gap-2" aria-label="Learn">
            <span className="hidden sm:inline">Learn</span>
            <svg className="sm:hidden h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M4 4v15.5"></path>
              <path d="M6.5 17V4H20v13"></path>
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}


