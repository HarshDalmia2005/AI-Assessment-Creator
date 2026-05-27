import { Router } from 'express';
import Assignment from '../models/Assignment';
import { addGenerationJob } from '../queues/generation.queue';

const router = Router();

// Create new assignment and queue for generation
router.post('/', async (req, res) => {
  try {
    const { title, dueDate, additionalInstructions, questionTypes } = req.body;

    const assignment = new Assignment({
      title,
      dueDate,
      additionalInstructions,
      questionTypes,
      status: 'pending'
    });

    await assignment.save();

    // Queue the generation job
    await addGenerationJob(assignment.id, {
      additionalInstructions,
      questionTypes
    });

    res.status(201).json({ success: true, assignmentId: assignment.id });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ success: false, error: 'Failed to create assignment' });
  }
});

// Fetch all assignments for dashboard
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).select('-generatedPaper');
    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assignments' });
  }
});

// Fetch specific assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assignment' });
  }
});

export default router;
