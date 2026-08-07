/*
========================================
JOURNEY COMPANION VALIDATION
========================================
*/

/**
 * Validate Journey Creation Payload
 */
const validateCreateJourney = (data) => {
  const errors = [];

  if (!data) {
    return { isValid: false, errors: ["Request payload is missing"] };
  }

  const hasIdentifier =
    (data.trainNumber && data.trainNumber.trim()) ||
    (data.pnr && data.pnr.trim()) ||
    (data.trainName && data.trainName.trim()) ||
    (data.from && data.to);

  if (!hasIdentifier) {
    errors.push(
      "Please provide a Train Number, PNR, Train Name, or Source and Destination stations.",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Checklist Item Payload
 */
const validateChecklistItem = (data) => {
  const errors = [];

  if (!data || !data.text || !data.text.trim()) {
    errors.push("Checklist item text is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Note Payload
 */
const validateNote = (data) => {
  const errors = [];

  if (!data || (!data.content && !data.title)) {
    errors.push("Note title or content is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate AI Assistant Question Payload
 */
const validateAIQuestion = (data) => {
  const errors = [];

  if (!data || !data.question || !data.question.trim()) {
    errors.push("Question is required for AI Assistant.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateCreateJourney,
  validateChecklistItem,
  validateNote,
  validateAIQuestion,
};
