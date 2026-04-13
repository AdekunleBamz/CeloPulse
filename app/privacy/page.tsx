'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen p-4 md:p-8 grid-bg relative overflow-hidden text-gray-200">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10 glass-cyber p-8 md:p-12 rounded-2xl">
        <Link href="/" className="text-teal-400 hover:text-teal-300 transition-colors mb-8 inline-block font-mono text-sm">
          ← Back to Dashboard
        </Link>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
        >
          Privacy Policy
        </motion.h1>

        <section className="space-y-6 text-gray-400 leading-relaxed">
          <p>
            Last Updated: April 13, 2026
          </p>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">1. Decentralized Architecture</h2>
            <p>
              CeloPulse is a decentralized application (dApp) built on the Celo blockchain. We do not operate traditional servers, 
              databases, or user accounts. All user data, activity logs, and scores are stored directly on the Celo blockchain 
              via smart contracts.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">2. Data Collection</h2>
            <p>
              We do not collect personal information such as names, email addresses, or IP addresses. The only data processed 
              is your public wallet address and the transaction data you broadcast to the Celo network. This data is public 
              by design of the blockchain.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">3. Cookies & Tracking</h2>
            <p>
              CeloPulse does not use tracking cookies or third-party analytics scripts. Your interaction with the 
              application is private and occurs purely between your browser and the Celo blockchain nodes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">4. Security</h2>
            <p>
              Security is handled by your choice of wallet provider (e.g., MiniPay). We never have access to your private 
              keys or seed phrases. You are solely responsible for the security of your digital assets.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">5. Changes to This Policy</h2>
            <p>
              As CeloPulse is an open-source tool, changes to this policy will be reflected in the repository 
              and updated on this page.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
