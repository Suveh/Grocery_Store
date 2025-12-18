"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
<div className="bg-linear-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
             Terms of Service
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto opacity-90">
             Your trusted partner for fresh groceries since 2020
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <div className="relative h-64 lg:h-80 w-full rounded-xl overflow-hidden">
                <img
  src="/our-store.jpg"
  alt="Our Store"
  className="object-cover"
/>

              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2015, GroceryStore began as a small neighborhood shop 
                with a simple mission: to provide fresh, high-quality groceries 
                at affordable prices. What started as a single store has now 
                grown into a trusted online platform serving thousands of 
                satisfied customers.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we continue to uphold our founding principles while 
                embracing technology to bring convenience to your doorstep. 
                Our team is passionate about quality, freshness, and 
                exceptional customer service.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌱",
                title: "Freshness First",
                description: "We source directly from farmers and suppliers to ensure maximum freshness."
              },
              {
                icon: "💝",
                title: "Customer Happiness",
                description: "Your satisfaction is our top priority. We go the extra mile for you."
              },
              {
                icon: "💰",
                title: "Fair Pricing",
                description: "Quality products at honest prices, always."
              },
              {
                icon: "🚚",
                title: "Reliable Delivery",
                description: "On-time delivery with careful handling of your groceries."
              },
              {
                icon: "🤝",
                title: "Community Focus",
                description: "Supporting local farmers and businesses in our community."
              },
              {
                icon: "🌍",
                title: "Sustainability",
                description: "Eco-friendly packaging and responsible sourcing practices."
              },
            ].map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-linear-to-r  from-gray-800 to-gray-900 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "10,000+", label: "Happy Customers" },
              { number: "5,000+", label: "Products Available" },
              { number: "50+", label: "Local Suppliers" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Meet Our Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Arunasalam Sivalingam",
                role: "Founder & CEO",
                description: "With over 20 years in retail, Sivalingam leads our vision for quality and growth."
              },
              {
                name: "Sivalingam Thiruchelvy",
                role: "Operations Director",
                description: "Ensures smooth delivery and maintains our quality standards."
              },
              {
                name: "Sivalingam Thilakshan",
                role: "Head of Procurement",
                description: "Builds relationships with farmers and ensures the freshest produce."
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-linear-to-r from-cyan-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Contact Us
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}