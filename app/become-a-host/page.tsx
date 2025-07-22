'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import EarningsCalculator from './components/EarningsCalculator';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const slideIn = {
  hidden: { x: 30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
};

export default function BecomeAHostPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[85vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Image 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Luxury home interior with ocean view" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Turn Your Property Into
              <span className="block text-blue-300">Income</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-100 mb-8 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of hosts earning passive income with AweNest Homes
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                href="#hosting-options" 
                className="px-8 py-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow-lg transition-all duration-200 text-center flex items-center justify-center"
              >
                Explore Hosting Options <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#calculator" 
                className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-500 font-semibold rounded-md shadow-lg transition-all duration-200 text-center"
              >
                Calculate Earnings
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2">Scroll to learn more</span>
            <svg className="w-6 h-6 text-white animate-bounce" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Hosting Options Section */}
      <section id="hosting-options" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Choose Your Hosting Journey
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer two flexible ways to host with AweNest Homes, designed to fit your lifestyle and preferences
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Option 1: Fully Managed */}
            <motion.div 
              className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
            >
              <div className="relative h-64">
                <Image 
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="AweNestHost Managed Property" 
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Hands-Off
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-blue-500 mr-2">
                    <StarIcon className="h-6 w-6 inline" />
                  </span>
                  AweNestHost Managed
                </h3>
                
                <p className="text-gray-600 mb-6">
                  We handle everything while you collect the revenue. Our full-service management takes care of your property from listing to guest service.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Professional property management',
                    'Guest communication & support',
                    'Cleaning & maintenance',
                    'Professional photography',
                    'Pricing optimization',
                    'Regular performance reports'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 font-medium">Commission</span>
                    <span className="text-gray-900 font-semibold">15-20%</span>
                  </div>
                  
                  <Link 
                    href="/become-a-host/managed-onboarding" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200 flex items-center justify-center"
                  >
                    Start Managed Hosting <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Option 2: Self Managed */}
            <motion.div 
              className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-64">
                <Image 
                  src="https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                  alt="Self-Managed Property" 
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  You Control
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-amber-500 mr-2">
                    <StarIcon className="h-6 w-6 inline" />
                  </span>
                  Self-Managed Listing
                </h3>
                
                <p className="text-gray-600 mb-6">
                  You handle the hosting while we provide the platform. Perfect for hands-on hosts who want more control but need our marketing reach.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Global visibility on AweNest platform',
                    'Booking management tools',
                    'Marketing & promotion',
                    'Payment processing',
                    'Lower commission rates',
                    'Host community & support'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 font-medium">Commission</span>
                    <span className="text-gray-900 font-semibold">3-5%</span>
                  </div>
                  
                  <Link 
                    href="/become-a-host/self-onboarding" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200 flex items-center justify-center"
                  >
                    Start Self-Managed Hosting <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <p className="text-gray-600 italic max-w-2xl mx-auto mb-16">
              Not sure which option is right for you? <Link href="/contact" className="text-blue-500 hover:text-blue-700 underline">Contact our team</Link> for personalized guidance.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-neutral-800 mb-3">Earn Extra Income</h3>
              <p className="text-neutral-600 leading-relaxed">
                Turn your extra space into extra income. Many hosts use their earnings to pay for home improvements, tuition, or special treats for themselves.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-neutral-800 mb-3">Meet New People</h3>
              <p className="text-neutral-600 leading-relaxed">
                Hosting helps you meet interesting people from around the world and make lasting connections.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-neutral-800 mb-3">Share Your Space</h3>
              <p className="text-neutral-600 leading-relaxed">
                Whether it's a spare room or an entire home, sharing your space allows others to experience your locality like a local.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-light text-neutral-800 text-center mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <span className="font-semibold">How hosting works</span>
          </motion.h2>
          
          <motion.p 
            className="text-neutral-600 text-center mb-16 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            Simple steps to start your hosting journey
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div className="text-center" variants={fadeIn}>
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-xl font-medium text-white">1</span>
              </motion.div>
              <h3 className="text-xl font-medium text-neutral-800 mb-3">List your space for free</h3>
              <p className="text-neutral-600 leading-relaxed">
                Share any space without sign-up charges, from a shared living room to a second home and everything in-between.
              </p>
            </motion.div>
            
            <motion.div className="text-center" variants={fadeIn}>
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-xl font-medium text-white">2</span>
              </motion.div>
              <h3 className="text-xl font-medium text-neutral-800 mb-3">Decide how you want to host</h3>
              <p className="text-neutral-600 leading-relaxed">
                Choose your own schedule, prices, and requirements for guests. We're there to help along the way.
              </p>
            </motion.div>
            
            <motion.div className="text-center" variants={fadeIn}>
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-xl font-medium text-white">3</span>
              </motion.div>
              <h3 className="text-xl font-medium text-neutral-800 mb-3">Welcome your first guest</h3>
              <p className="text-neutral-600 leading-relaxed">
                Once your listing is live, qualified guests can reach out. You can message them with any questions before their stay.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Earnings Calculator Section */}
      <section id="calculator" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Calculate Your <span className="text-blue-500">Earning Potential</span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Use our interactive calculator to see how much you could earn by hosting your property with AweNest Homes
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-200 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <span className="font-medium">$</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Estimate Your Earnings</h3>
              </div>
              <p className="text-gray-600 max-w-3xl leading-relaxed">
                Adjust the sliders below to match your property details and see your potential monthly and annual earnings.
                Our estimates are based on market data from similar properties in your area.
              </p>
            </div>
            
            <EarningsCalculator />
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                These estimates are based on average occupancy rates and pricing in popular destinations. 
                Actual earnings may vary based on location, seasonality, and property features.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about hosting with AweNest Homes
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: "How much does it cost to list my property?",
                answer: "There's no upfront cost to list your property on AweNest Homes. We only charge a commission when you receive bookings, which varies based on your chosen hosting model."
              },
              {
                question: "What if my property needs maintenance?",
                answer: "For AweNestHost managed properties, we handle all maintenance issues. For self-managed listings, you're responsible for property maintenance, but we can recommend trusted service providers in your area."
              },
              {
                question: "How do I get paid?",
                answer: "Payments are processed securely through our platform and transferred to your bank account 24 hours after guest check-in. You can track all your earnings in your host dashboard."
              },
              {
                question: "Can I block certain dates on my calendar?",
                answer: "Yes, you have full control over your calendar. You can block dates for personal use or maintenance at any time through your host dashboard."
              },
              {
                question: "What kind of support do hosts receive?",
                answer: "All hosts receive 24/7 support for urgent issues, access to our host community, and dedicated account managers. AweNestHost managed properties receive additional on-the-ground support."
              },
              {
                question: "How does AweNest Homes screen guests?",
                answer: "We verify all guest identities and use a comprehensive review system. Hosts can also set their own house rules and requirements for bookings."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                variants={fadeIn}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-400">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold text-white mb-6"
            variants={fadeIn}
          >
            Ready to Start Your Hosting Journey?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-blue-50 mb-10 max-w-3xl mx-auto"
            variants={fadeIn}
          >
            Join thousands of successful hosts on AweNest Homes and turn your property into a source of income.
          </motion.p>
          
          <motion.div className="flex flex-col sm:flex-row justify-center gap-4" variants={fadeIn}>
            <Link 
              href="/become-a-host/managed-onboarding" 
              className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-md shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              Start with AweNestHost <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            
            <Link 
              href="/become-a-host/self-onboarding" 
              className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md shadow-lg transition-all duration-200 flex items-center justify-center border border-blue-300"
            >
              Self-Managed Hosting <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
          
          <motion.p 
            className="text-blue-100 mt-8 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            Have questions? <Link href="/contact" className="text-white underline hover:text-blue-200">Contact our team</Link> for personalized guidance on getting started.
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}