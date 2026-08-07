const {
  verifyPNR,
  getPNRHistory,
} = require("./pnr.service");

// ==========================================
// Verify PNR
// ==========================================
const verifyPNRController = async (req, res) => {
  try {
    console.log("✅ Controller reached");
    console.log("Request Body:", req.body);

    // Check if PNR is provided
    if (!req.body || !req.body.pnr) {
      return res.status(400).json({
        success: false,
        message: "PNR number is required",
      });
    }

    // Get PNR from request body
    const { pnr } = req.body;

    console.log("PNR:", pnr);

    // Call service
    const result = await verifyPNR(pnr);

    console.log("RapidAPI Result:");
    console.log(JSON.stringify(result, null, 2));

    // Return API response
    return res.status(200).json(result);

  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get PNR History
// ==========================================
const getPNRHistoryController = async (req, res) => {
  try {
    const history = await getPNRHistory();

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  verifyPNRController,
  getPNRHistoryController,
};