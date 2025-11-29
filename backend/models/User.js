import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  settings: {
    currency: {
      type: String,
      default: 'USD',
    },
    theme: {
      type: String,
      default: 'light',
    },
  },
});

export default mongoose.model('User', userSchema);
