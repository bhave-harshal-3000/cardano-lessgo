import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, Brain, TrendingUp, Lock, Users } from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();

  const receiptStyles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fafaf8 0%, #f0f0ea 100%)',
      fontFamily: "'Courier Prime', 'Courier New', Courier, monospace",
      position: 'relative' as const,
      color: '#000000',
      padding: '40px 20px',
    },
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      background: 'transparent',
      border: '2px solid #000',
      fontSize: '14px',
      fontFamily: "'Courier New', Courier, monospace",
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      letterSpacing: '1px',
      marginBottom: '40px',
      transition: 'all 0.3s',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '60px',
    },
    title: {
      fontSize: '48px',
      fontWeight: 'bold' as const,
      letterSpacing: '4px',
      marginBottom: '16px',
    },
    subtitle: {
      fontSize: '18px',
      opacity: 0.7,
      letterSpacing: '1px',
    },
    divider: {
      borderTop: '2px dashed rgba(0,0,0,0.15)',
      margin: '40px 0',
    },
    section: {
      background: '#fff',
      padding: '40px',
      marginBottom: '32px',
      border: '2px solid rgba(0,0,0,0.1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    sectionTitle: {
      fontSize: '28px',
      fontWeight: 'bold' as const,
      letterSpacing: '2px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    sectionText: {
      fontSize: '16px',
      lineHeight: '1.8',
      opacity: 0.8,
      marginBottom: '16px',
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginTop: '32px',
    },
    featureCard: {
      background: '#fafaf8',
      padding: '24px',
      border: '1px dashed rgba(0,0,0,0.2)',
    },
    featureTitle: {
      fontSize: '18px',
      fontWeight: 'bold' as const,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    featureText: {
      fontSize: '14px',
      lineHeight: '1.6',
      opacity: 0.7,
    },
    techStack: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '12px',
      marginTop: '20px',
    },
    techBadge: {
      padding: '8px 16px',
      background: '#000',
      color: '#fff',
      fontSize: '12px',
      fontWeight: 'bold' as const,
      letterSpacing: '1px',
    },
  };

  return (
    <div style={receiptStyles.page}>
      <div style={receiptStyles.container}>
        <motion.button
          style={receiptStyles.backButton}
          whileHover={{ scale: 1.05, background: '#000', color: '#fff' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          BACK TO HOME
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={receiptStyles.header}
        >
          <h1 style={receiptStyles.title}>ABOUT FINANCEBOT</h1>
          <p style={receiptStyles.subtitle}>
            AI-Powered Financial Management on Cardano Blockchain
          </p>
        </motion.div>

        <div style={receiptStyles.divider} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={receiptStyles.section}
        >
          <h2 style={receiptStyles.sectionTitle}>
            <Brain size={32} />
            OUR MISSION
          </h2>
          <p style={receiptStyles.sectionText}>
            FinanceBot revolutionizes personal finance management by combining the power of artificial intelligence with blockchain technology. Our mission is to make financial planning accessible, transparent, and intelligent for everyone.
          </p>
          <p style={receiptStyles.sectionText}>
            Built on the Cardano blockchain and powered by Hydra Layer 2, we provide instant, secure, and verifiable financial insights that help you make smarter money decisions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={receiptStyles.section}
        >
          <h2 style={receiptStyles.sectionTitle}>
            <Zap size={32} />
            WHAT WE OFFER
          </h2>
          <div style={receiptStyles.featureGrid}>
            <div style={receiptStyles.featureCard}>
              <h3 style={receiptStyles.featureTitle}>
                <Shield size={20} />
                Blockchain Security
              </h3>
              <p style={receiptStyles.featureText}>
                All your financial decisions are stored as immutable proofs on Cardano, ensuring complete transparency and auditability.
              </p>
            </div>
            <div style={receiptStyles.featureCard}>
              <h3 style={receiptStyles.featureTitle}>
                <Brain size={20} />
                AI-Powered Insights
              </h3>
              <p style={receiptStyles.featureText}>
                Advanced machine learning analyzes your spending patterns and provides personalized recommendations to optimize your budget.
              </p>
            </div>
            <div style={receiptStyles.featureCard}>
              <h3 style={receiptStyles.featureTitle}>
                <TrendingUp size={20} />
                Smart Budgeting
              </h3>
              <p style={receiptStyles.featureText}>
                Dynamic budget adjustments based on your financial goals, spending behavior, and real-time market conditions.
              </p>
            </div>
            <div style={receiptStyles.featureCard}>
              <h3 style={receiptStyles.featureTitle}>
                <Lock size={20} />
                Privacy First
              </h3>
              <p style={receiptStyles.featureText}>
                Your data remains private and secure. You control what information is shared with AI agents and the blockchain.
              </p>
            </div>
            <div style={receiptStyles.featureCard}>
              <h3 style={receiptStyles.featureTitle}>
                <Zap size={20} />
                Lightning Fast
              </h3>
              <p style={receiptStyles.featureText}>
                Powered by Hydra L2 for instant transactions and real-time budget optimization without compromising security.
              </p>
            </div>
            <div style={receiptStyles.featureCard}>
              <h3 style={receiptStyles.featureTitle}>
                <Users size={20} />
                Multi-Agent System
              </h3>
              <p style={receiptStyles.featureText}>
                Deploy specialized AI agents for different financial tasks - budgeting, savings, investments, and expense tracking.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={receiptStyles.section}
        >
          <h2 style={receiptStyles.sectionTitle}>
            <Shield size={32} />
            TECHNOLOGY STACK
          </h2>
          <p style={receiptStyles.sectionText}>
            FinanceBot is built with cutting-edge technologies to ensure security, performance, and scalability:
          </p>
          <div style={receiptStyles.techStack}>
            <span style={receiptStyles.techBadge}>CARDANO BLOCKCHAIN</span>
            <span style={receiptStyles.techBadge}>HYDRA LAYER 2</span>
            <span style={receiptStyles.techBadge}>AI/ML MODELS</span>
            <span style={receiptStyles.techBadge}>REACT</span>
            <span style={receiptStyles.techBadge}>TYPESCRIPT</span>
            <span style={receiptStyles.techBadge}>FRAMER MOTION</span>
            <span style={receiptStyles.techBadge}>SMART CONTRACTS</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={receiptStyles.section}
        >
          <h2 style={receiptStyles.sectionTitle}>WHY CHOOSE US?</h2>
          <p style={receiptStyles.sectionText}>
            ✓ <strong>100% Free</strong> - No hidden fees, no subscriptions, completely free to use
          </p>
          <p style={receiptStyles.sectionText}>
            ✓ <strong>Transparent</strong> - All AI decisions are recorded on-chain for verification
          </p>
          <p style={receiptStyles.sectionText}>
            ✓ <strong>Secure</strong> - Built on Cardano's proven blockchain infrastructure
          </p>
          <p style={receiptStyles.sectionText}>
            ✓ <strong>Intelligent</strong> - Advanced AI learns from your financial behavior
          </p>
          <p style={receiptStyles.sectionText}>
            ✓ <strong>Fast</strong> - Hydra L2 ensures instant transaction processing
          </p>
          <p style={receiptStyles.sectionText}>
            ✓ <strong>Privacy-Focused</strong> - You control your data, always
          </p>
        </motion.div>

        <div style={receiptStyles.divider} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ textAlign: 'center' as const, marginTop: '40px' }}
        >
          <p style={{ fontSize: '16px', opacity: 0.6, marginBottom: '24px' }}>
            READY TO TAKE CONTROL OF YOUR FINANCES?
          </p>
          <motion.button
            style={{
              padding: '18px 48px',
              background: '#000',
              color: '#fff',
              border: '3px solid #000',
              fontSize: '16px',
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 'bold' as const,
              cursor: 'pointer',
              letterSpacing: '2px',
            }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/onboard')}
          >
            GET STARTED NOW →
          </motion.button>
        </motion.div>

        <div style={{ textAlign: 'center' as const, marginTop: '60px', fontSize: '12px', opacity: 0.4 }}>
          © 2025 FinanceBot • Built with ❤️ on Cardano
        </div>
      </div>
    </div>
  );
};
