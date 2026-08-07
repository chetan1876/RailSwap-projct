'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');

let _client = null;
let _cachedKey = null;

/**
 * Returns a GoogleGenerativeAI client using the GEMINI_API_KEY from environment.
 * The client is re-created whenever the key changes (prevents stale OAuth token issues).
 * @returns {GoogleGenerativeAI}
 */
const getGeminiClient = () => {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Add GEMINI_API_KEY=your_key to .env file. ' +
      'Get a free key at https://aistudio.google.com/apikey'
    );
  }

  // Detect common mistake: OAuth2 access tokens start with "AQ." or "ya29."
  // Valid Gemini API keys start with "AIza"
  if (!apiKey.startsWith('AIza')) {
    throw new Error(
      'GEMINI_API_KEY appears to be an OAuth2 token, not a Gemini API key. ' +
      'Gemini API keys start with "AIza". ' +
      'Get a valid key at https://aistudio.google.com/apikey and set it in backend/.env as GEMINI_API_KEY=AIza...'
    );
  }

  // Re-create client only when key actually changes (supports key rotation)
  if (!_client || _cachedKey !== apiKey) {
    _client = new GoogleGenerativeAI(apiKey);
    _cachedKey = apiKey;
  }

  return _client;
};

/**
 * Reset the cached client (useful for key rotation or tests).
 */
const resetGeminiClient = () => {
  _client = null;
  _cachedKey = null;
};

module.exports = { getGeminiClient, resetGeminiClient };
