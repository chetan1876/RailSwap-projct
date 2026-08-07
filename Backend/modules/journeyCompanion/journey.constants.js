/*
========================================
JOURNEY COMPANION CONSTANTS
========================================
*/

const JOURNEY_STATUS = {
  UPCOMING: "UPCOMING",
  BOARDING: "BOARDING SOON",
  IN_TRANSIT: "IN TRANSIT",
  ARRIVING_SOON: "ARRIVING SOON",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

const DEFAULT_CHECKLIST_ITEMS = [
  { text: "Wallet & Cash", category: "Essentials", isCompleted: true },
  { text: "Government ID Card", category: "Documents", isCompleted: true },
  { text: "Train Ticket / E-Ticket", category: "Documents", isCompleted: true },
  {
    text: "Mobile Phone & Charger",
    category: "Electronics",
    isCompleted: true,
  },
  { text: "Power Bank", category: "Electronics", isCompleted: false },
  { text: "Water Bottle", category: "Essentials", isCompleted: false },
  {
    text: "Personal Prescription Medicines",
    category: "Health",
    isCompleted: false,
  },
  { text: "Sanitizer & Wipes", category: "Health", isCompleted: false },
  {
    text: "Earphones / Headphones",
    category: "Electronics",
    isCompleted: false,
  },
  {
    text: "Travel Pillow & Blanket",
    category: "Essentials",
    isCompleted: false,
  },
];

const PRESET_TRAINS = [
  {
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani Express",
    from: "Mumbai Central (MMCT)",
    to: "New Delhi (NDLS)",
    departureTime: "17:00",
    arrivalTime: "08:32",
    totalDistanceKm: 1384,
    stations: [
      {
        name: "Mumbai Central (MMCT)",
        time: "17:00",
        distance: 0,
        stopDuration: "Departure",
      },
      {
        name: "Surat (ST)",
        time: "19:43",
        distance: 263,
        stopDuration: "5 mins",
      },
      {
        name: "Vadodara (BRC)",
        time: "21:16",
        distance: 393,
        stopDuration: "10 mins",
      },
      {
        name: "Ratlam (RTM)",
        time: "00:25",
        distance: 653,
        stopDuration: "5 mins",
      },
      {
        name: "Kota (KOTA)",
        time: "03:15",
        distance: 920,
        stopDuration: "10 mins",
      },
      {
        name: "New Delhi (NDLS)",
        time: "08:32",
        distance: 1384,
        stopDuration: "Arrival",
      },
    ],
    famousFood: [
      "Ratlami Sev at Ratlam",
      "Poha at Vadodara",
      "Rajdhani Special Thali",
    ],
  },
  {
    trainNumber: "12002",
    trainName: "Bhopal Shatabdi Express",
    from: "New Delhi (NDLS)",
    to: "Rani Kamlapati (RKMP)",
    departureTime: "06:00",
    arrivalTime: "14:40",
    totalDistanceKm: 708,
    stations: [
      {
        name: "New Delhi (NDLS)",
        time: "06:00",
        distance: 0,
        stopDuration: "Departure",
      },
      {
        name: "Agra Cantt (AGC)",
        time: "07:50",
        distance: 195,
        stopDuration: "5 mins",
      },
      {
        name: "Gwalior (GWL)",
        time: "09:23",
        distance: 313,
        stopDuration: "5 mins",
      },
      {
        name: "Jhansi (VGLJ)",
        time: "10:45",
        distance: 410,
        stopDuration: "8 mins",
      },
      {
        name: "Bhopal Junction (BPL)",
        time: "14:10",
        distance: 701,
        stopDuration: "5 mins",
      },
      {
        name: "Rani Kamlapati (RKMP)",
        time: "14:40",
        distance: 708,
        stopDuration: "Arrival",
      },
    ],
    famousFood: [
      "Petha at Agra",
      "Bedmi Puri",
      "Hot Coffee & Breakfast onboard",
    ],
  },
  {
    trainNumber: "20901",
    trainName: "Vande Bharat Express",
    from: "Mumbai Central (MMCT)",
    to: "Gandhinagar Capital (GNC)",
    departureTime: "06:00",
    arrivalTime: "12:25",
    totalDistanceKm: 522,
    stations: [
      {
        name: "Mumbai Central (MMCT)",
        time: "06:00",
        distance: 0,
        stopDuration: "Departure",
      },
      {
        name: "Vapi (VAPI)",
        time: "07:43",
        distance: 168,
        stopDuration: "2 mins",
      },
      {
        name: "Surat (ST)",
        time: "08:53",
        distance: 263,
        stopDuration: "3 mins",
      },
      {
        name: "Vadodara (BRC)",
        time: "10:13",
        distance: 393,
        stopDuration: "3 mins",
      },
      {
        name: "Ahmedabad (ADI)",
        time: "11:30",
        distance: 493,
        stopDuration: "5 mins",
      },
      {
        name: "Gandhinagar Capital (GNC)",
        time: "12:25",
        distance: 522,
        stopDuration: "Arrival",
      },
    ],
    famousFood: [
      "Gujarati Snacks",
      "Dhokla & Khandvi",
      "Vande Bharat Gourmet Menu",
    ],
  },
  {
    trainNumber: "12626",
    trainName: "Kerala Superfast Express",
    from: "New Delhi (NDLS)",
    to: "Trivandrum Central (TVC)",
    departureTime: "20:10",
    arrivalTime: "18:00",
    totalDistanceKm: 3036,
    stations: [
      {
        name: "New Delhi (NDLS)",
        time: "20:10",
        distance: 0,
        stopDuration: "Departure",
      },
      {
        name: "Gwalior (GWL)",
        time: "00:03",
        distance: 313,
        stopDuration: "2 mins",
      },
      {
        name: "Nagpur (NGP)",
        time: "12:00",
        distance: 1094,
        stopDuration: "5 mins",
      },
      {
        name: "Vijayawada (BZA)",
        time: "20:40",
        distance: 1759,
        stopDuration: "10 mins",
      },
      {
        name: "Chennai Central (MAS)",
        time: "03:40",
        distance: 2190,
        stopDuration: "25 mins",
      },
      {
        name: "Ernakulam Junction (ERS)",
        time: "14:15",
        distance: 2830,
        stopDuration: "5 mins",
      },
      {
        name: "Trivandrum Central (TVC)",
        time: "18:00",
        distance: 3036,
        stopDuration: "Arrival",
      },
    ],
    famousFood: [
      "Nagpur Oranges",
      "Vijayawada Idli",
      "Banana Chips & Kerala Meals",
    ],
  },
];

const EMERGENCY_SERVICES = {
  railwayHelpline: "139",
  securityHelpline: "182",
  medicalHelp: "139 (Option 3)",
  womenSafety: "1091",
  disasterManagement: "1072",
};

module.exports = {
  JOURNEY_STATUS,
  DEFAULT_CHECKLIST_ITEMS,
  PRESET_TRAINS,
  EMERGENCY_SERVICES,
};
