"use strict";

const express = require("express");

const controller = require("./chatbot.controller");

const router = express.Router();
const { validateChat } = require("./chatbot.validation");

/*
========================================
CHAT
========================================
*/
router.post("/chat", validateChat, controller.sendMessage);

/*
========================================
NEW CHAT
========================================
*/

router.post("/new", controller.newChat);

/*
========================================
GET HISTORY
========================================
*/

router.get("/history/:userId", controller.history);

/*
========================================
GET SESSION
========================================
*/

router.get("/session/:sessionId", controller.getChat);

router.get("/search", controller.searchHistory);

/*
========================================
RENAME CHAT
========================================
*/

router.patch("/rename", controller.renameChat);

/*
========================================
DELETE SESSION
========================================
*/

router.delete("/session/:sessionId", controller.deleteChat);

/*
========================================
CLEAR HISTORY
========================================
*/

router.delete("/history/:userId", controller.clearHistory);

module.exports = router;
