const lostItemService = require("./lostItem.service");

// Verify PNR
const verifyPNRController = async (req, res) => {
  try {
    const { pnr } = req.body;
    const result = await lostItemService.verifyPNRForLostItem(pnr);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Verify PNR Error:", error);
    return res.status(500).json({
      success: false,
      message: "Journey not found.",
      error: error.message,
    });
  }
};

// Report Lost Item
const reportLostItemController = async (req, res) => {
  try {
    const item = await lostItemService.createLostItemReport(req.body);
    return res.status(201).json({
      success: true,
      message: "Lost Item report created successfully.",
      data: item,
    });
  } catch (error) {
    console.error("Report Lost Item Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create lost item report.",
    });
  }
};

// Get My Lost Items
const getMyLostItemsController = async (req, res) => {
  try {
    const { pnr } = req.query;
    const items = await lostItemService.getMyLostItems(pnr);
    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get Lost Items Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Lost Item By ID
const getLostItemByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await lostItemService.getLostItemById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get Lost Item By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update Lost Item Status
const updateStatusController = async (req, res) => {
  try {
    const { id, status } = req.body;
    const targetId = id || req.params.id;

    if (!targetId || !status) {
      return res.status(400).json({
        success: false,
        message: "Item ID and Status are required.",
      });
    }

    const updatedItem = await lostItemService.updateLostItemStatus(targetId, status);
    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: updatedItem,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update status.",
    });
  }
};

module.exports = {
  verifyPNRController,
  reportLostItemController,
  getMyLostItemsController,
  getLostItemByIdController,
  updateStatusController,
};
