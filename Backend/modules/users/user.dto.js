/*
========================================
USER RESPONSE DTO
========================================
*/

const userResponseDTO = (
  user
) => {
  return {
    id: user._id,

    fullName:
      user.fullName,

    email:
      user.email,

    phoneNumber:
      user.phoneNumber,

    profileImage:
      user.profileImage,

    gender:
      user.gender,

    age:
      user.age,

    city:
      user.city,

    state:
      user.state,

    role:
      user.role,

    isVerified:
      user.isVerified,

    status:
      user.status,

    trustScore:
      user.trustScore,

    totalTrips:
      user.totalTrips,

    successfulExchanges:
      user.successfulExchanges,

    cancelledExchanges:
      user.cancelledExchanges,

    emergencyContact:
      user.emergencyContact,

    lastLogin:
      user.lastLogin,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
};

/*
========================================
USER LIST DTO
(Admin Panel)
========================================
*/

const userListDTO = (
  user
) => {
  return {
    id: user._id,

    fullName:
      user.fullName,

    email:
      user.email,

    role:
      user.role,

    status:
      user.status,

    trustScore:
      user.trustScore,

    createdAt:
      user.createdAt,
  };
};

module.exports = {
  userResponseDTO,
  userListDTO,
};