import Link from "next/link";
import Head from "next/head";
import AdSense from "@/components/AdSense";
import { useState } from "react";

function LatestTaxUpdates({ items }) {
  if (!items || !items.length) return <p className="text-gray-700">No recent updates available.</p>;
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="bg-white border border-slate-200 rounded-lg p-4">
          <a className="text-blue-700 underline font-medium" href={it.link} target="_blank" rel="noreferrer">{it.title}</a>
          {it.pubDate && <div className="text-xs text-gray-500 mt-1">{it.pubDate}</div>}
          {it.description && <p className="text-sm text-gray-700 mt-1 line-clamp-2">{it.description}</p>}
        </li>
      ))}
    </ul>
  );
}

function NewsModal({ items, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 w-11/12 max-w-2xl max-h-[80vh] overflow-auto bg-white border border-slate-200 rounded-xl shadow-xl">
        <div className="px-5 py-4 border-b border-slate-200 flex sticky top-0 bg-white items-center justify-between">
          <h3 className="text-lg font-semibold">Latest Tax Updates</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900">✕</button>
        </div>
        <div className="p-5">
          <LatestTaxUpdates items={items} />
        </div>
      </div>
    </div>
  );
}

export default function Home({ rssItems }) {
  const [newsOpen, setNewsOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Tax Mate | Indian Income Tax Calculator (FY 2025 New Regime) | Quick Estimate</title>
        <meta name="description" content="Estimate your Indian income tax for FY 2025 under the new regime. See slab-wise breakdown, toggle standard deduction and cess, and access official resources." />
        <meta name="keywords" content="income tax calculator India, Indian income tax, FY 2025 new regime, tax slabs India, calculate income tax India, old vs new regime, Section 87A rebate, surcharge India, 4% cess, standard deduction India, AY 2026-27" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Tax Mate | Indian Income Tax Calculator (FY 2025 New Regime)" />
        <meta property="og:description" content="Quick Indian income tax estimate with slab breakdown and official links." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://taxcalculator.munees.co.in/" />
        <meta property="og:image" content="https://taxcalculator.munees.co.in/og_home.png" />
        <link rel="canonical" href="https://taxcalculator.munees.co.in/" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Tax Mate | Indian Income Tax Calculator (FY 2025 New Regime) | Quick Estimate',
              url: 'https://taxcalculator.munees.co.in/',
              description: 'Free Indian income tax calculator for FY 2025 new regime with slab-wise breakdown, standard deduction and cess options.',
              publisher: {
                '@type': 'Organization',
                name: 'Tax Mate',
                url: 'https://taxcalculator.munees.co.in'
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://taxcalculator.munees.co.in/search?q={query}',
                'query-input': 'required name=query'
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Indian Income Tax Calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web Browser',
              description: 'Calculate Indian income tax for FY 2025 under the new regime with instant results and official verification.',
              url: 'https://taxcalculator.munees.co.in/calculator',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR'
              },
              featureList: [
                'FY 2025 New Regime Tax Slabs',
                'Standard Deduction Toggle',
                '4% Health & Education Cess',
                'Slab-wise Tax Breakdown',
                'Official Source Verification'
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is the new tax regime?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A concessional slab system with limited deductions/exemptions. You can compute tax as per slabs above and compare with the old regime if needed.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Is 4% cess always applicable?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, Health & Education Cess is generally 4% on the tax. This tool lets you include or exclude it for estimates.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Do all deductions apply in new regime?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Many traditional deductions are not available. Standard deduction may apply. Refer to official guidance for eligibility.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Where can I file my ITR?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Use the official e‑Filing portal to file returns and access services.'
                  }
                }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Tax Mate',
              url: 'https://taxcalculator.munees.co.in',
              logo: 'https://taxcalculator.munees.co.in/favicon.ico'
            })
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4391323106927085"
          crossorigin="anonymous"
        ></script>
      </Head>
      <section className="max-w-5xl mx-auto py-12 relative ">
        <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 opacity-30 blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 opacity-30 blur-2xl"></div>
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Simple Indian Tax Calculator (New Regime FY 2025)
          </h1>
          <p className="text-lg text-gray-700">
            Estimate your income tax instantly using FY 2025 new regime slabs. Toggle standard deduction and cess.
          </p>
          <p className="mt-4 text-gray-700">
            Use this free Indian Income Tax Calculator for FY 2025 (New Regime) to get a slab‑wise breakdown, check Section 87A rebate eligibility, include/exclude the ₹50,000 standard deduction and 4% Health & Education Cess, and compare with the old regime.{' '}
            <Link href="/calculator" className="underline text-blue-700">Calculate now</Link>{' '}or{' '}
            <Link href="/learn" className="underline text-blue-700">read tax guides</Link>.
          </p>
          <p className="mt-2 text-sm text-gray-600">Free, fast, and privacy‑friendly — no data stored.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -bottom-5">
          <div className="bg-white rounded-xl border border-slate-200 px-8 py-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Quick & Simple</h2>
            <p className="text-gray-600">Enter total income and deductions. Get slab tax, cess, and totals.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-8 py-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Up-to-date Slabs</h2>
            <p className="text-gray-600 mb-3">New regime (FY 2025)</p>
            <ul className="space-y-2">
              <li className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 px-4 py-2">
                <span className="text-gray-700">Up to ₹3,00,000</span>
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1">0%</span>
              </li>
              <li className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 px-4 py-2">
                <span className="text-gray-700">₹3,00,001 – ₹7,00,000</span>
                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1">5%</span>
              </li>
              <li className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 px-4 py-2">
                <span className="text-gray-700">₹7,00,001 – ₹10,00,000</span>
                <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1">10%</span>
              </li>
              <li className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 px-4 py-2">
                <span className="text-gray-700">Above ₹10,00,000</span>
                <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1">15%</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-8 py-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Transparent</h2>
            <p className="text-gray-600">See taxable income, standard deduction, and a clear breakdown.</p>
          </div>
        </div>

        {/* Ad Placement 1 - After Features */}
        <div className="mt-8 flex justify-center">
        <AdSense 
          slot="9876543210" 
          className="max-w-[728px] w-full"
          adType="banner"
        />
      </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl px-8 py-6">
            <h3 className="text-xl font-semibold mb-3">Tax Slab Summary (New Regime)</h3>
            <div className="mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-medium">
                ✓ Verified with official sources
              </span>
            </div>
            <ul className="text-blue-900 space-y-2 list-disc pl-5">
              <li>Up to ₹3,00,000: 0%</li>
              <li>₹3,00,001 – ₹7,00,000: 5%</li>
              <li>₹7,00,001 – ₹10,00,000: 10%</li>
              <li>Above ₹10,00,000: 15%</li>
            </ul>
            <p className="text-sm text-blue-900 mt-3">Note: 4% Health & Education Cess may apply. Surcharge not included.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-8 py-6">
            <h3 className="text-xl font-semibold mb-3">How it works</h3>
            <ol className="space-y-2 list-decimal pl-5 text-gray-700">
              <li>Enter Total Income and any Deductions.</li>
              <li>Optionally apply the ₹50,000 standard deduction and 4% cess.</li>
              <li>We compute taxable income and apply slabs progressively.</li>
              <li>Review the breakdown and adjust your inputs as needed.</li>
            </ol>
            <div className="mt-5">
              <Link href="/calculator" className="inline-flex items-center px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Open Calculator
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-sm text-gray-600">
          Reference: <a className="underline" target="_blank" rel="noreferrer" href="https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1">Income Tax e‑Filing portal (AY 2025‑26 guidance)</a>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Taxpayer Resources</h2>
            <button onClick={() => setNewsOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm">
              Latest Updates
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://eportal.incometax.gov.in/iec/foservices/#/TaxCalc/calculator"
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-base font-semibold">Official Tax Calculator</div>
              <div className="text-gray-600 text-sm">Compare with the government calculator</div>
            </a>
            <a
              href="https://www.incometax.gov.in/iec/foportal/"
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-base font-semibold">Income Tax Portal</div>
              <div className="text-gray-600 text-sm">Official e‑Filing portal home</div>
            </a>
            <a
              href="https://eportal.incometax.gov.in/iec/foservices/#/e-pay-tax-prelogin/user-details"
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-base font-semibold">e‑Pay Tax</div>
              <div className="text-gray-600 text-sm">Pay taxes online</div>
            </a>
            <a
              href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/verifyYourPAN"
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-base font-semibold">Verify PAN Status</div>
              <div className="text-gray-600 text-sm">Check PAN status</div>
            </a>
            <a
              href="https://www.incometax.gov.in/iec/foportal/"
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-base font-semibold">Know Refund Status</div>
              <div className="text-gray-600 text-sm">Track your refund</div>
            </a>
            <a
              href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar"
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-base font-semibold">Link Aadhaar</div>
              <div className="text-gray-600 text-sm">Link PAN with Aadhaar</div>
            </a>
            <a
              href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/knowYourTAN"
              target="_blank"
              rel="noreferrer"
              className="block bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-base font-semibold">Know TAN Details</div>
              <div className="text-gray-600 text-sm">Find TAN information</div>
            </a>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-xl px-8 py-6">
            <h3 className="text-lg font-semibold mb-2">ITR Due Date (AY 2025‑26)</h3>
            <p className="text-amber-900 text-sm">
              The due date for ITRs ordinarily due on 31 July 2025 has been extended to 15 September 2025 (per portal updates).
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-8 py-6">
            <h3 className="text-lg font-semibold mb-2">Helpdesk (Portal)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><span className="font-medium">Toll‑free:</span> 1800 103 0025 / 1800 419 0025</li>
              <li><span className="font-medium">Bengaluru:</span> +91‑80‑46122000 / +91‑80‑61464700</li>
              <li><span className="font-medium">Hours:</span> 08:00–20:00 (Mon–Fri; see portal for updates)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          More on services and latest updates: <a className="underline" target="_blank" rel="noreferrer" href="https://www.incometax.gov.in/iec/foportal/">Income Tax e‑Filing portal</a>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <details className="bg-white border border-gray-200 rounded-xl p-5">
              <summary className="font-medium cursor-pointer">What is the new tax regime?</summary>
              <p className="mt-2 text-sm text-gray-700">A concessional slab system with limited deductions/exemptions. You can compute tax as per slabs above and compare with the old regime if needed.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-xl p-5">
              <summary className="font-medium cursor-pointer">Is 4% cess always applicable?</summary>
              <p className="mt-2 text-sm text-gray-700">Yes, Health & Education Cess is generally 4% on the tax. This tool lets you include or exclude it for estimates.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-xl p-5">
              <summary className="font-medium cursor-pointer">Do all deductions apply in new regime?</summary>
              <p className="mt-2 text-sm text-gray-700">Many traditional deductions are not available. Standard deduction may apply. Refer to official guidance for eligibility.</p>
            </details>
            <details className="bg-white border border-gray-200 rounded-xl p-5">
              <summary className="font-medium cursor-pointer">Where can I file my ITR?</summary>
              <p className="mt-2 text-sm text-gray-700">Use the official e‑Filing portal to file returns and access services.</p>
            </details>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Official resources: {" "}
            <a className="underline" target="_blank" rel="noreferrer" href="https://www.incometax.gov.in/iec/foportal/">Portal Home</a>{" • "}
            <a className="underline" target="_blank" rel="noreferrer" href="https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1">AY 2025‑26 Guidance</a>
          </div>
        </div>

        {newsOpen && <NewsModal items={rssItems} onClose={() => setNewsOpen(false)} />}

      </section>
    </>
  );
}

