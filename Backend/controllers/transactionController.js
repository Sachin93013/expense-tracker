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

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction fetched successfully",
      transaction,
    });
  } catch (error) {
    console.error("Get Transaction Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete Transaction Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { createTransaction, getTransactions,getTransactionById,deleteTransaction };