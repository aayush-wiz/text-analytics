const mongoose = require("mongoose");

const TextDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please add document content"],
      maxlength: [50000, "Document content cannot exceed 50,000 characters"],
    },
    language: {
      type: String,
      enum: ["en", "es", "fr", "de"],
      default: "en",
    },
    contentType: {
      type: String,
      enum: ["article", "blog", "essay", "report", "other"],
      default: "other",
    },
    tags: [String],
    metadata: {
      wordCount: Number,
      charCount: Number,
      sentenceCount: Number,
      paragraphCount: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "analyzed", "archived"],
      default: "draft",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for full-text search
TextDocumentSchema.index({ title: "text", content: "text", tags: "text" });

// Virtual for analysis results
TextDocumentSchema.virtual("analysisResults", {
  ref: "AnalysisResult",
  localField: "_id",
  foreignField: "textDocument",
  justOne: false,
});

// Generate document metadata before saving
TextDocumentSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const content = this.content || "";
    const words = content.split(/\s+/).filter(Boolean);
    const sentences = content.split(/[.!?]+/).filter(Boolean);
    const paragraphs = content.split(/\n\s*\n/).filter(Boolean);

    this.metadata = {
      wordCount: words.length,
      charCount: content.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
    };
  }
  next();
});

module.exports = mongoose.model("TextDocument", TextDocumentSchema);
