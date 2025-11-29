import express from 'express';
import Savings from '../models/Savings.js';

const router = express.Router();

// Get all savings goals for a user
router.get('/:userId', async (req, res) => {
  try {
    const savings = await Savings.find({ userId: req.params.userId });
    res.json(savings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new savings goal
router.post('/', async (req, res) => {
  try {
    const savings = new Savings(req.body);
    await savings.save();
    res.status(201).json(savings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update savings goal
router.put('/:id', async (req, res) => {
  try {
    const savings = await Savings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(savings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete savings goal
router.delete('/:id', async (req, res) => {
  try {
    await Savings.findByIdAndDelete(req.params.id);
    res.json({ message: 'Savings goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
