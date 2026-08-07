"use strict";

const {
  BOOKING_PROVIDERS,
  extractStationCode,
  formatDateYYYYMMDD,
} = require("./bookingProvider.config");
const ApiError = require("../../shared/apiError");

/**
 * Service to handle AI Recommendation Booking operations.
 */
class BookingService {
  /**
   * Fetch all supported booking providers metadata.
   */
  getProviders() {
    return BOOKING_PROVIDERS.map((provider) => ({
      id: provider.id,
      name: provider.name,
      tagline: provider.tagline,
      badge: provider.badge,
      badgeColor: provider.badgeColor,
      brandColor: provider.brandColor,
      logoType: provider.logoType,
      description: provider.description,
      features: provider.features,
      supportedClasses: provider.supportedClasses,
    }));
  }

  /**
   * Prepare booking payload and generate direct redirect URL for selected provider.
   * @param {object} bookingData - Details of selected train and user preferences
   */
  prepareBooking(bookingData) {
    const {
      trainNumber,
      trainName,
      source,
      destination,
      travelDate,
      travelClass,
      passengers,
      quota,
      seatPreference,
      coachPreference,
      providerId,
    } = bookingData;

    if (!trainNumber || !source || !destination || !travelDate) {
      throw ApiError.badRequest(
        "Missing required train recommendation details for booking.",
      );
    }

    const provider = BOOKING_PROVIDERS.find(
      (p) => p.id === (providerId || "irctc"),
    );
    if (!provider) {
      throw ApiError.badRequest(`Unsupported booking provider: ${providerId}`);
    }

    const sourceCode = extractStationCode(source);
    const destinationCode = extractStationCode(destination);
    const formattedDate = formatDateYYYYMMDD(travelDate);

    const bookingPayload = {
      trainNumber,
      trainName,
      source,
      sourceCode,
      destination,
      destinationCode,
      travelDate: formattedDate,
      travelClass: travelClass || "ALL",
      passengers: parseInt(passengers, 10) || 1,
      quota: quota || "GN",
      seatPreference: seatPreference || "No Preference",
      coachPreference: coachPreference || "Any",
      preparedAt: new Date().toISOString(),
    };

    const redirectUrl = provider.generateUrl({
      trainNumber,
      trainName,
      source,
      destination,
      travelDate,
      travelClass: bookingPayload.travelClass,
      quota: bookingPayload.quota,
      passengers: bookingPayload.passengers,
    });

    return {
      provider: {
        id: provider.id,
        name: provider.name,
        badge: provider.badge,
      },
      bookingPayload,
      redirectUrl,
    };
  }
}

module.exports = new BookingService();
