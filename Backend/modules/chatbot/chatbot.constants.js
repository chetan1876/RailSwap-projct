"use strict";

module.exports = {
  COLLECTIONS: {
    SESSIONS: "chat_sessions",
    MESSAGES: "chat_messages",
  },

  ROLES: {
    USER: "user",
    ASSISTANT: "assistant",
    SYSTEM: "system",
  },

  MODEL: "gemini-2.0-flash",

  MAX_HISTORY: 20,

  MAX_MESSAGE_LENGTH: 4000,

  TITLE_MAX_LENGTH: 40,

  DEFAULT_TITLE: "New Chat",
};
