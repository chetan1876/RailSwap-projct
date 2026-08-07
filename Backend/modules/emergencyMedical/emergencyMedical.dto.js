/*
========================================
EMERGENCY MEDICAL DASHBOARD DTO
========================================
*/

class DashboardDTO {

  constructor(data) {

    this.responseTime = data.responseTime;

    this.statistics = {

      doctorsNearby: data.doctorsNearby,

      availableDoctors: data.availableDoctors,

      medicalVolunteers: data.medicalVolunteers,

      emergencySupport: data.emergencySupport,

    };

    this.doctors = data.doctors;

    this.donors = data.donors;

    this.aiInsight = data.aiInsight;

    this.isEmergencyActive = data.isEmergencyActive;

    this.emergencyRaisedAt = data.emergencyRaisedAt;

    this.emergencyData = data.emergencyData;

  }

}

/*
========================================
DOCTOR DTO
========================================
*/

class DoctorDTO {

  constructor(data) {

    this.id = data.id;

    this.name = data.name;

    this.speciality = data.speciality;

    this.hospital = data.hospital;

    this.coach = data.coach;

    this.seatNumber = data.seatNumber;

    this.phone = data.phone;

    this.experience = data.experience;

    this.available = data.available;

    this.profileImage = data.profileImage;

  }

}

/*
========================================
DONOR DTO
========================================
*/

class DonorDTO {

  constructor(data) {

    this.id = data.id;

    this.name = data.name;

    this.blood = data.blood;

    this.coach = data.coach;

    this.seatNumber = data.seatNumber;

    this.phone = data.phone;

    this.verified = data.verified;

    this.profileImage = data.profileImage;

  }

}

/*
========================================
AI INSIGHT DTO
========================================
*/

class InsightDTO {

  constructor(data) {

    this.title = data.title;

    this.description = data.description;

    this.riskLevel = data.riskLevel;

  }

}

/*
========================================
EMERGENCY DTO
========================================
*/

class EmergencyDTO {

  constructor(data) {

    this.coach = data.coach;

    this.seatNumber = data.seatNumber;

    this.emergencyType = data.emergencyType;

    this.patientName = data.patientName;

    this.message = data.message;

    this.latitude = data.latitude;

    this.longitude = data.longitude;

    this.raisedAt = data.raisedAt;

  }

}

module.exports = {

  DashboardDTO,

  DoctorDTO,

  DonorDTO,

  InsightDTO,

  EmergencyDTO,

};