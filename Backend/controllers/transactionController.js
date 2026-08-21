import Transaction from "../models/Transaction.js";

const createTransaction = async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      category,
      description,
      date,
    } = req.body;

    // Check required fields
    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.userId,
      title,
      amount,
      type,
      category,
      description,
      date,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Create Transaction Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.userId,
    }).sort({ date: -1 });

    res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.error("Get Transactions Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { createTransaction, getTransactions };