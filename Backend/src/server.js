require("dotenv").config();
require("../config/firebase");

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("========================================");
  console.log("🚀 RailSwap Backend Started Successfully");
  console.log(`📦 Port : ${PORT}`);
  console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
  console.log("========================================");
});