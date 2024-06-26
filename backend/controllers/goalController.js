const asyncHandler = require('express-async-handler');

const Goal = require('../models/goalModel');
const User = require('../models/userModel');
const { registerUser } = require('./userController');

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user._id });
    res.status(200).json(goals);
});

const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Please add text field');
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user._id,
    });

    res.status(200).json(goal);
});

const updateGoal = asyncHandler(async (req, res) => {
    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    const user = await User.findById(req.user._id);
    if (!req.user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    res.status(200).json(updatedGoal);
});

const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }


    if (!req.user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: `Deleted goal ${req.params.id}` });
});

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
};
