const AdminService = require("./admin.service");

class AdminController {

  /*
  ========================================
  INITIALIZE ADMIN
  ========================================
  */

  async initializeAdmin(req, res, next) {

    try {

      const response =
        await AdminService.initializeAdmin(
          req.body
        );

      return res.status(201).json({

        success: true,

        message:
          "Admin initialized successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  GET ADMIN PROFILE
  ========================================
  */

  async getProfile(req, res, next) {

    try {

      const { adminId } =
        req.params;

      const response =
        await AdminService.getProfile(
          adminId
        );

      return res.status(200).json({

        success: true,

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  UPDATE ADMIN PROFILE
  ========================================
  */

  async updateProfile(req, res, next) {

    try {

      const { adminId } =
        req.params;

      const response =
        await AdminService.updateProfile(

          adminId,

          req.body

        );

      return res.status(200).json({

        success: true,

        message:
          "Admin profile updated successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  DELETE ADMIN
  ========================================
  */

  async deleteAdmin(req, res, next) {

    try {

      const { adminId } =
        req.params;

      const response =
        await AdminService.deleteAdmin(
          adminId
        );

      return res.status(200).json({

        success: true,

        message:
          response.message,

      });

    } catch (error) {

      next(error);

    }

  }
    /*
  ========================================
  GET DASHBOARD
  ========================================
  */

  async getDashboard(req, res, next) {

    try {

      const response =
        await AdminService.getDashboard();

      return res.status(200).json({

        success: true,

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  GET ALL USERS
  ========================================
  */

  async getUsers(req, res, next) {

    try {

      const response =
        await AdminService.getUsers();

      return res.status(200).json({

        success: true,

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  GET USER BY ID
  ========================================
  */

  async getUser(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await AdminService.getUser(
          userId
        );

      return res.status(200).json({

        success: true,

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }
    /*
  ========================================
  BLOCK USER
  ========================================
  */

  async blockUser(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await AdminService.blockUser(
          userId
        );

      return res.status(200).json({

        success: true,

        message:
          "User blocked successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  UNBLOCK USER
  ========================================
  */

  async unblockUser(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await AdminService.unblockUser(
          userId
        );

      return res.status(200).json({

        success: true,

        message:
          "User unblocked successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  DELETE USER
  ========================================
  */

  async deleteUser(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await AdminService.deleteUser(
          userId
        );

      return res.status(200).json({

        success: true,

        message:
          response.message,

      });

    } catch (error) {

      next(error);

    }

  }

}

module.exports = new AdminController();