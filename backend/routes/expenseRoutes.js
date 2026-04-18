const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Add expense
router.post("/add", async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
});

// Get all expenses
router.get("/", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

// delete expense
router.delete("/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;