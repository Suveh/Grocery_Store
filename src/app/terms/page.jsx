"use client";
import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
             Terms of Service
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto opacity-90">
            Last updated: December 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ⚖️
            </div>
            <p className="text-gray-600">
              Welcome to GroceryStore. These Terms of Service govern your use of 
              our website and services. Please read them carefully before using our services.
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium text-center">
              By accessing or using our services, you agree to be bound by these Terms.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {[
            {
              title: "1. Acceptance of Terms",
              content: `
                By accessing and using GroceryStore's website and services, 
                you accept and agree to be bound by these Terms of Service 
                and our Privacy Policy. If you do not agree, you may not use our services.
              `
            },
            {
              title: "2. Account Registration",
              content: `
                To place orders, you must create an account. You agree to:
                • Provide accurate and complete information
                • Maintain the security of your password
                • Notify us of any unauthorized account use
                • Be responsible for all activities under your account
              `
            },
            {
              title: "3. Ordering and Payment",
              content: `
                • Orders are subject to product availability
                • Prices are subject to change without notice
                • We accept various payment methods as displayed
                • Payment must be completed before order processing
                • Taxes and delivery charges apply as shown at checkout
              `
            },
            {
              title: "4. Delivery",
              content: `
                • Delivery times are estimates, not guarantees
                • Someone must be available to receive the delivery
                • Delivery fees vary by location (see Shipping Info)
                • Risk of loss passes to you upon delivery
                • We are not responsible for delays beyond our control
              `
            },
            {
              title: "5. Returns and Refunds",
              content: `
                • Perishable items: 24-hour return window
                • Non-perishable items: 7-day return window
                • Items must be in original condition
                • Refunds processed within 7-10 business days
                • See our Returns & Refunds page for details
              `
            },
            {
              title: "6. User Conduct",
              content: `
                You agree not to:
                • Use our services for any illegal purpose
                • Attempt to gain unauthorized access
                • Interfere with site functionality
                • Submit false or misleading information
                • Harass our staff or other users
              `
            },
            {
              title: "7. Intellectual Property",
              content: `
                • All content on this site is our property
                • You may not copy, modify, or distribute our content
                • GroceryStore logo and branding are trademarks
                • Unauthorized use is strictly prohibited
              `
            },
            {
              title: "8. Limitation of Liability",
              content: `
                To the maximum extent permitted by law:
                • We are not liable for indirect or consequential damages
                • Our total liability is limited to the order value
                • We are not liable for product quality issues beyond our control
                • We are not liable for delivery delays by third parties
              `
            },
            {
              title: "9. Termination",
              content: `
                We may terminate or suspend your account if you:
                • Violate these Terms
                • Engage in fraudulent activity
                • Create risk or legal exposure for us
                • Upon termination, your right to use our services ends immediately
              `
            },
            {
              title: "10. Changes to Terms",
              content: `
                We reserve the right to modify these Terms at any time. 
                Continued use after changes constitutes acceptance. 
                We will notify you of significant changes via email or site notice.
              `
            },
            {
              title: "11. Governing Law",
              content: `
                These Terms are governed by the laws of [Your Country/State]. 
                Any disputes shall be resolved in the courts of [Your City/Region].
              `
            },
            {
              title: "12. Contact Information",
              content: `
                For questions about these Terms, contact us:
                Email: legal@grocerystore.com
                Phone: +1 (555) 123-4567
                Address: 782 Jaffna Road, Chullipuram, Pannakam
                Hours: Mon-Fri, 9 AM - 6 PM
              `
            }
          ].map((term, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    {term.title}
                  </h2>
                  <div className="text-gray-600 whitespace-pre-line">
                    {term.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            ⚠️ Important Notice
          </h3>
          <p className="text-gray-600">
            These Terms constitute a legal agreement between you and GroceryStore. 
            It is your responsibility to review these Terms periodically for updates. 
            Your continued use of our services following the posting of changes will 
            mean that you accept and agree to the changes.
          </p>
        </div>

       

        {/* Back Links */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            ← Back to Home
          </Link>
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Contact Legal Department
          </Link>
        </div>
      </div>
    </div>
  );
}