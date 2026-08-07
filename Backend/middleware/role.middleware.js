const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if authentication middleware ran
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // Check role permission
      if (
        !allowedRoles.includes(
          req.user.role
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to access this resource.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Authorization failed.",
      });
    }
  };
};

module.exports = authorize;