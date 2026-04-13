'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <main className="min-h-screen p-4 md:p-8 grid-bg relative overflow-hidden text-gray-200">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10 glass-cyber p-8 md:p-12 rounded-2xl">
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 transition-colors mb-8 inline-block font-mono text-sm">
          ← Back to Dashboard
        </Link>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
        >
          Terms of Service
        </motion.h1>

        <section className="space-y-6 text-gray-400 leading-relaxed">
          <p>
            Last Updated: April 13, 2026
          </p>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing CeloPulse, you agree to be bound by these Terms of Service. This is a decentralized 
              software tool provided "as-is" without any warranties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">2. Non-Custodial Nature</h2>
            <p>
              CeloPulse does not store, send, or receive digital assets. All transactions take place on 
              the Celo blockchain through your own wallet. We have no control over your funds or transactions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">3. Risk Acknowledgement</h2>
            <p>
              Blockchain transactions are irreversible. You acknowledge the risks associated with using 
              decentralized software and smart contracts. We are not liable for any losses caused by 
              smart contract interactions or market volatility.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">4. No Financial Advice</h2>
            <p>
              The Activity Score and Rewards systems are intended for engagement and tracking purposes. 
              Nothing in this application constitutes financial or investment advice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">5. Termination</h2>
            <p>
              As a decentralized tool, you can stop using CeloPulse at any time. We cannot block 
              access to the smart contracts, which exist independently on the blockchain.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
