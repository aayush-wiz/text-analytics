const dotenv = require("dotenv");

// Load env vars
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "24h",
  logLevel: process.env.LOG_LEVEL || "info",

  // Text analysis settings
  analysis: {
    defaultLanguage: "en",
    maxTextLength: 50000, // Maximum characters for analysis
    supportedLanguages: ["en", "es", "fr", "de"],
    defaultAnalysisOptions: {
      sentiment: true,
      keywords: true,
      entities: true,
      summary: false,
      readability: true,
    },
  },
};
