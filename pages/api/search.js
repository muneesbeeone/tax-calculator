export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const query = String(req.query.q || '').trim();
  if (!query) {
    res.status(400).json({ error: 'Missing q' });
    return;
  }

  // 100% free: return curated official links based on simple keyword matching
  function curatedResults(q) {
    const lower = q.toLowerCase();
    const items = [];

    // Always include the official calculator landing page
    items.push({
      title: 'Income Tax Department — Tax Tools & Calculators',
      link: 'https://incometaxindia.gov.in/pages/tools/tax-calculator.aspx',
      snippet: 'Official portal listing calculators and references (as amended up to Finance Act 2025).'
    });

    // Frequently needed by taxpayers
    items.push({
      title: 'Know Your AO / Jurisdiction',
      link: 'https://www.incometax.gov.in/iec/foportal/know-your-jurisdiction',
      snippet: 'Find your Assessing Officer details and jurisdiction.'
    });
    items.push({
      title: 'Pay Tax Online (e-Pay Tax)',
      link: 'https://eportal.incometax.gov.in/iec/foservices/#/e-pay-tax-prelogin/user-details',
      snippet: 'Official portal to pay advance/self‑assessment tax and view challans.'
    });
    items.push({
      title: 'Verify your PAN',
      link: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/verifyYourPan',
      snippet: 'Check PAN validity and details.'
    });
    items.push({
      title: 'AIS (Annual Information Statement) Overview',
      link: 'https://www.incometax.gov.in/iec/foportal/help/ais',
      snippet: 'Understand AIS/TIS statements used for prefilled incomes and taxes.'
    });

    if (lower.includes('calculator') || lower.includes('compute') || lower.includes('tax')) {
      items.push({
        title: 'Official Income Tax Calculator',
        link: 'https://eportal.incometax.gov.in/iec/foservices/#/TaxCalc/calculator',
        snippet: 'CBDT calculator with AY selection, regime choice, surcharge and cess.'
      });
    }

    if (lower.includes('87a') || lower.includes('rebate')) {
      items.push({
        title: 'Section 87A Rebate – Official Guidance',
        link: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1',
        snippet: 'Eligibility and thresholds for rebate under 87A (new/old regime context).'
      });
    }

    if (lower.includes('stcg') || lower.includes('ltcg') || lower.includes('capital')) {
      items.push({
        title: 'Capital Gains (STCG/LTCG) – Official Help',
        link: 'https://www.incometax.gov.in/iec/foportal/',
        snippet: 'Navigate to Help > By Heads of Income > Capital Gains for rate tables and examples.'
      });
    }

    if (lower.includes('surcharge') || lower.includes('cess')) {
      items.push({
        title: 'Surcharge and Health & Education Cess — Overview',
        link: 'https://www.incometax.gov.in/iec/foportal/',
        snippet: 'Official notes on surcharge thresholds and 4% cess application.'
      });
    }

    return items;
  }

  return res.status(200).json({ query, items: curatedResults(query), source: 'curated-only' });
}


