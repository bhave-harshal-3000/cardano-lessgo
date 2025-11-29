import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or get user
router.post('/', async (req, res) => {
  try {
    let user = await User.findOne({ walletAddress: req.body.walletAddress });
    
    if (!user) {
      user = new User(req.body);
      await user.save();
    }
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
