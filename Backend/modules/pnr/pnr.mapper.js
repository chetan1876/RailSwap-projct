const { pnrResponseDTO } = require("./pnr.dto");

const mapPNRResponse = (pnrData) => {
  return pnrResponseDTO(pnrData);
};

const mapPNRHistory = (pnrList) => {
  return pnrList.map((pnr) => pnrResponseDTO(pnr));
};

module.exports = {
  mapPNRResponse,
  mapPNRHistory,
};
