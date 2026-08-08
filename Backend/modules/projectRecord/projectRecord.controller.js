const projectRecordService = require("./projectRecord.service");

const getRecords = async (req, res, next) => {
  try {
    const { role, status } = req.query;
    const userContext = req.user || null;

    const result = await projectRecordService.getScopedProjectRecords({
      role,
      status,
      userContext,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await projectRecordService.getProjectRecordById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createRecord = async (req, res, next) => {
  try {
    const recordData = req.body;
    const result = await projectRecordService.createProjectRecord(recordData);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const seedRecords = async (req, res, next) => {
  try {
    const result = await projectRecordService.seedRecords();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  seedRecords,
};
