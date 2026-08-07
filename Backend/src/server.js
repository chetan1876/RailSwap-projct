require("dotenv").config();

require("../config/firebase");




const app = require("./app");

const PORT = process.env.PORT || 5000;





app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});


app.listen(PORT, () => {
    console.log(`
========================================
🚀 Server is running successfully
🌐 URL  : http://localhost:${PORT}
📦 Port : ${PORT}
========================================
`);
});

