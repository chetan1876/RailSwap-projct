const journeyRepository = require("./journey.repository");
const { getGeminiClient } = require("../../config/gemini");
const {
  searchPresetTrains,
  generateMockPNRDetails,
  calculateJourneyProgress,
} = require("./journey.utils");
const { buildJourneyTimeline } = require("./journey.timeline");
const {
  getDefaultChecklist,
  createChecklistItem,
  getChecklistStats,
} = require("./journey.checklist");
const { createNote, processNotesList } = require("./journey.notes");
const { generateJourneyReminders } = require("./journey.notifications");
const { computeUserAnalytics } = require("./journey.analytics");
const { JOURNEY_STATUS, PRESET_TRAINS } = require("./journey.constants");

const MODEL_NAME = "gemini-flash-latest";

/*
========================================
CREATE / SEARCH JOURNEY
========================================
*/

const createJourney = async (journeyData) => {
  let initialData = { ...journeyData };

  // If user provided a PNR, search/populate details automatically
  if (journeyData.pnr && (!journeyData.trainName || !journeyData.from)) {
    const pnrDetails = generateMockPNRDetails(journeyData.pnr);
    initialData = { ...pnrDetails, ...journeyData };
  }

  // If train number was provided and matches preset, enrich details
  if (journeyData.trainNumber && (!journeyData.from || !journeyData.to)) {
    const preset = PRESET_TRAINS.find(
      (t) => t.trainNumber === String(journeyData.trainNumber).trim(),
    );
    if (preset) {
      initialData = {
        trainName: preset.trainName,
        from: preset.from,
        to: preset.to,
        departureTime: preset.departureTime,
        arrivalTime: preset.arrivalTime,
        totalDistanceKm: preset.totalDistanceKm,
        ...initialData,
      };
    }
  }

  // Ensure default checklist and status
  if (!initialData.checklist || initialData.checklist.length === 0) {
    initialData.checklist = getDefaultChecklist();
  }

  if (!initialData.status) {
    initialData.status = JOURNEY_STATUS.IN_TRANSIT;
  }

  if (initialData.progress === undefined) {
    initialData.progress = calculateJourneyProgress(initialData);
  }

  const id = await journeyRepository.createJourney(initialData);
  return await journeyRepository.getJourneyById(id);
};

/*
========================================
GET USER JOURNEYS & DETAILS
========================================
*/

const getJourneys = async (userId) => {
  return await journeyRepository.getJourneysByUser(userId);
};

const getJourney = async (journeyId) => {
  const journey = await journeyRepository.getJourneyById(journeyId);
  if (!journey) {
    throw new Error("Journey not found");
  }

  // Attach live calculated properties
  const timeline = buildJourneyTimeline(journey);
  const reminders = generateJourneyReminders(journey);
  const checklistStats = getChecklistStats(journey.checklist || []);

  return {
    ...journey,
    timeline,
    reminders,
    checklistStats,
  };
};

/*
========================================
UPDATE & DELETE JOURNEY
========================================
*/

const updateJourney = async (journeyId, updateData) => {
  return await journeyRepository.updateJourney(journeyId, updateData);
};

const deleteJourney = async (journeyId) => {
  await journeyRepository.deleteJourney(journeyId);
  return { message: "Journey deleted successfully" };
};

/*
========================================
SEARCH TRAINS & PNR
========================================
*/

const searchTrainOrPNR = async (query) => {
  if (!query) return { trains: PRESET_TRAINS };

  const q = String(query).trim();

  // If 10-digit number, treat as PNR
  if (/^\d{10}$/.test(q)) {
    const pnrData = generateMockPNRDetails(q);
    return { isPNR: true, pnrData, trains: [pnrData] };
  }

  const matched = searchPresetTrains(q);
  return { isPNR: false, trains: matched };
};

/*
========================================
SMART AI ASSISTANT (Q&A)
========================================
*/

