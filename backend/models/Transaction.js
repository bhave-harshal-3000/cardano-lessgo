import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  category: {
    type: String,
    required: true,
  },
  description: String,
  recipient: String,                    // From HTML parser
  paymentMethod: String,                // From HTML parser
  accountNumber: String,                // From HTML parser (masked)
  transactionId: String,                // From HTML parser
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Failed', 'Cancelled', 'Processing'],
    default: 'Completed',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  walletAddress: String,
  blockchainTxHash: String,
  tags: [String],
  UPI: {
    type: Number,
    enum: [0, 1],
    default: 0,
    description: '1 = HTML import from Google Pay, 0 = Manual text input',
  },
  UserInput: {
    type: Number,
    enum: [0, 1],
    default: 0,
    description: '1 = Manual text input, 0 = HTML import from Google Pay',
  },
  htmlFile: {
    content: String,        // Stores the HTML content
    fileName: String,        // Original file name
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
});

transactionSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Transaction', transactionSchema);
