import Head from "next/head";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Tax Mate - Indian Income Tax Calculator</title>
        <meta name="description" content="Privacy policy for Tax Mate - Indian income tax calculator. Learn how we handle your data and protect your privacy." />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Privacy Policy | Tax Mate" />
        <meta property="og:description" content="Privacy policy for Tax Mate - Indian income tax calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://taxcalculator.munees.co.in/privacy-policy" />
        <link rel="canonical" href="https://taxcalculator.munees.co.in/privacy-policy" />
      </Head>
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: January 10, 2025</p>
          
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              Tax Mate is designed with privacy in mind. We do not collect, store, or transmit any personal information or financial data you enter into our calculator.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1.1 Calculator Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>All calculations are performed locally in your browser</li>
              <li>No income, deduction, or tax data is sent to our servers</li>
              <li>No personal information is collected or stored</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1.2 Website Analytics</h3>
            <p className="text-gray-700 mb-4">
              We may use basic website analytics to understand usage patterns, but this data is anonymized and does not identify individual users.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Information</h2>
            <p className="text-gray-700 mb-4">
              Since we do not collect personal data through our calculator, there is no personal information to use, share, or sell.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is protected because:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>All calculations happen in your browser</li>
              <li>No data is transmitted to our servers</li>
              <li>We use HTTPS encryption for all communications</li>
              <li>No cookies are used to track your calculations</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              Our website may use third-party services for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Website hosting and content delivery</li>
              <li>Basic analytics (anonymized data only)</li>
              <li>External links to official government resources</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Cookies</h2>
            <p className="text-gray-700 mb-4">
              We do not use cookies to track your calculator usage or store any personal information. Any cookies used are for basic website functionality only.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Children&apos;s Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page with an updated date.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this privacy policy, please contact us through our website or email.
            </p>
            
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Note</h3>
              <p className="text-blue-800 text-sm">
                This calculator is for estimation purposes only. Always consult with a qualified tax professional or refer to official government sources for accurate tax calculations and filing requirements.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Calculator
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
