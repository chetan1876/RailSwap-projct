/*
========================================
JOURNEY NOTES ENGINE
========================================
*/

/**
 * Create a structured journey note object
 */
const createNote = ({
  title,
  content,
  category = "General",
  isPinned = false,
}) => {
  return {
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    title: title ? title.trim() : "Journey Note",
    content: content ? content.trim() : "",
    category: category || "General",
    isPinned: Boolean(isPinned),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Filter & sort notes (pinned first, then newest)
 */
const processNotesList = (notes = []) => {
  return [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

module.exports = {
  createNote,
  processNotesList,
};