const answerAIAssistantQuestion = async (journeyId, question) => {
  let journey = null;
  if (journeyId) {
    journey = await journeyRepository.getJourneyById(journeyId);
  }

  if (!journey) {
    const defaultJourneys =
      await journeyRepository.getJourneysByUser("default_user");
    journey = defaultJourneys[0] || generateMockPNRDetails("2849104829");
  }

  const timeline = buildJourneyTimeline(journey);
  const currentProgress = timeline.progress;
  const currentStation = timeline.currentStation.name;
  const nextStation = timeline.nextStation.name;
  const etaNext = timeline.nextStation.time;

  // Try Gemini API first
  try {
    const client = getGeminiClient();
    if (client) {
      const model = client.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `
You are RailSwap AI Journey Companion, a helpful Indian Railways travel assistant.
The passenger is on journey:
- Train: ${journey.trainName} (${journey.trainNumber})
- Coach/Seat: ${journey.coach}-${journey.seat}
- From: ${journey.from} to ${journey.to}
- Current Progress: ${currentProgress}%
- Reached Station: ${currentStation}
- Next Station: ${nextStation} (ETA: ${etaNext})
- Platform: ${journey.platform || "PF-4"}

Passenger Question: "${question}"

Answer concisely, accurately, and reassuringly in 2-4 sentences with helpful details.
`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      if (aiResponse) return aiResponse;
    }
  } catch (error) {
    console.warn(
      "Gemini API call failed, using offline fallback engine:",
      error.message,
    );
  }

  // Smart Fallback QA Engine
  const q = question.toLowerCase();

  if (q.includes("time left") || q.includes("how long")) {
    const remainingMins = Math.round(((100 - currentProgress) / 100) * 8 * 60);
    const hrs = Math.floor(remainingMins / 60);
    const mins = remainingMins % 60;
    return `You have approximately ${hrs > 0 ? `${hrs} hours and ` : ""}${mins} minutes remaining to reach ${journey.to}. Current progress is ${currentProgress}%.`;
  }

  if (q.includes("next station") || q.includes("where are we")) {
    return `The next station is ${nextStation}, estimated to arrive around ${etaNext}. You have currently crossed ${currentStation}.`;
  }

  if (q.includes("wake up") || q.includes("alarm")) {
    return `We recommend setting a wake-up alarm for 30 minutes before reaching ${journey.to} (around ${journey.arrivalTime || "07:30 AM"}). You can enable the Wake-Up Reminder in the Reminders tab!`;
  }

  if (
    q.includes("get down") ||
    q.includes("reach") ||
    q.includes("destination")
  ) {
    return `Your destination is ${journey.to}. Scheduled arrival time is ${journey.arrivalTime || "08:32 AM"}. Stay prepared with your luggage near coach ${journey.coach || "B2"}.`;
  }

  if (q.includes("platform") || q.includes("pf")) {
    return `Your train ${journey.trainNumber} ${journey.trainName} is assigned to Platform ${journey.platform || "PF-4"}. Double check coach position tags on the display board!`;
  }

  if (q.includes("stop") || q.includes("duration") || q.includes("halt")) {
    return `The stop duration at ${currentStation} is ${timeline.currentStation.stopDuration || "5-10 minutes"}. Make sure not to wander far from your coach ${journey.coach || "B2"}.`;
  }

  if (
    q.includes("what should i do") ||
    q.includes("tip") ||
    q.includes("advice")
  ) {
    return `Check your Travel Checklist to make sure your wallet, phone, and ID card are secure. Keep your water bottle handy and stay updated with live timeline milestones!`;
  }

  return `For your journey on ${journey.trainName} (${journey.trainNumber}), you are currently ${currentProgress}% complete near ${currentStation}. Next stop is ${nextStation} at ${etaNext}. Have a safe & comfortable trip!`;
};

/*
========================================
AI JOURNEY TIPS & INSIGHTS
========================================
*/

