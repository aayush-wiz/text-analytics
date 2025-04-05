const mongoose = require("mongoose");

const AnalysisResultSchema = new mongoose.Schema(
  {
    textDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TextDocument",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    analysisType: {
      type: String,
      enum: [
        "sentiment",
        "keywords",
        "entities",
        "summary",
        "readability",
        "complete",
      ],
      required: true,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    results: {
      // Sentiment analysis results
      sentiment: {
        score: Number, // -1 to 1
        comparative: Number,
        positive: [String],
        negative: [String],
        neutral: [String],
      },

      // Keyword extraction results
      keywords: [
        {
          word: String,
          score: Number,
          count: Number,
        },
      ],

      // Named entity recognition results
      entities: [
        {
          entity: String,
          type: {
            type: String,
            enum: [
              "person",
              "organization",
              "location",
              "date",
              "money",
              "percent",
              "other",
            ],
          },
          count: Number,
          positions: [[Number]], // Array of [start, end] positions
        },
      ],

      // Summarization results
      summary: {
        abstractive: String,
        extractive: [String], // Key sentences
        length: Number,
      },

      // Readability analysis results
      readability: {
        fleschKincaid: Number,
        gunningFog: Number,
        colemanLiau: Number,
        automatedReadability: Number,
        readingTime: Number, // in minutes
      },
    },
    processingTime: Number, // in milliseconds
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    error: {
      code: String,
      message: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique analysis type per document
AnalysisResultSchema.index(
  { textDocument: 1, analysisType: 1 },
  { unique: true }
);

module.exports = mongoose.model("AnalysisResult", AnalysisResultSchema);
