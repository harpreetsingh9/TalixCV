import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold tracking-tight">
            Resume Builder
          </h1>
          <Link href="/login" className="text-black hover:bg-gray-100">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-6xl font-serif font-bold tracking-tight text-balance">
              Craft Your Perfect Resume
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed text-balance max-w-2xl mx-auto">
              A minimalist, ATS-friendly resume builder designed for modern
              professionals. Create, customize, and optimize your resume with
              AI-powered enhancements.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 py-16">
            <div className="space-y-3 text-left">
              <h3 className="font-semibold text-lg">Live Preview</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                See your resume update in real-time as you edit
              </p>
            </div>
            <div className="space-y-3 text-left">
              <h3 className="font-semibold text-lg">ATS Optimized</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Designed to pass applicant tracking systems
              </p>
            </div>
            <div className="space-y-3 text-left">
              <h3 className="font-semibold text-lg">AI Enhanced</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                AI-powered suggestions to improve your content
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Link
              href="/app/dashboard"
              // onClick={handleGetStarted}
              // size="lg"
              className="bg-black text-white hover:bg-gray-900 px-8 py-6 text-lg font-medium"
            >
              Create Your Resume
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          <p>Resume Builder – Elevate Your Career</p>
        </div>
      </footer>
    </div>
  );
}
