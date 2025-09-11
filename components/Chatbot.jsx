import { useState, useMemo, useRef, useEffect } from "react";

const PRESET_QA = [
  { q: "What is 87A rebate?", a: "A rebate that reduces tax liability to zero when eligible. In new regime, taxable income up to ₹7,00,000 for resident individuals qualifies; in old regime, up to ₹5,00,000." },
  { q: "What cess is applied?", a: "Health & Education Cess at 4% on tax plus surcharge." },
  { q: "Which incomes have special rates?", a: "STCG u/s 111A at 15%, LTCG u/s 112A at 10% over ₹1L, and lottery/winnings at 30%." },
  { q: "Are deductions allowed in new regime?", a: "Most traditional deductions are not allowed; a standard deduction of ₹50,000 for salaried may apply." },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: "Hi! Ask me about slabs, 87A, cess, or use the quick questions below." }]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);

  const matchAnswer = useMemo(() => {
    return (text) => {
      const t = text.toLowerCase();
      for (const { q, a } of PRESET_QA) {
        if (q.toLowerCase().includes("87a") && t.includes("87a")) return a;
        if (q.toLowerCase().includes("cess") && (t.includes("cess") || t.includes("education"))) return a;
        if (q.toLowerCase().includes("special rates") && (t.includes("stcg") || t.includes("ltcg") || t.includes("lottery"))) return a;
        if (t.includes("deduction") || t.includes("new regime deduction")) return PRESET_QA[3].a;
      }
      return "I don't have that answer yet. Try asking about 87A, cess, deductions, STCG/LTCG, or use the quick questions.";
    };
  }, []);

  function curatedClientLinks(text) {
    const t = text.toLowerCase();
    const items = [
      {
        title: 'Income Tax Department — Tax Tools & Calculators',
        link: 'https://incometaxindia.gov.in/pages/tools/tax-calculator.aspx',
      },
    ];
    if (t.includes('calculator') || t.includes('compute') || t.includes('tax')) {
      items.push({
        title: 'Official Income Tax Calculator',
        link: 'https://eportal.incometax.gov.in/iec/foservices/#/TaxCalc/calculator',
      });
    }
    if (t.includes('87a') || t.includes('rebate')) {
      items.push({
        title: 'Section 87A Rebate – Official Guidance',
        link: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1',
      });
    }
    return items;
  }

  async function webSearch(text) {
    try {
      const url = `/api/search?q=${encodeURIComponent(text)}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('not ok');
      const data = await resp.json();
      const items = (data.items || []).slice(0, 5);
      if (!items.length) return { text: 'No results found.', links: [] };
      return { text: 'Here are some relevant links:', links: items };
    } catch {
      const items = curatedClientLinks(text);
      return { text: 'Here are official links you can use:', links: items };
    }
  }

  async function send() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    const quick = matchAnswer(trimmed);
    setMessages((m) => [...m, { role: "bot", text: quick }]);
    const searchReply = await webSearch(trimmed);
    setMessages((m) => [...m, { role: "bot", text: searchReply.text, links: searchReply.links }]);
    setInput("");
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open chatbot"
      >
        💬 Chat
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed right-4 bottom-20 z-40 w-80 max-h-[70vh] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col">
          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl flex items-center justify-between">
            <span className="font-semibold text-gray-800">Tax Helper</span>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "bot" ? "text-sm bg-blue-50 border border-blue-100 text-blue-900 rounded-lg px-3 py-2" : "text-sm bg-gray-100 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 ml-auto w-fit"}>
                <div>{m.text}</div>
                {Array.isArray(m.links) && !!m.links.length && (
                  <ul className="mt-2 space-y-1">
                    {m.links.map((it, idx) => (
                      <li key={idx}>
                        <a className="underline text-blue-700" target="_blank" rel="noreferrer" href={it.link}>{it.title || it.link}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-3 border-t space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {PRESET_QA.slice(0, 4).map((qa, idx) => (
                <button key={idx} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-700" onClick={() => { setInput(qa.q); setTimeout(() => send(), 0); }}>{qa.q}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button onClick={send} className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


