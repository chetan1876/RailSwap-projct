const { DEFAULT_CHECKLIST_ITEMS } = require("./journey.constants");

/*
========================================
TRAVEL CHECKLIST ENGINE
========================================
*/

/**
 * Get default checklist items with unique IDs
 */
const getDefaultChecklist = () => {
  return DEFAULT_CHECKLIST_ITEMS.map((item, index) => ({
    id: `item_${Date.now()}_${index}`,
    text: item.text,
    category: item.category,
    isCompleted: item.isCompleted,
    createdAt: new Date().toISOString(),
  }));
};

/**
 * Format a single checklist item
 */
const createChecklistItem = (text, category = "General") => {
  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    text: text.trim(),
    category: category || "General",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Calculate checklist statistics
 */
const getChecklistStats = (items = []) => {
  const total = items.length;
  const completed = items.filter((i) => i.isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending: total - completed,
    percentage,
  };
};

module.exports = {
  getDefaultChecklist,
  createChecklistItem,
  getChecklistStats,
};