const getJourneyTips = async (journeyInput) => {
  let journey = journeyInput;
  if (!journey || !journey.trainName) {
    const list = await journeyRepository.getJourneysByUser("default_user");
    journey = list[0] || generateMockPNRDetails("2849104829");
  }

  try {
    const client = getGeminiClient();
    if (client) {
      const model = client.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `
You are RailSwap AI Journey Companion.
Provide travel insights for this journey:
Train: ${journey.trainName} (${journey.trainNumber})
From: ${journey.from} -> To: ${journey.to}
Seat: ${journey.coach}-${journey.seat}

Generate:
1. Essential Packing Tips
2. Safety & Luggage Advice
3. Famous Station Food Suggestions
4. Destination Advice
`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error) {
    console.warn(
      "Gemini tips failed, returning default insights:",
      error.message,
    );
  }

  return `
### 🎒 AI Travel Insights for ${journey.trainName} (${journey.trainNumber})

- **Packing Tips**: Carry a portable power bank, earplugs, sanitizer, and essential medication. Keep physical & soft copy of E-Ticket + Govt ID.
- **Safety Tips**: Lock your luggage under berth ${journey.seat || "34"}. Never leave valuables unattended while visiting the restroom.
- **Food Suggestions**: Try famous local station delicacies like Ratlami Sev, Poha, Agra Petha, or order e-catering directly to berth ${journey.coach || "B2"}-${journey.seat || "34"}.
- **Weather Advice**: Check destination weather before arrival and carry suitable light/warm apparel.
`;
};

/*
========================================
CHECKLIST OPERATIONS
========================================
*/

const addChecklistItem = async (journeyId, { text, category }) => {
  const journey = await journeyRepository.getJourneyById(journeyId);
  if (!journey) throw new Error("Journey not found");

  const newItem = createChecklistItem(text, category);
  const checklist = [...(journey.checklist || []), newItem];

  await journeyRepository.updateJourney(journeyId, { checklist });
  return checklist;
};

const toggleChecklistItem = async (journeyId, itemId) => {
  const journey = await journeyRepository.getJourneyById(journeyId);
  if (!journey) throw new Error("Journey not found");

  const checklist = (journey.checklist || []).map((item) =>
    item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item,
  );

  await journeyRepository.updateJourney(journeyId, { checklist });
  return checklist;
};

const deleteChecklistItem = async (journeyId, itemId) => {
  const journey = await journeyRepository.getJourneyById(journeyId);
  if (!journey) throw new Error("Journey not found");

  const checklist = (journey.checklist || []).filter(
    (item) => item.id !== itemId,
  );
  await journeyRepository.updateJourney(journeyId, { checklist });
  return checklist;
};

/*
========================================
NOTES OPERATIONS
========================================
*/

const addJourneyNote = async (journeyId, noteData) => {
  const journey = await journeyRepository.getJourneyById(journeyId);
  if (!journey) throw new Error("Journey not found");

  const newNote = createNote(noteData);
  const notes = processNotesList([...(journey.notes || []), newNote]);

  await journeyRepository.updateJourney(journeyId, { notes });
  return notes;
};

const togglePinNote = async (journeyId, noteId) => {
  const journey = await journeyRepository.getJourneyById(journeyId);
  if (!journey) throw new Error("Journey not found");

  const notes = processNotesList(
    (journey.notes || []).map((n) =>
      n.id === noteId ? { ...n, isPinned: !n.isPinned } : n,
    ),
  );

  await journeyRepository.updateJourney(journeyId, { notes });
  return notes;
};

const deleteJourneyNote = async (journeyId, noteId) => {
  const journey = await journeyRepository.getJourneyById(journeyId);
  if (!journey) throw new Error("Journey not found");

  const notes = (journey.notes || []).filter((n) => n.id !== noteId);
  await journeyRepository.updateJourney(journeyId, { notes });
  return notes;
};

/*
========================================
ANALYTICS & MEMORIES
========================================
*/

const getUserAnalytics = async (userId) => {
  const journeys = await journeyRepository.getJourneysByUser(userId);
  return computeUserAnalytics(journeys);
};

const saveJourneyMemory = async (
  journeyId,
  { rating, notes, summary, isFavourite },
) => {
  const updateData = {
    status: JOURNEY_STATUS.COMPLETED,
    progress: 100,
    ...(rating !== undefined && { rating }),
    ...(summary && { summary }),
    ...(isFavourite !== undefined && { isFavourite }),
  };

  return await journeyRepository.updateJourney(journeyId, updateData);
};

module.exports = {
  createJourney,
  getJourneys,
  getJourney,
  updateJourney,
  deleteJourney,
  searchTrainOrPNR,
  answerAIAssistantQuestion,
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
