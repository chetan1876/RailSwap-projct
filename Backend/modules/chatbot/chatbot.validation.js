"use strict";

const validateChat = (req, res, next) => {
  const { userId, message } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "message is required",
    });
  }

  if (typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "message must be string",
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "message cannot be empty",
    });
  }

  if (message.length > 4000) {
    return res.status(400).json({
      success: false,
      message: "message too long",
    });
  }

  next();
};

module.exports = {
  validateChat,
};