export async function getStaticProps() {
  async function fetchText(url) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const r = await fetch(url, { headers: { 'User-Agent': 'TaxMateBot/1.0' }, signal: controller.signal });
      clearTimeout(timeout);
      if (!r.ok) return null;
      return await r.text();
    } catch (_) {
      return null;
    }
  }
  function parseItems(xml) {
    if (!xml) return [];
    const items = [];
    const itemRegex = /<item[\s\S]*?<\/item>/g;
    const titleRegex = /<title>([\s\S]*?)<\/title>/i;
    const linkRegex = /<link>([\s\S]*?)<\/link>/i;
    const dateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/i;
    const descRegex = /<description>([\s\S]*?)<\/description>/i;
    const matched = xml.match(itemRegex) || [];
    for (const chunk of matched) {
      const title = (chunk.match(titleRegex)?.[1] || '').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      const link = (chunk.match(linkRegex)?.[1] || '').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      const pubDate = (chunk.match(dateRegex)?.[1] || '').trim();
      const description = (chunk.match(descRegex)?.[1] || '').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]*>/g, '').trim();
      if (title && link) items.push({ title, link, pubDate, description });
    }
    return items;
  }
  const sources = [
    'https://pib.gov.in/PressReleaseRSSFeeds.aspx',
    'https://taxguru.in/feed'
  ];
  const feedTexts = await Promise.all(sources.map(fetchText));
  let rssItems = feedTexts.flatMap(parseItems).filter(Boolean).slice(0, 20);
  if (!rssItems.length) {
    rssItems = [
      { title: 'PIB – Press Releases (Latest)', link: 'https://pib.gov.in/PressReleasePage.aspx', pubDate: '', description: 'Official Government of India press releases including CBDT/Finance.' },
      { title: 'CBDT – Press Releases (Dept. of Revenue)', link: 'https://dor.gov.in/cbdt/press-releases', pubDate: '', description: 'Central Board of Direct Taxes announcements and circulars.' },
      { title: 'Income Tax Dept – Latest Updates', link: 'https://www.incometax.gov.in/iec/foportal/', pubDate: '', description: 'Check banners/alerts on the official e‑Filing portal.' }
    ];
  }
  return { props: { rssItems } };
}
