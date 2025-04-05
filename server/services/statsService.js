const TextDocument = require("../models/TextDocument");
const AnalysisResult = require("../models/AnalysisResult");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Statistical analysis service for aggregating and analyzing application data
 */
class StatsService {
  /**
   * Get system-wide statistics
   * @returns {Object} System statistics
   */
  async getSystemStats() {
    try {
      // Count total documents in the system
      const documentCount = await TextDocument.countDocuments();

      // Count total analysis results
      const analysisCount = await AnalysisResult.countDocuments();

      // Count total users
      const userCount = await User.countDocuments();

      // Get average analyses per document
      const avgAnalysesPerDoc =
        documentCount > 0 ? analysisCount / documentCount : 0;

      // Get analysis type breakdown
      const analysisTypes = await AnalysisResult.aggregate([
        { $group: { _id: "$analysisType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get document content type breakdown
      const contentTypes = await TextDocument.aggregate([
        { $group: { _id: "$contentType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get document language breakdown
      const languages = await TextDocument.aggregate([
        { $group: { _id: "$language", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get document status breakdown
      const statuses = await TextDocument.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get user creation stats by month
      const userGrowth = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      // Get document creation stats by month
      const documentGrowth = await TextDocument.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      return {
        counts: {
          users: userCount,
          documents: documentCount,
          analyses: analysisCount,
        },
        averages: {
          analysesPerDocument: parseFloat(avgAnalysesPerDoc.toFixed(2)),
        },
        breakdowns: {
          analysisTypes: analysisTypes.map((item) => ({
            type: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / analysisCount) * 100).toFixed(2)
            ),
          })),
          contentTypes: contentTypes.map((item) => ({
            type: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / documentCount) * 100).toFixed(2)
            ),
          })),
          languages: languages.map((item) => ({
            language: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / documentCount) * 100).toFixed(2)
            ),
          })),
          statuses: statuses.map((item) => ({
            status: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / documentCount) * 100).toFixed(2)
            ),
          })),
        },
        growth: {
          users: userGrowth.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            count: item.count,
          })),
          documents: documentGrowth.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            count: item.count,
          })),
        },
      };
    } catch (error) {
      logger.error("Error getting system stats:", error);
      throw error;
    }
  }

  /**
   * Get statistics for a specific user
   * @param {String} userId - User ID
   * @returns {Object} User statistics
   */
  async getUserStats(userId) {
    try {
      // Count user's documents
      const documentCount = await TextDocument.countDocuments({ user: userId });

      // Count user's analyses
      const analysisCount = await AnalysisResult.countDocuments({
        user: userId,
      });

      // Get most active month
      const monthlyActivity = await TextDocument.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]);

      // Get document content type breakdown
      const contentTypes = await TextDocument.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$contentType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get document language breakdown
      const languages = await TextDocument.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$language", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get document status breakdown
      const statuses = await TextDocument.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get analysis type breakdown
      const analysisTypes = await AnalysisResult.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$analysisType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Get document creation stats by month
      const documentGrowth = await TextDocument.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      // Get most active month formatted
      const mostActiveMonth =
        monthlyActivity.length > 0
          ? {
              year: monthlyActivity[0]._id.year,
              month: monthlyActivity[0]._id.month,
              count: monthlyActivity[0].count,
            }
          : null;

      return {
        counts: {
          documents: documentCount,
          analyses: analysisCount,
        },
        mostActiveMonth,
        breakdowns: {
          contentTypes: contentTypes.map((item) => ({
            type: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / documentCount) * 100).toFixed(2)
            ),
          })),
          languages: languages.map((item) => ({
            language: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / documentCount) * 100).toFixed(2)
            ),
          })),
          statuses: statuses.map((item) => ({
            status: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / documentCount) * 100).toFixed(2)
            ),
          })),
          analysisTypes: analysisTypes.map((item) => ({
            type: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / analysisCount) * 100).toFixed(2)
            ),
          })),
        },
        growth: {
          documents: documentGrowth.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            count: item.count,
          })),
        },
      };
    } catch (error) {
      logger.error(`Error getting stats for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get document metadata statistics
   * @returns {Object} Document metadata statistics
   */
  async getDocumentMetadataStats() {
    try {
      // Get aggregate metadata stats
      const metadataStats = await TextDocument.aggregate([
        {
          $group: {
            _id: null,
            avgWordCount: { $avg: "$metadata.wordCount" },
            avgCharCount: { $avg: "$metadata.charCount" },
            avgSentenceCount: { $avg: "$metadata.sentenceCount" },
            avgParagraphCount: { $avg: "$metadata.paragraphCount" },
            maxWordCount: { $max: "$metadata.wordCount" },
            maxCharCount: { $max: "$metadata.charCount" },
            maxSentenceCount: { $max: "$metadata.sentenceCount" },
            maxParagraphCount: { $max: "$metadata.paragraphCount" },
            minWordCount: { $min: "$metadata.wordCount" },
            minCharCount: { $min: "$metadata.charCount" },
            minSentenceCount: { $min: "$metadata.sentenceCount" },
            minParagraphCount: { $min: "$metadata.paragraphCount" },
            totalWordCount: { $sum: "$metadata.wordCount" },
            totalCharCount: { $sum: "$metadata.charCount" },
            totalSentenceCount: { $sum: "$metadata.sentenceCount" },
            totalParagraphCount: { $sum: "$metadata.paragraphCount" },
            documentCount: { $sum: 1 },
          },
        },
      ]);

      // Calculate word count distribution
      const wordCountDistribution = await TextDocument.aggregate([
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  {
                    case: { $lt: ["$metadata.wordCount", 100] },
                    then: "< 100 words",
                  },
                  {
                    case: { $lt: ["$metadata.wordCount", 500] },
                    then: "100-500 words",
                  },
                  {
                    case: { $lt: ["$metadata.wordCount", 1000] },
                    then: "500-1,000 words",
                  },
                  {
                    case: { $lt: ["$metadata.wordCount", 3000] },
                    then: "1,000-3,000 words",
                  },
                  {
                    case: { $lt: ["$metadata.wordCount", 5000] },
                    then: "3,000-5,000 words",
                  },
                ],
                default: "5,000+ words",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      // Format the results
      const stats = metadataStats.length > 0 ? metadataStats[0] : {};
      delete stats._id;

      // Convert averages to fixed decimal places
      Object.keys(stats).forEach((key) => {
        if (key.startsWith("avg")) {
          stats[key] = parseFloat(stats[key].toFixed(2));
        }
      });

      return {
        averages: {
          wordCount: stats.avgWordCount,
          charCount: stats.avgCharCount,
          sentenceCount: stats.avgSentenceCount,
          paragraphCount: stats.avgParagraphCount,
        },
        maximums: {
          wordCount: stats.maxWordCount,
          charCount: stats.maxCharCount,
          sentenceCount: stats.maxSentenceCount,
          paragraphCount: stats.maxParagraphCount,
        },
        minimums: {
          wordCount: stats.minWordCount,
          charCount: stats.minCharCount,
          sentenceCount: stats.minSentenceCount,
          paragraphCount: stats.minParagraphCount,
        },
        totals: {
          wordCount: stats.totalWordCount,
          charCount: stats.totalCharCount,
          sentenceCount: stats.totalSentenceCount,
          paragraphCount: stats.totalParagraphCount,
          documentCount: stats.documentCount,
        },
        distributions: {
          wordCount: wordCountDistribution.map((item) => ({
            range: item._id,
            count: item.count,
            percentage: parseFloat(
              ((item.count / stats.documentCount) * 100).toFixed(2)
            ),
          })),
        },
      };
    } catch (error) {
      logger.error("Error getting document metadata stats:", error);
      throw error;
    }
  }

  /**
   * Get analysis results statistics
   * @returns {Object} Analysis results statistics
   */
  async getAnalysisResultsStats() {
    try {
      // Get aggregate analysis stats
      const analysisStats = await AnalysisResult.aggregate([
        {
          $group: {
            _id: null,
            avgProcessingTime: { $avg: "$processingTime" },
            maxProcessingTime: { $max: "$processingTime" },
            minProcessingTime: { $min: "$processingTime" },
            totalProcessingTime: { $sum: "$processingTime" },
            totalResults: { $sum: 1 },
            completedCount: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            failedCount: {
              $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
            },
            pendingCount: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            processingCount: {
              $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] },
            },
          },
        },
      ]);

      // Get analysis type statistics
      const analysisTypes = await AnalysisResult.aggregate([
        {
          $group: {
            _id: "$analysisType",
            count: { $sum: 1 },
            avgProcessingTime: { $avg: "$processingTime" },
            successRate: {
              $avg: {
                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
              },
            },
          },
        },
        { $sort: { count: -1 } },
      ]);

      // Get model usage statistics
      const modelUsage = await AnalysisResult.aggregate([
        {
          $lookup: {
            from: "models",
            localField: "model",
            foreignField: "_id",
            as: "modelInfo",
          },
        },
        {
          $unwind: "$modelInfo",
        },
        {
          $group: {
            _id: {
              modelId: "$model",
              modelName: "$modelInfo.name",
              modelType: "$modelInfo.type",
            },
            count: { $sum: 1 },
            avgProcessingTime: { $avg: "$processingTime" },
            successRate: {
              $avg: {
                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
              },
            },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      // Format the results
      const stats = analysisStats.length > 0 ? analysisStats[0] : {};
      delete stats._id;

      // Convert averages and times to fixed decimal places
      if (stats.avgProcessingTime) {
        stats.avgProcessingTime = parseFloat(
          (stats.avgProcessingTime / 1000).toFixed(2)
        ); // Convert to seconds
      }
      if (stats.maxProcessingTime) {
        stats.maxProcessingTime = parseFloat(
          (stats.maxProcessingTime / 1000).toFixed(2)
        ); // Convert to seconds
      }
      if (stats.minProcessingTime) {
        stats.minProcessingTime = parseFloat(
          (stats.minProcessingTime / 1000).toFixed(2)
        ); // Convert to seconds
      }
      if (stats.totalProcessingTime) {
        stats.totalProcessingTime = parseFloat(
          (stats.totalProcessingTime / 1000).toFixed(2)
        ); // Convert to seconds
      }

      // Calculate success rate
      const successRate =
        stats.totalResults > 0
          ? (stats.completedCount / stats.totalResults) * 100
          : 0;

      return {
        counts: {
          total: stats.totalResults || 0,
          completed: stats.completedCount || 0,
          failed: stats.failedCount || 0,
          pending: stats.pendingCount || 0,
          processing: stats.processingCount || 0,
        },
        times: {
          avgProcessingTime: stats.avgProcessingTime || 0,
          maxProcessingTime: stats.maxProcessingTime || 0,
          minProcessingTime: stats.minProcessingTime || 0,
          totalProcessingTime: stats.totalProcessingTime || 0,
        },
        rates: {
          successRate: parseFloat(successRate.toFixed(2)),
        },
        byType: analysisTypes.map((item) => ({
          type: item._id,
          count: item.count,
          percentage: parseFloat(
            ((item.count / stats.totalResults) * 100).toFixed(2)
          ),
          avgProcessingTime: parseFloat(
            (item.avgProcessingTime / 1000).toFixed(2)
          ),
          successRate: parseFloat((item.successRate * 100).toFixed(2)),
        })),
        byModel: modelUsage.map((item) => ({
          modelId: item._id.modelId,
          modelName: item._id.modelName,
          modelType: item._id.modelType,
          count: item.count,
          percentage: parseFloat(
            ((item.count / stats.totalResults) * 100).toFixed(2)
          ),
          avgProcessingTime: parseFloat(
            (item.avgProcessingTime / 1000).toFixed(2)
          ),
          successRate: parseFloat((item.successRate * 100).toFixed(2)),
        })),
      };
    } catch (error) {
      logger.error("Error getting analysis results stats:", error);
      throw error;
    }
  }

  /**
   * Get trending keywords across all analyzed documents
   * @param {Number} limit - Maximum number of keywords to return
   * @returns {Array} Array of trending keywords with counts
   */
  async getTrendingKeywords(limit = 20) {
    try {
      // Get all keyword analysis results
      const keywordResults = await AnalysisResult.find({
        analysisType: "keywords",
        status: "completed",
      }).select("results.keywords");

      // Aggregate keywords across all results
      const keywordMap = new Map();

      keywordResults.forEach((result) => {
        const keywords = result.results?.keywords || [];

        keywords.forEach((keyword) => {
          const word = keyword.word.toLowerCase();
          const currentCount = keywordMap.get(word) || { count: 0, score: 0 };

          keywordMap.set(word, {
            count: currentCount.count + (keyword.count || 1),
            score: currentCount.score + (keyword.score || 0),
          });
        });
      });

      // Convert map to array and sort by count
      const trendingKeywords = Array.from(keywordMap.entries())
        .map(([word, data]) => ({
          word,
          count: data.count,
          averageScore: data.score / data.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return trendingKeywords;
    } catch (error) {
      logger.error("Error getting trending keywords:", error);
      throw error;
    }
  }
}

module.exports = new StatsService();
