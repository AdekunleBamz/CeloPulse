# CeloPulse

**CeloPulse** is a real-time blockchain activity dashboard designed for the Celo ecosystem. It provides users with a clean, high-performance interface to track their on-chain interactions, monitor ecosystem engagement, and visualized progress through a dynamic achievement system.

Optimized for **MiniPay**, CeloPulse delivers a premium mobile experience with implicit wallet connection and fee-abstracted transactions.

## 🌟 Key Features

-   **Real-time Activity Tracking**: Monitor your on-chain heartbeats with a live dashboard and event stream.
-   **Engagement Analytics**: Dynamic streak tracking and activity scoring based on ecosystem participation.
-   **Automated Milestone Rewards**: A smart contract-driven achievement system that recognizes long-term consistency.
-   **MiniPay Native UX**: Fully automated connection, legacy transaction support, and native USDm fee currency integration.
-   **Privacy-First Architecture**: No centralized databases. All activity is decentralized and verified directly on the Celo blockchain.

## 🛠 Tech Stack

-   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion.
-   **Web3 Integration**: Wagmi, Viem, RainbowKit.
-   **Blockchain**: Celo (Mainnet/Alfajores).
-   **Contracts**: Solidity-based Activity Engines with automated reward distribution.
-   **Testing**: Vitest for unit and integration tests.

## 🚀 Getting Started

### Prerequisites

-   Node.js 18.18+ (or Node.js 20+)
-   A Celo-compatible wallet (MiniPay recommended)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/adekunlebamz/CeloPulse.git
    cd CeloPulse
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_CELOPULSE_CONTRACT=0x... # Your deployed contract address
    NEXT_PUBLIC_APP_URL=https://celopulse-v2.vercel.app
    NEXT_PUBLIC_CHAIN_ID=42220 # Use 42220 for mainnet or 11142220 for Celo Sepolia
    NEXT_PUBLIC_MINIPAY_FEE_CURRENCY=0x... # Optional override for MiniPay fee token
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    npm run lint
    ```

## 🏗 Smart Contract logic

CeloPulse utilizes a custom Activity Engine that handles:
-   **Check-ins**: Verifying daily user presence.
-   **Task Completion**: Tracking specific ecosystem actions.
-   **Staking Mechanics**: Allowing users to commit to their activity scores for boosted visibility.
-   **Reward Compounding**: Automated calculations of engagement-based incentives.

## 🧩 Troubleshooting

-   **Contract reads fail**: Confirm `NEXT_PUBLIC_CELOPULSE_CONTRACT` is a full 42-character EVM address.
-   **MiniPay tx stuck**: Make sure `NEXT_PUBLIC_CHAIN_ID` matches the wallet network inside MiniPay.
-   **Blank screen on launch**: Ensure `NEXT_PUBLIC_APP_URL` is set correctly; hydration mismatches can cause blank webviews.

## 🔐 Security

-   Never commit `.env.local` or share production fee-currency override addresses from private environments.

## 📜 Licensing & Terms

CeloPulse is open-source. Please refer to the `/privacy` and `/terms` routes within the application for standard decentralized usage policies.
