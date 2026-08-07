"use strict";

const repository = require("./chatbot.repository");
const { getGeminiClient } = require("../../config/gemini");
const { SYSTEM_PROMPT } = require("./chatbot.prompts");
const { MODEL, ROLES, MAX_HISTORY } = require("./chatbot.constants");

/*
========================================
GENERATE CHAT TITLE
========================================
*/
const generateChatTitle = async (message) => {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: MODEL,
    });

    const prompt = `
Generate a very short chat title (maximum 5 words).

User message:
"${message}"

Only return the title.
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim() || "New Chat";
  } catch (error) {
    console.error(
      "Failed to generate chat title, falling back to default:",
      error,
    );
    return "New Chat";
  }
};

/*
========================================
SEND MESSAGE
========================================
*/
const sendMessage = async ({ userId, sessionId, message }) => {
  let session = null;

  if (!sessionId || sessionId === "null" || sessionId === "undefined") {
    const title = await generateChatTitle(message);
    session = await repository.createSession(userId, title);
    sessionId = session.id;
  } else {
    session = await repository.getSession(sessionId);
    if (!session) {
      throw new Error("Chat session not found");
    }
  }

  const history = await repository.getMessages(sessionId);

  // Filter messages to construct a strict alternating roles array: [user, model, user, model...]
  // In @google/generative-ai, history MUST alternate and must start with 'user' and end with 'model'.
  const filtered = [];
  let expectedRole = "user";
  for (const msg of history) {
    const role = msg.role === ROLES.USER ? "user" : "model";
    if (role === expectedRole) {
      filtered.push({
        role,
        parts: [{ text: msg.content || "" }],
      });
      expectedRole = expectedRole === "user" ? "model" : "user";
    }
  }

  // If the last element is 'user', remove it because the new message we're sending is 'user'
  if (filtered.length > 0 && filtered[filtered.length - 1].role === "user") {
    filtered.pop();
  }

  // Ensure slice length is even for matching user/model pairs
  let sliceCount = MAX_HISTORY;
  if (sliceCount % 2 !== 0) {
    sliceCount--;
  }
  const formattedHistory = filtered.slice(-sliceCount);

  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });

  const chat = model.startChat({
    history: formattedHistory,
  });

  let reply;
  try {
    const TIMEOUT_MS = 30000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Gemini AI request timed out after 30 seconds. Please try again.")),
        TIMEOUT_MS
      )
    );
    const result = await Promise.race([chat.sendMessage(message), timeoutPromise]);
    reply = result.response.text().trim();
  } catch (geminiError) {
    const msg = geminiError.message || "";

    if (msg.includes("GEMINI_API_KEY is not configured") || msg.includes("GEMINI_API_KEY")) {
      throw new Error("Gemini API key is missing. Add GEMINI_API_KEY to your .env file. Get a free key at https://aistudio.google.com/apikey");
    }
    if (msg.includes("API_KEY_INVALID") || msg.includes("invalid api key") || msg.includes("API key not valid")) {
      throw new Error("Invalid Gemini API key. Please check your GEMINI_API_KEY in the .env file.");
    }
    if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota") || msg.includes("429")) {
      throw new Error("Gemini API quota exceeded. Please wait or upgrade your plan at https://aistudio.google.com");
    }
    if (msg.includes("models/") && (msg.includes("not found") || msg.includes("404"))) {
      throw new Error("Gemini model not found. The configured model may be unsupported or unavailable in your region.");
    }
    if (msg.includes("not found") && msg.includes("404")) {
      throw new Error("Gemini API returned 404. The model may be unavailable or your API key may not have access.");
    }
    if (msg.includes("timed out")) {
      throw new Error("Gemini AI request timed out after 30 seconds. Please try again.");
    }
    if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND") || msg.includes("ETIMEDOUT") || msg.includes("network")) {
      throw new Error("Network error: Unable to reach the Gemini AI service. Check your internet connection.");
    }
    if (msg.includes("SERVICE_UNAVAILABLE") || msg.includes("503")) {
      throw new Error("Gemini AI service is temporarily unavailable. Please try again shortly.");
    }
    // Re-throw exact error for any unclassified case
    throw new Error(geminiError.message || "Gemini AI call failed. Please try again.");
  }

  // Save the user message and then the AI response
  await repository.saveMessage(sessionId, ROLES.USER, message);
  await repository.saveMessage(sessionId, ROLES.ASSISTANT, reply);

  return {
    sessionId,
    reply,
  };
};

/*
========================================
NEW CHAT
========================================
*/
const createChat = async (userId) => {
  return await repository.createSession(userId, "New Chat");
};

/*
========================================
GET HISTORY
========================================
*/
const getHistory = async (userId) => {
  return await repository.getSessions(userId);
};

/*
========================================
GET CHAT
========================================
*/
const getChat = async (sessionId) => {
  return await repository.getMessages(sessionId);
};

/*
========================================
RENAME CHAT
========================================
*/
const renameChat = async (sessionId, title) => {
  await repository.renameSession(sessionId, title);
};

/*
========================================
DELETE CHAT
========================================
*/
const deleteChat = async (sessionId) => {
  await repository.deleteSession(sessionId);
};

/*
========================================
CLEAR HISTORY
========================================
*/
const clearHistory = async (userId) => {
  await repository.clearHistory(userId);
};

/*
========================================
SEARCH HISTORY
========================================
*/
const searchHistory = async (userId, keyword) => {
  return await repository.searchChats(userId, keyword);
};

module.exports = {
  sendMessage,
  createChat,
  getHistory,
  getChat,
  renameChat,
  deleteChat,
  clearHistory,
  searchHistory,
};
