import React from 'react';
import { motion } from 'framer-motion';

// Barcode component
export const ReceiptBarcode: React.FC<{ value?: string; width?: number; margin?: string }> = ({ 
  value = '1234567890123', 
  width = 200,
  margin = '20px 0'
}) => {
  const bars = value.split('').map(() => ({
    width: Math.random() > 0.5 ? 3 : 2,
    gap: Math.random() > 0.5 ? 2 : 1,
  }));

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '8px',
      margin
    }}>
      <div style={{ 
        display: 'flex', 
        height: '60px', 
        gap: '1px',
        width: `${width}px`,
        justifyContent: 'center'
      }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              width: `${bar.width}px`,
              backgroundColor: '#000',
              marginRight: `${bar.gap}px`,
            }}
          />
        ))}
      </div>
      <div style={{ 
        fontSize: '10px', 
        letterSpacing: '3px',
        fontFamily: 'monospace',
        opacity: 0.6 
      }}>
        {value}
      </div>
    </div>
  );
};

// Dotted line divider
export const ReceiptDivider: React.FC<{ margin?: string }> = ({ margin = '20px 0' }) => (
  <div style={{ 
    width: '100%',
    height: '1px',
    backgroundImage: 'repeating-linear-gradient(to right, #000 0px, #000 4px, transparent 4px, transparent 8px)',
    margin,
    opacity: 0.3 
  }} />
);

// Receipt header with store info
export const ReceiptHeader: React.FC<{ 
  title?: string;
  subtitle?: string;
  session?: string;
}> = ({ 
  title = 'FINANCEBOT', 
  subtitle = 'AI-POWERED EXPENSE TRACKING',
  session 
}) => (
  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
    <div style={{ 
      fontSize: '24px', 
      fontWeight: 'bold', 
      letterSpacing: '4px',
      marginBottom: '8px' 
    }}>
      {title}
    </div>
    <div style={{ 
      fontSize: '12px', 
      letterSpacing: '2px',
      opacity: 0.6,
      marginBottom: '8px' 
    }}>
      {subtitle}
    </div>
    {session && (
      <div style={{ 
        fontSize: '10px', 
        opacity: 0.5,
        letterSpacing: '1px' 
      }}>
        SESSION #{session} • {new Date().toLocaleDateString()}
      </div>
    )}
    <ReceiptDivider margin="16px 0" />
  </div>
);

// Receipt line item
export const ReceiptLineItem: React.FC<{ 
  label: string;
  value: string;
  bold?: boolean;
}> = ({ label, value, bold = false }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: bold ? 'bold' : 'normal'
  }}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

// Receipt total section
export const ReceiptTotal: React.FC<{ 
  label?: string;
  amount: string;
}> = ({ label = 'TOTAL', amount }) => (
  <div style={{ marginTop: '16px' }}>
    <ReceiptDivider margin="12px 0" />
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      fontSize: '18px',
      fontWeight: 'bold',
      marginTop: '12px'
    }}>
      <span>{label}</span>
      <span>{amount}</span>
    </div>
    <ReceiptDivider margin="12px 0" />
  </div>
);

// Receipt footer
export const ReceiptFooter: React.FC<{ 
  message?: string;
}> = ({ message = 'THANK YOU!' }) => (
  <div style={{ 
    textAlign: 'center', 
    marginTop: '24px',
    fontSize: '12px',
    letterSpacing: '2px' 
  }}>
    <ReceiptDivider margin="16px 0 12px 0" />
    <div>{message}</div>
    <div style={{ 
      fontSize: '10px', 
      opacity: 0.5,
      marginTop: '8px',
      letterSpacing: '1px' 
    }}>
      POWERED BY CARDANO BLOCKCHAIN
    </div>
  </div>
);

// Perforated edge effect
export const PerforatedEdge: React.FC<{ position?: 'top' | 'bottom' }> = ({ 
  position = 'top' 
}) => (
  <div style={{
    position: 'absolute' as const,
    [position]: 0,
    left: 0,
    right: 0,
    height: '8px',
    backgroundImage: 'radial-gradient(circle, #f0f0ea 40%, transparent 40%)',
    backgroundSize: '16px 8px',
    backgroundRepeat: 'repeat-x',
    zIndex: 2,
  }} />
);

// Receipt stamp/seal
export const ReceiptStamp: React.FC<{ 
  text?: string;
  rotation?: number;
}> = ({ text = 'VERIFIED', rotation = -15 }) => (
  <motion.div
    initial={{ scale: 0, rotate: 0 }}
    animate={{ scale: 1, rotate: rotation }}
    transition={{ delay: 0.5, type: 'spring' }}
    style={{
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      border: '3px solid #000',
      borderRadius: '50%',
      padding: '12px 16px',
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '2px',
      opacity: 0.15,
      pointerEvents: 'none' as const,
    }}
  >
    {text}
  </motion.div>
);

// Receipt card wrapper
export const ReceiptCard: React.FC<{ 
  children: React.ReactNode;
  maxWidth?: string;
  withPerforations?: boolean;
}> = ({ children, maxWidth = '500px', withPerforations = false }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '24px',
    maxWidth,
    margin: '0 auto',
    position: 'relative' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }}>
    {withPerforations && (
      <>
        <PerforatedEdge position="top" />
        <PerforatedEdge position="bottom" />
      </>
    )}
    {children}
  </div>
);
