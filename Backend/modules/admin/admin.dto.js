const {

  ADMIN_ROLES,

  ADMIN_STATUS,

  DEFAULT_PERMISSIONS,

} = require("./admin.constants");

/*
========================================
CREATE ADMIN DTO
========================================
*/

const createAdminDTO = (data = {}) => ({

  id: data.id || "",

  name: data.name || "",

  email: data.email || "",

  role:
    data.role ||
    ADMIN_ROLES.ADMIN,

  status:
    data.status ||
    ADMIN_STATUS.ACTIVE,

  permissions:
    data.permissions ||
    DEFAULT_PERMISSIONS,

  createdAt:
    data.createdAt ||
    new Date(),

  updatedAt:
    data.updatedAt ||
    new Date(),

});

/*
========================================
UPDATE ADMIN DTO
========================================
*/

const updateAdminDTO = (data = {}) => ({

  ...(data.name && {
    name: data.name,
  }),

  ...(data.email && {
    email: data.email,
  }),

  ...(data.role && {
    role: data.role,
  }),

  ...(data.status && {
    status: data.status,
  }),

  ...(data.permissions && {
    permissions:
      data.permissions,
  }),

  updatedAt: new Date(),

});

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  createAdminDTO,

  updateAdminDTO,

};