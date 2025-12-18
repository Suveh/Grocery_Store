"use client";
import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
             Privacy Policy
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
          <p className="text-gray-600 mb-6">
            At GroceryStore, we take your privacy seriously. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information 
            when you use our website and services.
          </p>
          <p className="text-gray-600">
            By using our services, you agree to the collection and use of information 
            in accordance with this policy.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {[
            {
              title: "1. Information We Collect",
              content: `
                We collect several types of information for various purposes:
                • Personal Information: Name, email address, phone number, delivery address
                • Payment Information: Credit/debit card details (securely processed)
                • Usage Data: Pages visited, time spent, device information
                • Cookies: To improve your browsing experience
              `
            },
            {
              title: "2. How We Use Your Information",
              content: `
                Your information is used to:
                • Process and deliver your orders
                • Communicate about your orders and account
                • Improve our website and services
                • Send promotional offers (with your consent)
                • Comply with legal obligations
              `
            },
            {
              title: "3. Data Protection",
              content: `
                We implement security measures including:
                • SSL encryption for all data transmission
                • Secure payment processing
                • Regular security audits
                • Limited employee access to personal data
                • Secure data storage with access controls
              `
            },
            {
              title: "4. Data Sharing",
              content: `
                We do not sell your personal data. We may share information with:
                • Delivery partners (only necessary information)
                • Payment processors (for transaction completion)
                • Legal authorities (when required by law)
                • Service providers (under confidentiality agreements)
              `
            },
            {
              title: "5. Your Rights",
              content: `
                You have the right to:
                • Access your personal data
                • Correct inaccurate data
                • Request deletion of your data
                • Opt-out of marketing communications
                • Data portability
                • Withdraw consent at any time
              `
            },
            {
              title: "6. Cookies",
              content: `
                We use cookies to:
                • Remember your preferences
                • Analyze site traffic
                • Improve user experience
                • Enable shopping cart functionality
                You can control cookies through your browser settings.
              `
            },
            {
              title: "7. Children's Privacy",
              content: `
                Our services are not intended for children under 13. We do not 
                knowingly collect personal information from children under 13. 
                If you are a parent and believe your child has provided us with 
                personal information, please contact us.
              `
            },
            {
              title: "8. Changes to This Policy",
              content: `
                We may update our Privacy Policy periodically. We will notify 
                you of any changes by posting the new policy on this page and 
                updating the "Last updated" date.
              `
            },
            {
              title: "9. Contact Us",
              content: `
                If you have questions about this Privacy Policy, contact us at:
                Email: privacy@grocerystore.com
                Phone: +1 (555) 123-4567
                Address: 782 Jaffna Road, Chullipuram, Pannakam
              `
            }
          ].map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {section.title}
              </h2>
              <div className="text-gray-600 whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Consent Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Your Consent
          </h3>
          <p className="text-gray-600">
            By using our website and services, you consent to our Privacy Policy. 
            If you do not agree with any part of this policy, please do not use our services.
          </p>
        </div>

        {/* Back Links */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/terms"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg  transition-colors font-medium"
          >
            View Terms of Service →
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}