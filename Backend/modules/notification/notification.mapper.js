const {

  NotificationDTO,

  NotificationCountDTO,

  NotificationResponseDTO,

} = require("./notification.dto");

/*
========================================
NOTIFICATION MAPPER
========================================
*/

const notificationMapper = (document) => {

  if (!document) {

    return null;

  }

  return new NotificationDTO({

    id:
      document.id,

    userId:
      document.userId,

    title:
      document.title,

    message:
      document.message,

    type:
      document.type,

    priority:
      document.priority,

    sourceModule:
      document.sourceModule,

    isRead:
      document.isRead,

    createdAt:
      document.createdAt,

    updatedAt:
      document.updatedAt,

  });

};

/*
========================================
NOTIFICATION LIST MAPPER
========================================
*/

const notificationListMapper = (documents) => {

  return (documents || []).map(

    notificationMapper

  );

};

/*
========================================
NOTIFICATION COUNT MAPPER
========================================
*/

const notificationCountMapper = (data) => {

  return new NotificationCountDTO({

    total:
      data.total || 0,

    unread:
      data.unread || 0,

    read:
      data.read || 0,

  });

};

/*
========================================
NOTIFICATION RESPONSE MAPPER
========================================
*/

const notificationResponseMapper = (
  success,
  message,
  data
) => {

  if (typeof success === "object" && success !== null) {
    return new NotificationResponseDTO({
      success: success.success ?? true,
      message: success.message ?? "",
      data: success.data ?? null,
    });
  }

  return new NotificationResponseDTO({

    success,

    message,

    data,

  });

};

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  notificationMapper,

  notificationListMapper,

  notificationCountMapper,

  notificationResponseMapper,

};