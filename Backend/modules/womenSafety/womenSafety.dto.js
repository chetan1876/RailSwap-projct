class DashboardDTO {
  constructor(data) {
    this.safetyScore = data.safetyScore;
    this.safetyStatus = data.safetyStatus;

    this.statistics = {
      verifiedTravelers: data.verifiedTravelers,
      activeTravelers: data.activeTravelers,
      aiMonitoring: data.aiMonitoring,
      safetyAccuracy: data.safetyAccuracy,
    };

    this.safeSeats = data.safeSeats;

    this.companions = data.companions;

    this.aiInsight = data.aiInsight;
  }
}

class CompanionDTO {
  constructor(data) {
    this.id = data.id;

    this.name = data.name;

    this.age = data.age;

    this.verified = data.verified;

    this.match = data.match;

    this.coach = data.coach;

    this.seatNumber = data.seatNumber;

    this.profileImage = data.profileImage;

    this.trustScore = data.trustScore;
  }
}

class SeatDTO {
  constructor(data) {
    this.coach = data.coach;

    this.seatNumber = data.seatNumber;

    this.badge = data.badge;

    this.match = data.match;
  }
}

class InsightDTO {
  constructor(data) {
    this.title = data.title;

    this.description = data.description;

    this.riskLevel = data.riskLevel;
  }
}

module.exports = {
  DashboardDTO,
  CompanionDTO,
  SeatDTO,
  InsightDTO,
};