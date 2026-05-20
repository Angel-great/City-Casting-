import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900">
      <nav className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-amber-400">
          City Casting Corp
        </h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-white hover:text-amber-400 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Premium Metal Casting
            <span className="block text-amber-400">Operating System</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Complete business management for jewelry casting, mold making,
            CAD design, and finishing services. Place orders, track progress,
            and manage your business all in one place.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-amber-600 text-white rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-amber-600 text-amber-400 rounded-lg text-lg font-semibold hover:bg-amber-600/10 transition-colors"
            >
              Customer Login
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: "Casting Services",
              desc: "Gold, Silver, Platinum, Palladium, and 20+ alloy options. From 5K to 24K.",
              icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
            },
            {
              title: "Real-Time Tracking",
              desc: "Track your orders through every department. Know exactly where your pieces are.",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            },
            {
              title: "Live Metal Pricing",
              desc: "Updated precious metal prices. See your cost for gold, silver, platinum, and palladium.",
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
            >
              <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            Services We Offer
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Casting",
              "Mold Making",
              "CAD Design",
              "3D Printing",
              "Wax Carving",
              "Polishing",
              "Stone Setting",
              "Plating",
              "Assembly",
              "Custom Engraving",
            ].map((service) => (
              <span
                key={service}
                className="px-4 py-2 bg-gray-800 text-amber-300 rounded-full text-sm border border-gray-700"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} City Casting Corp. All rights
        reserved.
      </footer>
    </div>
  );
}
