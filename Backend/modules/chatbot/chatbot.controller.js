"use strict";

const chatbotService = require("./chatbot.service");

/*
========================================
SEND MESSAGE
========================================
*/

const sendMessage = async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: "userId and message are required",
      });
    }

    const data = await chatbotService.sendMessage({
      userId,
      sessionId,
      message,
    });

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
NEW CHAT
========================================
*/

const newChat = async (req, res) => {
  try {
    const { userId } = req.body;

    const session = await chatbotService.createChat(userId);

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
CHAT HISTORY
========================================
*/

const history = async (req, res) => {
  try {
    const sessions = await chatbotService.getHistory(req.params.userId);

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET CHAT
========================================
*/

const getChat = async (req, res) => {
  try {
    const messages = await chatbotService.getChat(req.params.sessionId);

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
RENAME CHAT
========================================
*/

const renameChat = async (req, res) => {
  try {
    const { sessionId, title } = req.body;

    await chatbotService.renameChat(sessionId, title);

    res.json({
      success: true,
      message: "Chat renamed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
DELETE CHAT
========================================
*/

const deleteChat = async (req, res) => {
  try {
    await chatbotService.deleteChat(req.params.sessionId);

    res.json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
CLEAR HISTORY
========================================
*/

const clearHistory = async (req, res) => {
  try {
    await chatbotService.clearHistory(req.params.userId);

    res.json({
      success: true,
      message: "History cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchHistory = async (req, res) => {
  try {
    const { userId, keyword } = req.query;

    const data = await chatbotService.searchHistory(userId, keyword);

    res.json({
      success: true,
      sessions: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  newChat,
  history,
  getChat,
  renameChat,
  deleteChat,
  clearHistory,
  searchHistory,
};
