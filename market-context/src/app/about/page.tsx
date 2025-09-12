import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Events
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            About & Disclosures
          </h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What is Market Event Context?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Market Event Context is an educational tool that provides historical context 
              for upcoming market events. It helps users understand how similar events 
              have affected markets in the past, along with scenario analysis and 
              potential market impacts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              How It Works
            </h2>
            <ul className="text-gray-600 space-y-2">
              <li>• <strong>Event Feed:</strong> Browse upcoming market events with key details</li>
              <li>• <strong>Scenario Analysis:</strong> See potential outcomes and their historical precedents</li>
              <li>• <strong>Interactive Charts:</strong> Visualize price movements around similar past events</li>
              <li>• <strong>Historical Context:</strong> Understand how markets reacted to similar events</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Important Disclosures
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-semibold">
                ⚠️ This tool is for educational purposes only and does not constitute investment advice.
              </p>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Not Investment Advice:</strong> The information provided is for educational 
                and informational purposes only. It should not be construed as investment advice, 
                financial advice, trading advice, or any other type of advice.
              </p>
              
              <p>
                <strong>Past Performance:</strong> Historical data and past performance do not 
                guarantee future results. Market conditions change, and what happened in the 
                past may not happen again.
              </p>
              
              <p>
                <strong>No Guarantees:</strong> We make no representations or warranties about 
                the accuracy, completeness, or reliability of the information provided. 
                Market events are inherently unpredictable.
              </p>
              
              <p>
                <strong>Consult Professionals:</strong> Always consult with qualified financial 
                advisors, investment professionals, or other appropriate professionals before 
                making any investment decisions.
              </p>
              
              <p>
                <strong>Risk Warning:</strong> All investments carry risk, including the potential 
                loss of principal. Past performance is not indicative of future results.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Data Sources
            </h2>
            <p className="text-gray-600">
              This tool uses publicly available market data and historical information. 
              While we strive for accuracy, we cannot guarantee the completeness or 
              accuracy of all data points. Users should verify information independently 
              before making any decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Contact
            </h2>
            <p className="text-gray-600">
              For questions about this tool or to report issues, please contact us through 
              the appropriate channels. This is an educational project and not a commercial 
              financial service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

