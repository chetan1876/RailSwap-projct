const AdminRepository = require("./admin.repository");

const {

  toAdminDTO,

  toAdminListDTO,

  toUpdateAdminDTO,

  toDashboardDTO,

} = require("./admin.mapper");

class AdminService {

  /*
  ========================================
  INITIALIZE ADMIN
  ========================================
  */

  async initializeAdmin(data) {

    const exists =
      await AdminRepository.adminExists(
        data.id
      );

    if (exists) {

      return await this.getProfile(
        data.id
      );

    }

    const admin =
      await AdminRepository.create(
        data
      );

    return toAdminDTO(admin);

  }

  /*
  ========================================
  GET ADMIN PROFILE
  ========================================
  */

  async getProfile(adminId) {

    const admin =
      await AdminRepository.getProfile(
        adminId
      );

    if (!admin) {

      throw new Error(
        "Admin not found."
      );

    }

    return toAdminDTO(admin);

  }

  /*
  ========================================
  UPDATE ADMIN PROFILE
  ========================================
  */

  async updateProfile(
    adminId,
    payload
  ) {

    const admin =
      await AdminRepository.update(

        adminId,

        payload

      );

    return toUpdateAdminDTO(
      admin
    );

  }

  /*
  ========================================
  DELETE ADMIN
  ========================================
  */

  async deleteAdmin(adminId) {

    await AdminRepository.delete(
      adminId
    );

    return {

      success: true,

      message:
        "Admin deleted successfully.",

    };

  }

    /*
  ========================================
  GET DASHBOARD
  ========================================
  */

  async getDashboard() {

    const dashboard =
      await AdminRepository.getDashboard();

    return toDashboardDTO(
      dashboard
    );

  }


  /*
  ========================================
  GET ALL USERS
  ========================================
  */

  async getUsers() {

    const users =
      await AdminRepository.getUsers();

    return toAdminListDTO(
      users
    );

  }


  /*
  ========================================
  GET USER BY ID
  ========================================
  */

  async getUser(userId) {

    const user =
      await AdminRepository.getUser(
        userId
      );


    if (!user) {

      throw new Error(
        "User not found."
      );

    }


    return user;

  }
    /*
  ========================================
  BLOCK USER
  ========================================
  */

  async blockUser(userId) {

    const user =
      await AdminRepository.blockUser(
        userId
      );

    if (!user) {

      throw new Error(
        "User not found."
      );

    }

    return user;

  }

  /*
  ========================================
  UNBLOCK USER
  ========================================
  */

  async unblockUser(userId) {

    const user =
      await AdminRepository.unblockUser(
        userId
      );

    if (!user) {

      throw new Error(
        "User not found."
      );

    }

    return user;

  }

  /*
  ========================================
  DELETE USER
  ========================================
  */

  async deleteUser(userId) {

    const user =
      await AdminRepository.getUser(
        userId
      );

    if (!user) {

      throw new Error(
        "User not found."
      );

    }

    await AdminRepository.deleteUser(
      userId
    );

    return {

      success: true,

      message:
        "User deleted successfully.",

    };

  }

}

module.exports =
  new AdminService();