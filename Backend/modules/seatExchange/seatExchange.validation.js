
const Joi = require("joi");


// =====================================================
// CREATE SEAT EXCHANGE REQUEST VALIDATION
// =====================================================

const createSeatExchangeValidation = Joi.object({

  user: Joi.string()
    .optional()
    .default("user123"),


  passengerName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),


  age: Joi.number()
    .integer()
    .min(1)
    .max(120)
    .required(),


  gender: Joi.string()
    .valid(
      "Male",
      "Female",
      "Other"
    )
    .required(),


  pnr: Joi.string()
    .length(10)
    .required(),


  trainNumber: Joi.string()
    .required(),


  trainName: Joi.string()
    .required(),


  journeyDate: Joi.string()
    .required(),


  boardingStation: Joi.string()
    .required(),


  destinationStation: Joi.string()
    .required(),


  coach: Joi.string()
    .required(),


  seatNumber: Joi.number()
    .integer()
    .min(1)
    .max(120)
    .required(),


  seatType: Joi.string()
    .required(),


  bookingStatus: Joi.string()
    .optional()
    .default("CNF"),


  preferredCoach: Joi.string()
    .required(),


  preferredSeatNumber: Joi.number()
    .integer()
    .min(1)
    .max(120)
    .required(),


  preferredSeat: Joi.string()
    .optional()
    .default("Any"),


  sameCoachPreferred: Joi.boolean()
    .optional()
    .default(false),


  sameCabinPreferred: Joi.boolean()
    .optional()
    .default(false),


  medicalPriority: Joi.boolean()
    .optional()
    .default(false),


  seniorCitizenPriority: Joi.boolean()
    .optional()
    .default(false),


  familyPriority: Joi.boolean()
    .optional()
    .default(false),


  pnrVerified: Joi.boolean()
    .optional()
    .default(true),

});


// =====================================================
// PAYTM POST-ACCEPTANCE PAYMENT VALIDATION
// =====================================================

const postAcceptancePaymentValidation = Joi.object({

  requestId: Joi.string()
    .required(),


  amount: Joi.number()
    .valid(50)
    .required(),


  paymentMethod: Joi.string()
    .valid(
      "PAYTM",
      "UPI",
      "CARD",
      "NET_BANKING"
    )
    .default("PAYTM"),

});


// =====================================================
// UPDATE STATUS VALIDATION
// =====================================================

const updateStatusValidation = Joi.object({

  status: Joi.string()
    .valid(
      "PENDING",
      "ACCEPTED",
      "PAYMENT_PENDING",
      "PAYMENT_SUCCESSFUL",
      "COMPLETED",
      "REJECTED",
      "CANCELLED"
    )
    .required(),


  matchedUserId: Joi.string()
    .optional(),

});


// =====================================================
// REVIEW PACKET REQUEST VALIDATION
// =====================================================

const reviewPacketValidation = {

  params: Joi.object({

    id: Joi.string()
      .trim()
      .required(),

  }),

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  createSeatExchangeValidation,

  postAcceptancePaymentValidation,

  updateStatusValidation,

  reviewPacketValidation,

};

const Joi = require("joi");

// Create Seat Exchange Request Validation
const createSeatExchangeValidation = Joi.object({
  user: Joi.string().optional().default("user123"),

  passengerName: Joi.string().trim().min(2).max(50).required(),

  age: Joi.number().integer().min(1).max(120).required(),

  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .required(),

  pnr: Joi.string()
    .length(10)
    .required(),

  trainNumber: Joi.string()
    .required(),

  trainName: Joi.string()
    .required(),

  journeyDate: Joi.string()
    .required(),

  boardingStation: Joi.string()
    .required(),

  destinationStation: Joi.string()
    .required(),

  coach: Joi.string()
    .required(),

  seatNumber: Joi.number().integer().min(1).max(120).required(),

  seatType: Joi.string().required(),

  bookingStatus: Joi.string().optional().default("CNF"),

  preferredCoach: Joi.string().required(),
  preferredSeatNumber: Joi.number().integer().min(1).max(120).required(),
  preferredSeat: Joi.string().optional().default("Any"),

  sameCoachPreferred: Joi.boolean().optional().default(false),
  sameCabinPreferred: Joi.boolean().optional().default(false),
  medicalPriority: Joi.boolean().optional().default(false),
  seniorCitizenPriority: Joi.boolean().optional().default(false),
  familyPriority: Joi.boolean().optional().default(false),

  pnrVerified: Joi.boolean().optional().default(true),
  notes: Joi.string().optional().allow("", null).default("Passenger requested a lower berth for the journey."),
});

// Paytm Post-Acceptance Payment Validation
const postAcceptancePaymentValidation = Joi.object({
  requestId: Joi.string().required(),
  amount: Joi.number().valid(50).required(),
  paymentMethod: Joi.string().valid("PAYTM", "UPI", "CARD", "NET_BANKING").default("PAYTM"),
});

// Update Status Validation
const updateStatusValidation = Joi.object({
  status: Joi.string()
    .valid(
      "PENDING",
      "ACCEPTED",
      "PAYMENT_PENDING",
      "PAYMENT_SUCCESSFUL",
      "COMPLETED",
      "REJECTED",
      "CANCELLED"
    )
    .required(),
  matchedUserId: Joi.string().optional(),
});

module.exports = {
  createSeatExchangeValidation,
  postAcceptancePaymentValidation,
  updateStatusValidation,
};

