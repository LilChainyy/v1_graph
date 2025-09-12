'use client';

type Props = { date?: string };

export default function AuctionScenario({ date }: Props) {
  return (
    <section className="mt-4 rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-4 md:p-5">
      <header className="mb-3 text-sm text-gray-500">
        10-yr Treasury Auction{date ? ` — ${date}` : ''}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="text-sm font-semibold text-gray-800 mb-1">
            Scenario 1: Strong demand (yield below WI)
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>10Y yields ↓</li>
            <li>TLT +0.6% | IEF +0.4% (typical intraday move)</li>
            <li>Equities: S&amp;P 500 median +0.3% next 24h</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="text-sm font-semibold text-gray-800 mb-1">
            Scenario 2: Weak demand (yield above WI)
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>10Y yields ↑</li>
            <li>TLT −0.6% | IEF −0.4%</li>
            <li>Equities: S&amp;P 500 median −0.2% next 24h</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
