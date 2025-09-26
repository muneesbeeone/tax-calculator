import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SiteSearchPage() {
  const router = useRouter();
  const query = typeof router.query.q === 'string' ? router.query.q : '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function run() {
      if (!query) { setResults([]); return; }
      setLoading(true);
      try {
        const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (resp.ok) {
          const data = await resp.json();
          setResults(Array.isArray(data.items) ? data.items : []);
        } else {
          setResults([]);
        }
      } catch (_) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => controller.abort();
  }, [query]);

  return (
    <>
      <Head>
        <title>Search | Tax Mate</title>
        <meta name="robots" content="index,follow" />
        <meta name="description" content="Search Indian income tax resources and tools on Tax Mate." />
        <link rel="canonical" href={`https://taxcalculator.munees.co.in/search${query ? `?q=${encodeURIComponent(query)}` : ''}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Tax Mate',
              url: 'https://taxcalculator.munees.co.in/',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://taxcalculator.munees.co.in/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </Head>
      <section className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <form
          className="mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.querySelector('input[name="q"]');
            const value = input ? input.value : '';
            router.push(`/search?q=${encodeURIComponent(value)}`);
          }}
        >
          <input
            name="q"
            defaultValue={query}
            className="w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            placeholder="Search tax topics, e.g. 87A rebate, surcharge, calculator"
          />
        </form>

        {loading && <p className="text-gray-600">Loading…</p>}
        {!loading && query && results.length === 0 && (
          <p className="text-gray-700">No results. Try different keywords.</p>
        )}
        <ul className="space-y-3">
          {results.map((item, idx) => (
            <li key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
              <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-700 underline font-medium">
                {item.title}
              </a>
              {item.snippet && <p className="text-sm text-gray-700 mt-1">{item.snippet}</p>}
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-8 flex justify-center">
        <a
          href="https://buymeacoffee.com/munees"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium shadow border border-yellow-300"
          aria-label="Buy me a coffee"
        >
          ☕ Buy me a coffee
        </a>
      </div>
    </>
  );
}


