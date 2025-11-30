import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

/**
 * GET /api/budget-plan/:userId
 * Generates AI budget plan for user's savings goals
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Call Python multi-goal planner
    const pythonProcess = spawn('python', [
      './ai_backend/budgetPlanner.py',
      userId
    ]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      try {
        if (code !== 0) {
          console.error('[PYTHON ERROR]', errorOutput);
          return res.status(500).json({
            success: false,
            error: 'Budget planning failed',
            details: errorOutput
          });
        }

        // Parse JSON output from Python
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return res.status(500).json({
            success: false,
            error: 'Invalid response from planning agent'
          });
        }

        const result = JSON.parse(jsonMatch[0]);
        res.json(result);
      } catch (err) {
        console.error('Failed to parse Python output:', err);
        res.status(500).json({
          success: false,
          error: 'Failed to parse budget plan',
          details: err.message
        });
      }
    });
  } catch (error) {
    console.error('[ERROR] Budget plan route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
