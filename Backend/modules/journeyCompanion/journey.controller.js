const journeyService = require("./journey.service");
const {
  validateCreateJourney,
  validateChecklistItem,
  validateNote,
  validateAIQuestion,
} = require("./journey.validation");

/*
========================================
CREATE JOURNEY
========================================
*/

const createJourney = async (req, res) => {
  try {
    const validation = validateCreateJourney(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(" "),
      });
    }

    const journey = await journeyService.createJourney(req.body);

    res.status(201).json({
      success: true,
      message: "Journey created successfully",
      data: journey,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create journey",
    });
  }
};

/*
========================================
GET USER JOURNEYS
========================================
*/

const getJourneys = async (req, res) => {
  try {
    const { userId } = req.params;
    const journeys = await journeyService.getJourneys(userId || "default_user");

    res.status(200).json({
      success: true,
      data: journeys,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user journeys",
    });
  }
};

/*
========================================
GET JOURNEY DETAILS
========================================
*/

const getJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const journey = await journeyService.getJourney(journeyId);

    res.status(200).json({
      success: true,
      data: journey,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch journey details",
    });
  }
};

/*
========================================
UPDATE JOURNEY
========================================
*/

const updateJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const updatedJourney = await journeyService.updateJourney(
      journeyId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Journey updated successfully",
      data: updatedJourney,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update journey",
    });
  }
};

/*
========================================
DELETE JOURNEY
========================================
*/

const deleteJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const result = await journeyService.deleteJourney(journeyId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete journey",
    });
  }
};

/*
========================================
SEARCH TRAIN OR PNR
========================================
*/

const searchTrainOrPNR = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await journeyService.searchTrainOrPNR(query);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Search failed",
    });
  }
};

/*
========================================
SMART AI ASSISTANT Q&A
========================================
*/

const askAIAssistant = async (req, res) => {
  try {
    const validation = validateAIQuestion(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(" "),
      });
    }

    const { journeyId, question } = req.body;
    const answer = await journeyService.answerAIAssistantQuestion(
      journeyId,
      question,
    );

    res.status(200).json({
      success: true,
      question,
      answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "AI Assistant failed to generate answer",
    });
  }
};

/*
========================================
AI JOURNEY TIPS
========================================
*/

const getJourneyTips = async (req, res) => {
  try {
    const tips = await journeyService.getJourneyTips(req.body);

    res.status(200).json({
      success: true,
      tips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch journey tips",
    });
  }
};

/*
========================================
CHECKLIST HANDLERS
========================================
*/

const addChecklistItem = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const validation = validateChecklistItem(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(" "),
      });
    }

    const checklist = await journeyService.addChecklistItem(
      journeyId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Checklist item added",
      data: checklist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add checklist item",
    });
  }
};

const toggleChecklistItem = async (req, res) => {
  try {
    const { journeyId, itemId } = req.params;
    const checklist = await journeyService.toggleChecklistItem(
      journeyId,
      itemId,
    );

    res.status(200).json({
      success: true,
      data: checklist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update checklist item",
    });
  }
};

const deleteChecklistItem = async (req, res) => {
  try {
    const { journeyId, itemId } = req.params;
    const checklist = await journeyService.deleteChecklistItem(
      journeyId,
      itemId,
    );

    res.status(200).json({
      success: true,
      data: checklist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete checklist item",
    });
  }
};

/*
========================================
NOTES HANDLERS
========================================
*/

const addJourneyNote = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const validation = validateNote(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(" "),
      });
    }

    const notes = await journeyService.addJourneyNote(journeyId, req.body);

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add note",
    });
  }
};

const togglePinNote = async (req, res) => {
  try {
    const { journeyId, noteId } = req.params;
    const notes = await journeyService.togglePinNote(journeyId, noteId);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update note pin status",
    });
  }
};

const deleteJourneyNote = async (req, res) => {
  try {
    const { journeyId, noteId } = req.params;
    const notes = await journeyService.deleteJourneyNote(journeyId, noteId);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete note",
    });
  }
};

/*
========================================
ANALYTICS & MEMORIES HANDLERS
========================================
*/

const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = await journeyService.getUserAnalytics(
      userId || "default_user",
    );

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch analytics",
    });
  }
};

const saveJourneyMemory = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const updated = await journeyService.saveJourneyMemory(journeyId, req.body);

    res.status(200).json({
      success: true,
      message: "Journey memory saved",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to save journey memory",
    });
  }
};

module.exports = {
  createJourney,
  getJourneys,
  getJourney,
  updateJourney,
  deleteJourney,
  searchTrainOrPNR,
  askAIAssistant,
  getJourneyTips,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  addJourneyNote,
  togglePinNote,
  deleteJourneyNote,
  getUserAnalytics,
  saveJourneyMemory,
};
