"use client"

import Link from "next/link"
import { Shield, Lock, Eye, Database, Server, RefreshCw, ChevronRight } from "lucide-react"

export default function PrivacyPolicyPage() {
  const lastUpdated = "July 14, 2026"

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-slate-950 text-slate-100 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-slate-300">Your Data, Your Control</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            We believe in complete transparency. Here is exactly what data we collect, why we collect it, and how we protect it.
          </p>
          <p className="text-sm text-slate-500">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            
            {/* 1. Information We Collect */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">1. Information We Collect</h2>
              </div>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>When you use SecondHome to find a PG, flat, or roommate, we collect specific data to provide you with the best experience and safest environment:</p>
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> Account & Identity Data
                  </h3>
                  <p className="text-sm mb-4">When you create an account, we collect your basic identity information:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                    <li>Name, Email address, and Phone number</li>
                    <li>Date of Birth, Gender, and Nationality</li>
                    <li>Current College/University and Course details</li>
                    <li>Permanent Address, City, State, and Pincode</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> SecMatch Roommate Data
                  </h3>
                  <p className="text-sm mb-4">To power our AI compatibility engine, we collect lifestyle preferences:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                    <li>Sleep schedules (Early bird, night owl, etc.)</li>
                    <li>Cleanliness levels and cooking habits</li>
                    <li>Budget constraints and preferred locations</li>
                    <li>Personal interests and short bio</li>
                    <li>Your swipe/match history to prevent showing duplicates</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> Property Owner Data
                  </h3>
                  <p className="text-sm mb-4">For owners listing properties or messes:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                    <li>Property details, amenities, pricing, and exact location</li>
                    <li>Property photos and verification documents</li>
                  </ul>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. How We Use It */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">2. How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>We do not sell your personal data to third-party data brokers. We use your data strictly to:</p>
                <ul className="space-y-4 mt-4">
                  <li className="flex gap-3">
                    <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Power AI Matchmaking:</strong> We analyze your lifestyle preferences to calculate a compatibility score with other potential roommates.</span>
                  </li>
                  <li className="flex gap-3">
                    <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Ensure Safety & Verification:</strong> We verify emails, phone numbers, and student status to maintain a trusted community of verified individuals.</span>
                  </li>
                  <li className="flex gap-3">
                    <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Facilitate Communication:</strong> We use your contact details to send important notifications, match alerts, and allow secure in-app chatting.</span>
                  </li>
                </ul>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. Privacy & Security */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">3. Privacy Controls & Security</h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>We've built privacy directly into the core of SecondHome:</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <Eye className="w-6 h-6 text-emerald-500 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-2">Hidden Contact Info</h4>
                    <p className="text-sm">Your phone number is strictly hidden by default. It is only revealed when you and another user mutually match and approve contact sharing.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <Server className="w-6 h-6 text-emerald-500 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-2">Secure Infrastructure</h4>
                    <p className="text-sm">Your data is stored securely in modern encrypted databases. Passwords are cryptographically hashed and never stored in plain text.</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 4. Your Rights */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Your Rights & Choices</h2>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>You have full control over your data. At any time, you can:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Toggle your profile visibility (hide yourself from the matching pool).</li>
                  <li>Update or correct your personal preferences and details.</li>
                  <li>Opt-out of email and SMS notifications.</li>
                  <li>Request complete deletion of your account and associated data.</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-12 p-8 bg-slate-950 text-white rounded-2xl text-center">
              <h3 className="text-xl font-bold mb-3">Questions about your privacy?</h3>
              <p className="text-slate-400 mb-6 text-sm">We're here to help. Contact our Data Protection team.</p>
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors">
                Contact Support
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
