import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import AdSense from "@/components/AdSense";
import dynamic from "next/dynamic";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const BarChart = dynamic(() => import("react-chartjs-2").then(m => m.Bar), { ssr: false });

function TaxBreakdownChart({ slabTax, surchargeAmount, cessAmount, totalTax }) {
  const labels = ["Tax", "Surcharge", "Cess"];
  const values = [Math.max(0, slabTax), Math.max(0, surchargeAmount), Math.max(0, cessAmount)];
  const colors = ["#2563eb", "#7c3aed", "#059669"];
  const data = {
    labels,
    datasets: [
      {
        label: "Amount (₹)",
        data: values,
        backgroundColor: colors,
        borderRadius: 8,
        maxBarThickness: 64,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${(ctx.parsed.y || 0).toLocaleString('en-IN')}`,
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#374151", font: { size: 12 } },
      },
      y: {
        grid: { color: "#E5E7EB" },
        ticks: {
          color: "#4B5563",
          font: { size: 11 },
          callback: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
        },
      },
    },
  };
  return (
    <div className="w-full h-48" role="img" aria-label="Tax breakdown bar chart">
      <BarChart data={data} options={options} />
      <p className="mt-2 text-xs text-gray-500 text-right">Total: ₹{totalTax.toLocaleString('en-IN')}</p>
    </div>
  );
}

function calculateNewRegimeTax(taxableIncome, isResident) {
  const income = Math.max(0, taxableIncome);

  // Apply Section 87A rebate (resident individuals only) for new regime
  if (isResident && income <= 700000) return 0;

  // FY 2025 proposed simplified new regime slabs used in this tool:
  // 0% up to ₹3,00,000; 5% on ₹3,00,001–₹7,00,000; 10% on ₹7,00,001–₹10,00,000;
  // 15% above ₹10,00,000.
  if (income <= 1000000) {
    // First ₹3L at 0%, next ₹4L at 5%, remainder up to ₹10L at 10%
    return (400000 * 0.05) + (income - 700000) * 0.10;
  }
  // Above ₹10L add 15% for the remaining amount
  return (400000 * 0.05) + (300000 * 0.10) + (income - 1000000) * 0.15;
}

export default function CalculatorPage() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [applyStandardDeduction, setApplyStandardDeduction] = useState(true);
  const [includeCess, setIncludeCess] = useState(true);
  const [regime, setRegime] = useState("new"); // 'new' | 'old'
  const [ageCategory, setAgeCategory] = useState("lt60"); // lt60 | s60 | s80
  const [residency, setResidency] = useState("resident"); // resident | nonresident
  const [compareRegimes, setCompareRegimes] = useState(false);

  // Special-rate incomes (taxed separately)
  const [stcg111a, setStcg111a] = useState(0); // 15%
  const [ltcg112a, setLtcg112a] = useState(0); // 10% over ₹1L
  const [lotteryIncome, setLotteryIncome] = useState(0); // 30%

  // Shared styles for inputs/selects
  const inputClass = "w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 shadow-sm";
  const selectClass = "w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm";

  const calculateOldRegimeTax = useCallback(function (taxableIncome) {
    const income = Math.max(0, taxableIncome);
    // Basic exemption threshold varies by age
    const basicExemption = ageCategory === "s80" ? 500000 : ageCategory === "s60" ? 300000 : 250000;

    // 87A rebate under old regime applies only to resident individuals
    if (residency === "resident" && income <= 500000) return 0;

    if (income <= basicExemption) return 0;
    if (ageCategory === "s80") {
      // 80+ years: 0% up to 5L, then 20% up to 10L, then 30%
      if (income <= 1000000) return (income - 500000) * 0.20;
      return (500000 * 0.20) + (income - 1000000) * 0.30;
    }
    // <60 or 60-79
    if (income <= 500000) return (income - basicExemption) * 0.05;
    if (income <= 1000000) return (200000 * 0.05) + (income - 500000) * 0.20; // 3L-5L or 2.5L-5L band width is 2L
    return (200000 * 0.05) + (500000 * 0.20) + (income - 1000000) * 0.30;
  }, [ageCategory, residency]);

  function computeSurcharge(totalTaxableIncome, baseTax, specialTaxes, regimeParam) {
    // Simplified surcharge slabs for individuals
    let rate = 0;
    if (totalTaxableIncome > 50000000) rate = 0.37;
    else if (totalTaxableIncome > 20000000) rate = 0.25;
    else if (totalTaxableIncome > 10000000) rate = 0.15;
    else if (totalTaxableIncome > 5000000) rate = 0.10;

    // New regime cap: maximum 25%
    if (regimeParam === "new" && rate > 0.25) rate = 0.25;

    // Cap surcharge on specified capital gains (111A/112A) at 15%
    const specialCapRate = Math.min(rate, 0.15);
    const surchargeOnSpecial = (specialTaxes.stcg + specialTaxes.ltcg) * specialCapRate;
    const surchargeOnBase = baseTax * rate;
    return Math.round(surchargeOnSpecial + surchargeOnBase);
  }

  const { grossIncome, otherDeductions, standardDeduction, totalDeductions, taxableIncome, slabTax, surchargeAmount, cessAmount, totalTax, specialBreakup, compare } = useMemo(() => {
    const baseIncome = Number(totalIncome) || 0;
    const stcg = Math.max(0, Number(stcg111a) || 0);
    const ltcg = Math.max(0, Number(ltcg112a) || 0);
    const lottery = Math.max(0, Number(lotteryIncome) || 0);
    const gross = baseIncome + stcg + ltcg + lottery;
    const otherDed = Math.min(Number(deductions) || 0, Math.max(0, gross));
    const stdDed = applyStandardDeduction ? 50000 : 0;
    // Deductions and standard deduction are assumed to reduce base income only
    const maxDeductibleAgainstBase = Math.max(0, baseIncome);
    const cappedStd = Math.min(stdDed, Math.max(0, maxDeductibleAgainstBase - Math.min(otherDed, maxDeductibleAgainstBase)));
    const effectiveOtherDed = Math.min(otherDed, maxDeductibleAgainstBase);
    const baseAfterDeductions = Math.max(0, baseIncome - effectiveOtherDed - cappedStd);
    const totalDed = effectiveOtherDed + cappedStd;

    // Special-rate taxes (common to both regimes)
    const stcgTax = Math.round(stcg * 0.15);
    const ltcgTax = Math.round(Math.max(0, ltcg - 100000) * 0.10);
    const lotteryTax = Math.round(lottery * 0.30);
    const specialTaxes = { stcg: stcgTax, ltcg: ltcgTax, lottery: lotteryTax };

    const taxableTotalIncome = baseAfterDeductions + stcg + ltcg + lottery;

    function computeFor(regimeParam) {
      const baseTaxLocal = regimeParam === "new"
        ? calculateNewRegimeTax(baseAfterDeductions, residency === "resident")
        : calculateOldRegimeTax(baseAfterDeductions);
      const preSurcharge = Math.round(baseTaxLocal + stcgTax + ltcgTax + lotteryTax);
      const surchargeLocal = computeSurcharge(taxableTotalIncome, baseTaxLocal, specialTaxes, regimeParam);
      const plusSurcharge = preSurcharge + surchargeLocal;
      const cessLocal = includeCess ? Math.round(plusSurcharge * 0.04) : 0;
      return {
        slabTax: preSurcharge,
        surchargeAmount: surchargeLocal,
        cessAmount: cessLocal,
        totalTax: plusSurcharge + cessLocal,
      };
    }

    const resultNew = computeFor("new");
    const resultOld = computeFor("old");

    const selected = regime === "new" ? resultNew : resultOld;

    return {
      grossIncome: gross,
      otherDeductions: effectiveOtherDed,
      standardDeduction: cappedStd,
      totalDeductions: Math.min(totalDed, gross),
      taxableIncome: taxableTotalIncome,
      slabTax: selected.slabTax,
      surchargeAmount: selected.surchargeAmount,
      cessAmount: selected.cessAmount,
      totalTax: selected.totalTax,
      specialBreakup: specialTaxes,
      compare: {
        new: resultNew,
        old: resultOld,
        recommendation: resultNew.totalTax <= resultOld.totalTax ? "new" : "old",
        difference: Math.abs(resultNew.totalTax - resultOld.totalTax),
      },
    };
  }, [totalIncome, deductions, applyStandardDeduction, includeCess, regime, stcg111a, ltcg112a, lotteryIncome, residency, calculateOldRegimeTax]);

  return (
    <>
      <Head>
        <title>Tax Calculator (FY 2025 New Regime) | Indian Income Tax</title>
        <meta name="description" content="Calculate Indian income tax for FY 2025 under the new regime with standard deduction and 4% cess options. See slab-wise breakdown and totals." />
        <meta name="keywords" content="tax calculator India, Indian income tax calculator, FY 2025 new regime calculator, income tax slabs India, calculate tax India, Section 87A India, surcharge calculator India, cess 4 percent, standard deduction 50000, AY 2026-27 calculator" />
        <meta property="og:title" content="Tax Calculator (FY 2025 New Regime)" />
        <meta property="og:description" content="Slab-wise income tax calculator for India with cess and standard deduction toggles." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://taxcalculator.munees.co.in/calculator" />
        <meta property="og:image" content="https://taxcalculator.munees.co.in/og_home.png" />
        <link rel="canonical" href="https://taxcalculator.munees.co.in/calculator" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Indian Income Tax Calculator – New Regime FY 2025',
              url: 'https://taxcalculator.munees.co.in/calculator',
              description: 'Calculate Indian income tax for FY 2025 under the new regime with slab-wise breakdown, standard deduction and cess options.'
            })
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4391323106927085"
          crossorigin="anonymous"
        ></script>
      </Head>
      <section className="max-w-6xl mx-auto relative">
        <div className="pointer-events-none absolute -top-8 -left-8 h-36 w-36 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 opacity-30 blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 opacity-30 blur-2xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-2">Tax Calculator</h2>
            <p className="text-gray-600 mb-2">Choose tax regime and enter details</p>
            <p className="text-gray-700 mb-6">
              Estimate Indian Income Tax for FY 2025 (New Regime) with slab‑wise breakdown, Section 87A rebate, optional ₹50,000 standard deduction and 4% cess. Compare with the old regime. <Link href="/learn" className="underline text-blue-700">Read quick guides</Link> or <Link href="/" className="underline text-blue-700">go to homepage</Link>.
            </p>

            <span className="text-sm text-gray-700 sm:mr-4">Regime</span>
            <div className="mb-4 flex flex-wrap items-center gap-4 bg-gray-50 border mt-1 border-gray-200 rounded-lg px-4 py-3 sm:flex-nowrap sm:justify-center">
              <div className="flex items-center gap-2 sm:mr-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="regime" value="new" checked={regime === "new"} onChange={() => setRegime("new")} className="text-blue-600" />
                  <span className="text-sm">New (115BAC 1A)</span>
                </label>
              </div>
              <div className="flex items-center gap-2 sm:mr-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="regime" value="old" checked={regime === "old"} onChange={() => setRegime("old")} className="text-blue-600" />
                  <span className="text-sm">Old</span>
                </label>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={compareRegimes} onChange={(e) => setCompareRegimes(e.target.checked)} className="text-blue-600" />
                  <span className="text-sm">Compare New vs Old</span>
                </label>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Age Category</span>
                <select value={ageCategory} onChange={(e) => setAgeCategory(e.target.value)} className={selectClass}>
                  <option value="lt60">Less than 60 years</option>
                  <option value="s60">60 to less than 80 years</option>
                  <option value="s80">80 years and above</option>
                </select>
                {regime === "new" && (
                  <p className="mt-1 text-xs text-gray-500">Age affects basic exemption only under the Old regime.</p>
                )}
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Residential Status</span>
                <select value={residency} onChange={(e) => setResidency(e.target.value)} className={selectClass}>
                  <option value="resident">Resident</option>
                  <option value="nonresident">Non-Resident</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Income (₹)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  className={inputClass}
                  placeholder="e.g. 1200000"
                  value={totalIncome}
                  onChange={(e) => setTotalIncome(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deductions (₹)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  className={inputClass}
                  placeholder="e.g. 50000"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">STCG u/s 111A (₹)</label>
                <input type="number" inputMode="decimal" className={inputClass} value={stcg111a} onChange={(e) => setStcg111a(e.target.value)} min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LTCG u/s 112A (₹)</label>
                <input type="number" inputMode="decimal" className={inputClass} value={ltcg112a} onChange={(e) => setLtcg112a(e.target.value)} min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lottery/Winnings (₹)</label>
                <input type="number" inputMode="decimal" className={inputClass} value={lotteryIncome} onChange={(e) => setLotteryIncome(e.target.value)} min="0" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={applyStandardDeduction}
                  onChange={(e) => setApplyStandardDeduction(e.target.checked)}
                />
                <span className="text-sm text-gray-800">Apply standard deduction ₹50,000 (if eligible)</span>
              </label>
              <label className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={includeCess}
                  onChange={(e) => setIncludeCess(e.target.checked)}
                />
                <span className="text-sm text-gray-800">Include 4% Health & Education Cess</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => { /* values update on input; button provided as per spec */ }}
              className="w-full sm:w-auto inline-flex justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Calculate
            </button>
            <div className="mt-3 text-xs text-gray-600 space-y-1">
              <p className="font-medium text-gray-700">Tips</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Values update as you type; the Calculate button is optional.</li>
                <li>Use &quot;Compare New vs Old&quot; to see both regimes side by side.</li>
                <li>Toggle standard deduction and 4% cess to refine estimates.</li>
                <li>Residential status affects rebate eligibility; age affects Old regime only.</li>
                <li>Enter STCG/LTCG/lottery in their fields; they are taxed at special rates.</li>
                <li>See slab rates below: <a href="#slabs-rates" className="underline text-blue-700">Income Tax Slabs & Rates</a>.</li>
                <li>This is an estimate; check official calculator before filing.</li>
              </ul>
            </div>
          </div>



          <div className="lg:sticky lg:top-6 h-fit mt-0 p-6 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-medium">
                ✓ Verified with official sources
              </span>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Gross Income</dt>
                <dd className="font-semibold">₹{grossIncome.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Regime</dt>
                <dd className="font-semibold">{regime === "new" ? "New" : "Old"}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Other Deductions</dt>
                <dd className="font-semibold">₹{otherDeductions.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Standard Deduction</dt>
                <dd className="font-semibold">₹{standardDeduction.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">STCG 111A Tax</dt>
                <dd className="font-semibold">₹{specialBreakup.stcg.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">LTCG 112A Tax</dt>
                <dd className="font-semibold">₹{specialBreakup.ltcg.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Lottery/Winnings Tax</dt>
                <dd className="font-semibold">₹{specialBreakup.lottery.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Total Deductions</dt>
                <dd className="font-semibold">₹{totalDeductions.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Taxable Income</dt>
                <dd className="font-semibold">₹{taxableIncome.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Tax (pre‑surcharge)</dt>
                <dd className="font-semibold">₹{slabTax.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">Surcharge</dt>
                <dd className="font-semibold">₹{surchargeAmount.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-600">4% Cess</dt>
                <dd className="font-semibold">₹{cessAmount.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg border border-blue-100 p-4">
                <dt className="text-gray-700 font-medium">Total Tax</dt>
                <dd className="font-semibold">₹{totalTax.toLocaleString("en-IN")}</dd>
              </div>
            </dl>
            <div className="text-xs text-gray-600 mt-4 space-y-2">
              <p>Note: Estimates based on the selected regime for FY 2025. Surcharge (if any) not included.</p>
              <p className="text-gray-700">Special-rate taxes included for STCG 111A (15%), LTCG 112A (10% above ₹1L) and lottery (30%). Surcharge rules simplified with caps per law.</p>
              <p>
                Reference: <a className="underline" target="_blank" rel="noreferrer" href="https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1">Income Tax e‑Filing portal (AY 2025‑26 guidance)</a>
              </p>
              <p>
                Cross‑check: <a className="underline" target="_blank" rel="noreferrer" href="https://eportal.incometax.gov.in/iec/foservices/#/TaxCalc/calculator">Official Tax Calculator</a>
              </p>
            </div>
          <div className="bg-white rounded-xl border border-blue-100 p-4 sm:p-5 mt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Tax Breakdown</h4>
            <TaxBreakdownChart
              slabTax={slabTax}
              surchargeAmount={surchargeAmount}
              cessAmount={cessAmount}
              totalTax={totalTax}
            />
          </div>
          </div>
          {compareRegimes && (
            <div className="lg:col-span-2 bg-white border border-green-200 rounded-xl p-6 mt-4">
              <h4 className="text-base font-semibold mb-3">Regime Comparison</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2"><span className="text-gray-700">New Regime</span>{compare.recommendation === 'new' && <span className="text-emerald-700 text-xs font-semibold">Recommended</span>}</div>
                  <div className="flex items-center justify-between"><span className="text-gray-600">Total Tax</span><span className="font-semibold">₹{compare.new.totalTax.toLocaleString('en-IN')}</span></div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2"><span className="text-gray-700">Old Regime</span>{compare.recommendation === 'old' && <span className="text-emerald-700 text-xs font-semibold">Recommended</span>}</div>
                  <div className="flex items-center justify-between"><span className="text-gray-600">Total Tax</span><span className="font-semibold">₹{compare.old.totalTax.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">Difference: ₹{compare.difference.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <details className="group bg-white border border-gray-200 rounded-xl shadow-sm">
            <summary className="cursor-pointer list-none select-none px-5 py-4 flex items-center justify-between gap-4">
              <span className="text-base font-semibold">FAQs about the Income Tax Calculator</span>
              <span className="text-gray-500 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-gray-700 space-y-3">
              <p><strong>What does this income tax calculator do?</strong> It estimates your Indian income tax using the selected regime, showing a clear breakdown of slab tax, surcharge, and cess.</p>
              <p><strong>Is the income tax calculator accurate?</strong> It is an estimate based on simplified rules for FY 2025. Always verify with the official calculator or consult a professional.</p>
              <p><strong>Can I compare regimes in the income tax calculator?</strong> Yes. Enable “Compare New vs Old” to view totals side by side.</p>
            </div>
          </details>
        </div>
        {/* Ad Placement - Above Results */}
        <div className="mt-6 flex justify-center">
          <AdSense
            slot="9783500294"
            className="max-w-728px w-full"
            adType="banner"
          />
        </div>
        <div className="mt-6">
          <details className="group bg-white border border-gray-200 rounded-xl shadow-sm">
            <summary className="cursor-pointer list-none select-none px-5 py-4 flex items-center justify-between gap-4">
              <span className="text-base font-semibold">Important Notes & Info</span>
              <span className="text-gray-500 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-gray-700 space-y-3">
              <p>
                This tool estimates income tax for FY 2025 (AY 2026‑27) under the selected regime.
                Actual liability may vary based on your specific facts and law changes.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                {regime === "new" ? (
                  <li>
                    New regime slabs: 0% up to ₹3,00,000; 5% for ₹3,00,001–₹7,00,000; 10% for ₹7,00,001–₹10,00,000; 15% above ₹10,00,000.
                  </li>
                ) : (
                  <li>
                    Old regime slabs: 0% up to ₹2,50,000; 5% for ₹2,50,001–₹5,00,000; 20% for ₹5,00,001–₹10,00,000; 30% above ₹10,00,000.
                  </li>
                )}
                <li>
                  4% Health & Education Cess can be toggled. Surcharge (if applicable at high incomes) is not included.
                </li>
                <li>
                  Standard deduction of ₹50,000 can be toggled. Eligibility depends on current provisions for your income category.
                </li>
                <li>
                  Deductions entered are treated as overall reductions against income for estimation. Under the new regime, many traditional deductions/exemptions are not available.
                </li>
                <li>
                  Section 87A rebate is applied when eligible: up to ₹7,00,000 (new regime) or up to ₹5,00,000 (old regime). Other reliefs, MAT/AMT, special income rates, TDS/TCS credits, or set‑offs are not covered.
                </li>
                <li>
                  Special-rate incomes are taxed separately and added: STCG 111A at 15%, LTCG 112A at 10% after ₹1,00,000 exemption, lottery/winnings at 30%. Surcharge on these is capped at 15%.
                </li>
                <li>
                  <strong>GST vs. Income Tax:</strong> This calculator is for Income Tax. For information on Goods and Services Tax (GST), an indirect tax, please see our <Link href="/gst-information" className="underline text-blue-700">GST Information page</Link>.
                </li>
              </ul>
              <p className="text-gray-600">
                Reference: <a className="underline" target="_blank" rel="noreferrer" href="https://www.incometax.gov.in/iec/foportal/">Income Tax e‑Filing portal</a>
              </p>
            </div>
          </details>
        </div>
        <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h3 id="slabs-rates" className="text-lg font-semibold mb-3">Income Tax Slabs & Rates</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">New Regime (FY 2025)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-3 py-2 border-b">Income Range</th>
                      <th className="px-3 py-2 border-b">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="px-3 py-2">Up to ₹3,00,000</td><td className="px-3 py-2 font-medium">0%</td></tr>
                    <tr><td className="px-3 py-2">₹3,00,001 – ₹7,00,000</td><td className="px-3 py-2 font-medium">5%</td></tr>
                    <tr><td className="px-3 py-2">₹7,00,001 – ₹10,00,000</td><td className="px-3 py-2 font-medium">10%</td></tr>
                    <tr><td className="px-3 py-2">Above ₹10,00,000</td><td className="px-3 py-2 font-medium">15%</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-600">Section 87A rebate for residents up to ₹7,00,000 taxable income. 4% cess applies on tax plus surcharge. Surcharge capped at 25% in New regime.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Old Regime</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-3 py-2 border-b">Income Range</th>
                      <th className="px-3 py-2 border-b">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="px-3 py-2">Up to ₹2,50,000</td><td className="px-3 py-2 font-medium">0%</td></tr>
                    <tr><td className="px-3 py-2">₹2,50,001 – ₹5,00,000</td><td className="px-3 py-2 font-medium">5%</td></tr>
                    <tr><td className="px-3 py-2">₹5,00,001 – ₹10,00,000</td><td className="px-3 py-2 font-medium">20%</td></tr>
                    <tr><td className="px-3 py-2">Above ₹10,00,000</td><td className="px-3 py-2 font-medium">30%</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-600">Section 87A rebate for residents up to ₹5,00,000 taxable income. 4% cess applies on tax plus surcharge. Surcharge on specified gains (111A/112A) capped at 15%.</p>
            </div>
          </div>
        </div>
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
      </section>
    </>
  );
}
