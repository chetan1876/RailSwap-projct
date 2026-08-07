"use strict";

const repository = require("./groupJourney.repository");

const createJourneyGroup = async (data) => {
  const group = {
    title: data.title,
    source: data.source,
    destination: data.destination,
    journeyDate: data.journeyDate,
    trainNumber: data.trainNumber,
    maxMembers: data.maxMembers || 6,
    createdBy: data.createdBy,
    members: [
      {
        userId: data.createdBy,
        role: "ADMIN",
        joinedAt: new Date().toISOString(),
      },
    ],
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  return await repository.createGroup(group);
};

const getJourneyGroups = async () => {
  return await repository.getGroups();
};

const joinJourneyGroup = async (groupId, user) => {
  return await repository.joinGroup(groupId, {
    userId: user.userId,
    name: user.name,
    joinedAt: new Date().toISOString(),
  });
};

module.exports = {
  createJourneyGroup,
  getJourneyGroups,
  joinJourneyGroup,
};
