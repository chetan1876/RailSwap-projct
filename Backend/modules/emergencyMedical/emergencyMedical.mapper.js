const {
  DashboardDTO,
  DoctorDTO,
  DonorDTO,
  InsightDTO,
  EmergencyDTO,
} = require("./emergencyMedical.dto");

/*
========================================
DASHBOARD MAPPER
========================================
*/

const dashboardMapper = (document) => {

  return new DashboardDTO({

    responseTime: document.responseTime,

    doctorsNearby: document.doctorsNearby,

    availableDoctors: document.availableDoctors,

    medicalVolunteers: document.medicalVolunteers,

    emergencySupport: document.emergencySupport,

    doctors: (document.doctors || []).map(doctorMapper),

    donors: (document.donors || []).map(donorMapper),

    aiInsight: insightMapper(document.insight),

    isEmergencyActive: document.isEmergencyActive,

    emergencyRaisedAt: document.emergencyRaisedAt,

    emergencyData: document.emergencyData || null,

  });

};

/*
========================================
DOCTOR MAPPER
========================================
*/

const doctorMapper = (doctor) => {

  return new DoctorDTO({

    id: doctor.id,

    name: doctor.name,

    speciality: doctor.speciality,

    hospital: doctor.hospital,

    coach: doctor.coach,

    seatNumber: doctor.seatNumber,

    phone: doctor.phone,

    experience: doctor.experience,

    available: doctor.available,

    profileImage: doctor.profileImage,

  });

};

/*
========================================
DONOR MAPPER
========================================
*/

const donorMapper = (donor) => {

  return new DonorDTO({

    id: donor.id,

    name: donor.name,

    blood: donor.blood,

    coach: donor.coach,

    seatNumber: donor.seatNumber,

    phone: donor.phone,

    verified: donor.verified,

    profileImage: donor.profileImage,

  });

};

/*
========================================
AI INSIGHT MAPPER
========================================
*/

const insightMapper = (insight) => {

  if (!insight) {

    return null;

  }

  return new InsightDTO({

    title: insight.title,

    description: insight.description,

    riskLevel: insight.riskLevel,

  });

};

/*
========================================
EMERGENCY RESPONSE MAPPER
========================================
*/

const emergencyMapper = (data) => {

  if (!data) {

    return null;

  }

  return new EmergencyDTO({

    coach: data.coach,

    seatNumber: data.seatNumber,

    emergencyType: data.emergencyType,

    patientName: data.patientName,

    message: data.message,

    latitude: data.latitude,

    longitude: data.longitude,

    raisedAt: data.raisedAt,

  });

};

module.exports = {

  dashboardMapper,

  doctorMapper,

  donorMapper,

  insightMapper,

  emergencyMapper,

};