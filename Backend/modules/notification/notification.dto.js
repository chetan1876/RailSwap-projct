/*
========================================
NOTIFICATION DTO
========================================
*/

class NotificationDTO {

  constructor(data) {

    this.id =
      data.id;

    this.userId =
      data.userId;

    this.title =
      data.title;

    this.message =
      data.message;

    this.type =
      data.type;

    this.priority =
      data.priority;

    this.sourceModule =
      data.sourceModule;

    this.isRead =
      data.isRead;

    this.createdAt =
      data.createdAt;

    this.updatedAt =
      data.updatedAt;

  }

}

/*
========================================
NOTIFICATION COUNT DTO
========================================
*/

class NotificationCountDTO {

  constructor(data) {

    this.total =
      data.total;

    this.unread =
      data.unread;

    this.read =
      data.read;

  }

}

/*
========================================
NOTIFICATION RESPONSE DTO
========================================
*/

class NotificationResponseDTO {

  constructor(data) {

    this.success =
      data.success;

    this.message =
      data.message;

    this.data =
      data.data;

  }

}

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  NotificationDTO,

  NotificationCountDTO,

  NotificationResponseDTO,

};