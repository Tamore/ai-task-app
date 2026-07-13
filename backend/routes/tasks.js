const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const { connection } = require('../config/redis');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { title, inputText, operationType } = req.body;
    
    // Create Task Record in MongoDB
    const task = await Task.create({
      user: req.user.id,
      title,
      inputText,
      operationType,
      status: 'Pending'
    });

    // Push task to Redis Queue
    await connection.lpush('ai-tasks-queue', JSON.stringify({
      taskId: task._id,
      inputText,
      operationType
    }));

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
