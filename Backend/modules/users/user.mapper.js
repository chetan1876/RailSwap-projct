const {
  userResponseDTO,
  userListDTO,
} = require("./user.dto");

/*
========================================
Map Single User Response
========================================
*/

const mapUserResponse = (user) => {
  if (!user) {
    return null;
  }

  return userResponseDTO(user);
};

/*
========================================
Map User List Response
========================================
*/

const mapUserList = (users) => {
  return users.map((user) =>
    userListDTO(user)
  );
};

/*
========================================
Map User Create Payload
========================================
*/

const mapCreateUserPayload = (
  payload
) => {
  return {
    fullName:
      payload.fullName?.trim(),

    email:
      payload.email?.toLowerCase(),

    phoneNumber:
      payload.phoneNumber,

    password:
      payload.password,

    gender:
      payload.gender ||
      "OTHER",
  };
};

/*
========================================
Map User Update Payload
========================================
*/

const mapUpdateUserPayload = (
  payload
) => {
  return {
    fullName:
      payload.fullName,

    phoneNumber:
      payload.phoneNumber,

    profileImage:
      payload.profileImage,

    gender:
      payload.gender,

    age:
      payload.age,

    city:
      payload.city,

    state:
      payload.state,

    emergencyContact:
      payload.emergencyContact,
  };
};

module.exports = {
  mapUserResponse,
  mapUserList,
  mapCreateUserPayload,
  mapUpdateUserPayload,
};