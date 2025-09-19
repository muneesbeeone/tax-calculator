import Head from "next/head";
import Link from "next/link";

export default function LearnPage() {
  return (
    <>
      <Head>
        <title>Learn Taxes | Guides, FAQs & Official Links</title>
        <meta name="description" content="Understand Indian income tax basics: regimes, 87A rebate, surcharge, filing steps, and official resources." />
        <meta name="keywords" content="learn income tax India, Indian tax guides, old vs new regime India, Section 87A India, surcharge rates India, ITR filing steps India, AY 2026-27, FY 2025 taxes" />
        <link rel="canonical" href="https://taxcalculator.munees.co.in/learn" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4391323106927085"
          crossorigin="anonymous"
        ></script>
      </Head>
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Learn Taxes</h1>
        <p className="text-gray-700 mb-6">
          Learn the basics of Indian Income Tax for FY 2025 — new vs old regime, Section 87A rebate, surcharge, cess, and filing steps. When you’re ready, <Link href="/calculator" className="underline text-blue-700">use the calculator</Link>.
        </p>

        <div className="space-y-8">
          <article className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">New vs Old Regime (quick reference)</h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>New regime: 0–3L 0%, 3–7L 5%, 7–10L 10%, &gt;10L 15%. 87A rebate up to 7L for residents.</li>
              <li>Old regime: Basic exemption depends on age (2.5L/3L/5L), then 5%/20%/30%. 87A rebate up to 5L for residents.</li>
              <li>Many deductions not available in new regime; standard deduction may apply.</li>
            </ul>
          </article>
          <div className="mt-6 flex justify-center">
            <AdSense
              slot="9783500294"
              className="max-w-728px w-full"
              adType="banner"
            />
          </div>
          <article className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Filing checklist</h2>
            <ol className="list-decimal pl-5 text-gray-700 text-sm space-y-1">
              <li>Verify PAN and link with Aadhaar if required.</li>
              <li>Check AIS/TIS and Form 26AS.</li>
              <li>Estimate tax; pay advance or self‑assessment tax.</li>
              <li>Choose the right ITR form and file before the due date.</li>
              <li>e‑Verify the return and keep proofs.</li>
            </ol>
          </article>

          <article className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Special rates</h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>STCG u/s 111A: 15%</li>
              <li>LTCG u/s 112A: 10% after ₹1,00,000 exemption</li>
              <li>Lottery/Winnings: 30%</li>
            </ul>
          </article>

          <article className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Official resources</h2>
            <ul className="list-disc pl-5 text-blue-800 text-sm space-y-1">
              <li><a className="underline" target="_blank" rel="noreferrer" href="https://eportal.incometax.gov.in/iec/foservices/#/TaxCalc/calculator">Official Income Tax Calculator</a></li>
              <li><a className="underline" target="_blank" rel="noreferrer" href="https://incometaxindia.gov.in/pages/tools/tax-calculator.aspx">CBDT Tax Tools & Calculators</a></li>
              <li><a className="underline" target="_blank" rel="noreferrer" href="https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1">AY Guidance & Help</a></li>
              <li><a className="underline" target="_blank" rel="noreferrer" href="https://www.incometax.gov.in/iec/foportal/help/ais">AIS/TIS Help</a></li>
              <li><a className="underline" target="_blank" rel="noreferrer" href="https://eportal.incometax.gov.in/iec/foservices/#/e-pay-tax-prelogin/user-details">e‑Pay Tax</a></li>
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}


