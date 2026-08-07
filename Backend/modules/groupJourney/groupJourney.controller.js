"use strict";

const groupJourneyService = require("./groupJourney.service");

/*
========================================
CREATE GROUP
========================================
*/

const createGroup = async (req, res) => {
  try {
    const group = await groupJourneyService.createJourneyGroup(req.body);

    return res.status(201).json({
      success: true,
      message: "Journey group created successfully.",
      data: group,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET ALL GROUPS
========================================
*/

const getGroups = async (req, res) => {
  try {
    const groups = await groupJourneyService.getJourneyGroups();

    return res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
JOIN GROUP
========================================
*/

const joinGroup = async (req, res) => {
  try {
    const group = await groupJourneyService.joinJourneyGroup(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Successfully joined the group.",
      data: group,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createGroup,
  getGroups,
  joinGroup,
};
