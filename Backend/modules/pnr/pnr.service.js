const verifyPNR = async (pnr) => {
  // Valid demo PNRs
  const validPNRs = {
    "6504791510": {
      success: true,
      pnr: "6504791510",
      trainNumber: "12301",
      trainName: "Rajdhani Express",
      from: "New Delhi",
      to: "Patna Junction",
      journeyDate: "28-Jul-2026",
      class: "3A",
      chartStatus: "Chart Prepared",
      passengers: [
        {
          name: "Passenger 1",
          age: 24,
          gender: "Male",
          bookingStatus: "CNF",
          currentStatus: "CNF",
          coach: "B2",
          seat: "25",
        },
      ],
    },

    "1234567890": {
      success: true,
      pnr: "1234567890",
      trainNumber: "12560",
      trainName: "Shiv Ganga Express",
      from: "Varanasi",
      to: "New Delhi",
      journeyDate: "29-Jul-2026",
      class: "SL",
      chartStatus: "Chart Not Prepared",
      passengers: [
        {
          name: "Passenger 1",
          age: 30,
          gender: "Female",
          bookingStatus: "WL 5",
          currentStatus: "WL 2",
          coach: "",
          seat: "",
        },
      ],
    },
  };

  if (validPNRs[pnr]) {
    return validPNRs[pnr];
  }

  return {
    success: false,
    message: "Invalid PNR Number",
  };
};

const getPNRHistory = async () => {
  return [
    {
      pnr: "6504791510",
      trainName: "Rajdhani Express",
    },
    {
      pnr: "1234567890",
      trainName: "Shiv Ganga Express",
    },
  ];
};

module.exports = {
  verifyPNR,
  getPNRHistory,
};