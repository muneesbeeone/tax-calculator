import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Tax Mate. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/privacy-policy" 
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-conditions" 
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Terms & Conditions
            </Link>
            <p className="hidden sm:block text-slate-500">Built with Next.js</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            This calculator is for estimation purposes only. Always consult with a qualified tax professional or refer to official government sources for accurate tax calculations.
          </p>
        </div>
      </div>
    </footer>
  );
}


