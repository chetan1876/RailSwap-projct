const {

  createAdminDTO,

  updateAdminDTO,

} = require("./admin.dto");

/*
========================================
ADMIN MAPPER
========================================
*/

const toAdminDTO = (admin) => {

  return createAdminDTO(admin);

};

/*
========================================
ADMIN LIST MAPPER
========================================
*/

const toAdminListDTO = (admins = []) => {

  return admins.map((admin) =>
    createAdminDTO(admin)
  );

};

/*
========================================
UPDATE ADMIN MAPPER
========================================
*/

const toUpdateAdminDTO = (admin) => {

  return updateAdminDTO(admin);

};

/*
========================================
DASHBOARD MAPPER
========================================
*/

const toDashboardDTO = (data = {}) => ({

  totalUsers:
    data.totalUsers || 0,

  activeUsers:
    data.activeUsers || 0,

  blockedUsers:
    data.blockedUsers || 0,

  totalSeatExchangeRequests:
    data.totalSeatExchangeRequests || 0,

  totalJourneyCompanions:
    data.totalJourneyCompanions || 0,

  totalWomenSafetyAlerts:
    data.totalWomenSafetyAlerts || 0,

  totalEmergencyCases:
    data.totalEmergencyCases || 0,

  totalNotifications:
    data.totalNotifications || 0,

  totalAdmins:
    data.totalAdmins || 0,

});

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  toAdminDTO,

  toAdminListDTO,

  toUpdateAdminDTO,

  toDashboardDTO,

};