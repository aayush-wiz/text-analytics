const natural = require("natural");
const AnalysisResult = require("../models/AnalysisResult");
const logger = require("../utils/logger");

/**
 * Main text analysis service
 */
class TextAnalysisService {
  /**
   * Analyze text using specified model and analysis type
   * @param {Object} textDocument - Text document to analyze
   * @param {String} analysisType - Type of analysis to perform
   * @param {Object} model - Model to use for analysis
   * @param {String} resultId - ID of the AnalysisResult document
   */
  async analyzeText(textDocument, analysisType, model, resultId) {
    const startTime = Date.now();
    logger.info(
      `Starting ${analysisType} analysis for document ${textDocument._id}`
    );

    try {
      // Get analysis method based on type
      let results;
      switch (analysisType) {
        case "sentiment":
          results = await this.analyzeSentiment(textDocument.content, model);
          break;
        case "keywords":
          results = await this.extractKeywords(textDocument.content, model);
          break;
        case "entities":
          results = await this.extractEntities(textDocument.content, model);
          break;
        case "summary":
          results = await this.generateSummary(textDocument.content, model);
          break;
        case "readability":
          results = await this.analyzeReadability(textDocument.content, model);
          break;
        case "complete":
          results = await this.performCompleteAnalysis(
            textDocument.content,
            model
          );
          break;
        default:
          throw new Error(`Unsupported analysis type: ${analysisType}`);
      }

      // Calculate processing time
      const processingTime = Date.now() - startTime;

      // Update analysis result
      await AnalysisResult.findByIdAndUpdate(
        resultId,
        {
          results: { [analysisType]: results },
          processingTime,
          status: "completed",
        },
        { new: true }
      );

      logger.info(
        `Completed ${analysisType} analysis for document ${textDocument._id} in ${processingTime}ms`
      );

      return results;
    } catch (error) {
      logger.error(`Error in ${analysisType} analysis:`, error);

      // Update analysis result with error
      await AnalysisResult.findByIdAndUpdate(resultId, {
        status: "failed",
        error: {
          code: error.code || "ANALYSIS_ERROR",
          message: error.message,
        },
      });

      throw error;
    }
  }

  /**
   * Perform sentiment analysis
   * @param {String} text - Text to analyze
   * @param {Object} model - Sentiment model to use
   */
  async analyzeSentiment(text, model) {
    // Using natural's AFINN-based sentiment analyzer
    const analyzer = new natural.SentimentAnalyzer(
      "English",
      natural.PorterStemmer,
      "afinn"
    );

    // Tokenize and normalize text
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());

    // Calculate sentiment
    const score = analyzer.getSentiment(tokens);

    // Analyze per-sentence sentiment to find positive and negative parts
    const sentenceTokenizer = new natural.SentenceTokenizer();
    const sentences = sentenceTokenizer.tokenize(text);

    const sentenceSentiments = sentences.map((sentence) => {
      const sentenceTokens = tokenizer.tokenize(sentence.toLowerCase());
      const sentimentScore = analyzer.getSentiment(sentenceTokens);
      return { sentence, score: sentimentScore };
    });

    // Filter sentences into positive, negative, and neutral
    const positive = sentenceSentiments
      .filter((s) => s.score > 0.2)
      .map((s) => s.sentence);

    const negative = sentenceSentiments
      .filter((s) => s.score < -0.2)
      .map((s) => s.sentence);

    const neutral = sentenceSentiments
      .filter((s) => s.score >= -0.2 && s.score <= 0.2)
      .map((s) => s.sentence);

    return {
      score,
      comparative: score / tokens.length,
      positive,
      negative,
      neutral,
    };
  }

  /**
   * Extract keywords from text
   * @param {String} text - Text to analyze
   * @param {Object} model - Keyword extraction model to use
   */
  async extractKeywords(text, model) {
    // Tokenize and normalize
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());

    // Remove stopwords using natural's English stopwords
    const stopwords = natural.stopwords;
    const filteredTokens = tokens.filter(
      (token) => !stopwords.includes(token) && token.length > 2
    );

    // Count token frequency
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(filteredTokens);

    // Extract top keywords
    const keywords = [];

    filteredTokens.forEach((token) => {
      // Check if token is already in keywords
      const existingKeyword = keywords.find((k) => k.word === token);

      if (existingKeyword) {
        existingKeyword.count += 1;
      } else {
        const score = tfidf.tfidf(token, 0);
        keywords.push({
          word: token,
          score: score,
          count: 1,
        });
      }
    });

    // Sort by score and limit to top 20
    return keywords.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  /**
   * Extract named entities from text
   * @param {String} text - Text to analyze
   * @param {Object} model - Named entity recognition model to use
   */
  async extractEntities(text, model) {
    // For this simplified implementation, we'll use a basic approach
    // In a production system, you'd use a dedicated NER model or service

    // Define some basic entity patterns for demonstration
    const personPattern =
      /\b(Mr\.|Mrs\.|Ms\.|Dr\.) [A-Z][a-z]+ [A-Z][a-z]+\b|\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const organizationPattern =
      /\b[A-Z][a-z]* (Inc\.|Corp\.|Corporation|Company|Co\.|Ltd\.|LLC)\b/g;
    const locationPattern =
      /\b[A-Z][a-z]+ (City|Town|Village|County|State|Province|Country)\b/g;
    const datePattern =
      /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}(st|nd|rd|th)?, \d{4}\b/g;
    const moneyPattern = /\$\d+(\.\d{2})?|\$\d{1,3}(,\d{3})*(\.\d{2})?/g;

    // Extract entities
    const entities = [];

    // Find person entities
    const persons = text.match(personPattern) || [];
    persons.forEach((person) => {
      const positions = this.findAllPositions(text, person);
      entities.push({
        entity: person,
        type: "person",
        count: positions.length,
        positions,
      });
    });

    // Find organization entities
    const organizations = text.match(organizationPattern) || [];
    organizations.forEach((org) => {
      const positions = this.findAllPositions(text, org);
      entities.push({
        entity: org,
        type: "organization",
        count: positions.length,
        positions,
      });
    });

    // Find location entities
    const locations = text.match(locationPattern) || [];
    locations.forEach((location) => {
      const positions = this.findAllPositions(text, location);
      entities.push({
        entity: location,
        type: "location",
        count: positions.length,
        positions,
      });
    });

    // Find date entities
    const dates = text.match(datePattern) || [];
    dates.forEach((date) => {
      const positions = this.findAllPositions(text, date);
      entities.push({
        entity: date,
        type: "date",
        count: positions.length,
        positions,
      });
    });

    // Find money entities
    const moneyValues = text.match(moneyPattern) || [];
    moneyValues.forEach((money) => {
      const positions = this.findAllPositions(text, money);
      entities.push({
        entity: money,
        type: "money",
        count: positions.length,
        positions,
      });
    });

    return entities;
  }

  /**
   * Generate a summary of the text
   * @param {String} text - Text to analyze
   * @param {Object} model - Summarization model to use
   */
  async generateSummary(text, model) {
    // Use extractive summarization with TF-IDF
    const sentenceTokenizer = new natural.SentenceTokenizer();
    const sentences = sentenceTokenizer.tokenize(text);

    // Skip if text is too short
    if (sentences.length <= 3) {
      return {
        abstractive: text,
        extractive: sentences,
        length: sentences.length,
      };
    }

    // Create TF-IDF model
    const tfidf = new natural.TfIdf();

    // Add each sentence as a document
    sentences.forEach((sentence) => {
      tfidf.addDocument(this.preprocessText(sentence));
    });

    // Calculate sentence scores based on TF-IDF
    const sentenceScores = sentences.map((sentence, index) => {
      let score = 0;
      const terms = this.preprocessText(sentence);

      // Sum TF-IDF scores for each term in the sentence
      terms.forEach((term) => {
        score += tfidf.tfidf(term, index);
      });

      // Normalize by sentence length to avoid bias towards longer sentences
      score = terms.length > 0 ? score / terms.length : 0;

      return { sentence, score, index };
    });

    // Sort sentences by score
    const rankedSentences = sentenceScores.sort((a, b) => b.score - a.score);

    // Select top sentences (about 30% of original text)
    const numSentencesToExtract = Math.max(
      3,
      Math.ceil(sentences.length * 0.3)
    );
    const topSentences = rankedSentences.slice(0, numSentencesToExtract);

    // Sort selected sentences by original order
    const orderedTopSentences = topSentences.sort((a, b) => a.index - b.index);
    const extractive = orderedTopSentences.map((s) => s.sentence);

    // Create abstractive summary (in a real app, this would use a more sophisticated model)
    const abstractive = extractive.join(" ");

    return {
      abstractive,
      extractive,
      length: extractive.length,
    };
  }

  /**
   * Analyze readability of text
   * @param {String} text - Text to analyze
   * @param {Object} model - Readability model to use
   */
  async analyzeReadability(text, model) {
    // Word and sentence tokenization
    const wordTokenizer = new natural.WordTokenizer();
    const sentenceTokenizer = new natural.SentenceTokenizer();

    const sentences = sentenceTokenizer.tokenize(text);
    const words = wordTokenizer.tokenize(text);

    // Calculate number of syllables (simple approximation)
    const syllableCount = words.reduce((total, word) => {
      return total + this.countSyllables(word);
    }, 0);

    // Calculate readability metrics

    // Flesch-Kincaid Grade Level
    const fleschKincaid =
      0.39 * (words.length / sentences.length) +
      11.8 * (syllableCount / words.length) -
      15.59;

    // Gunning Fog Index
    const complexWords = words.filter(
      (word) => this.countSyllables(word) > 2
    ).length;
    const gunningFog =
      0.4 *
      (words.length / sentences.length + 100 * (complexWords / words.length));

    // Coleman-Liau Index
    const l = (words.join("").length / words.length) * 100; // avg num of characters per 100 words
    const s = (sentences.length / words.length) * 100; // avg num of sentences per 100 words
    const colemanLiau = 0.0588 * l - 0.296 * s - 15.8;

    // Automated Readability Index
    const characters = text.replace(/\s/g, "").length;
    const automatedReadability =
      4.71 * (characters / words.length) +
      0.5 * (words.length / sentences.length) -
      21.43;

    // Estimate reading time (assuming average reading speed of 200 words per minute)
    const readingTime = words.length / 200;

    return {
      fleschKincaid: parseFloat(fleschKincaid.toFixed(2)),
      gunningFog: parseFloat(gunningFog.toFixed(2)),
      colemanLiau: parseFloat(colemanLiau.toFixed(2)),
      automatedReadability: parseFloat(automatedReadability.toFixed(2)),
      readingTime: parseFloat(readingTime.toFixed(2)),
    };
  }

  /**
   * Perform comprehensive analysis
   * @param {String} text - Text to analyze
   * @param {Object} model - Combined model to use
   */
  async performCompleteAnalysis(text, model) {
    const sentiment = await this.analyzeSentiment(text, model);
    const keywords = await this.extractKeywords(text, model);
    const entities = await this.extractEntities(text, model);
    const summary = await this.generateSummary(text, model);
    const readability = await this.analyzeReadability(text, model);

    return {
      sentiment,
      keywords,
      entities,
      summary,
      readability,
    };
  }

  /**
   * Helper: Find all positions of a substring in text
   * @param {String} text - Text to search in
   * @param {String} substring - Substring to search for
   * @returns {Array} Array of [start, end] positions
   */
  findAllPositions(text, substring) {
    const positions = [];
    let index = text.indexOf(substring);

    while (index !== -1) {
      positions.push([index, index + substring.length]);
      index = text.indexOf(substring, index + 1);
    }

    return positions;
  }

  /**
   * Helper: Count syllables in a word (approximate)
   * @param {String} word - Word to count syllables for
   * @returns {Number} Number of syllables
   */
  countSyllables(word) {
    word = word.toLowerCase();

    // Remove non-alphabetic characters
    word = word.replace(/[^a-z]/g, "");

    // Special cases
    if (word.length <= 3) return 1;

    // Count vowel groups as syllables
    word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");

    const syllables = word.match(/[aeiouy]{1,2}/g);

    return syllables ? syllables.length : 1;
  }

  /**
   * Helper: Preprocess text for analysis
   * @param {String} text - Text to preprocess
   * @returns {Array} Array of preprocessed terms
   */
  preprocessText(text) {
    // Tokenize
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());

    // Remove stopwords and short words
    const stopwords = natural.stopwords;
    const filteredTokens = tokens.filter(
      (token) => !stopwords.includes(token) && token.length > 2
    );

    // Stem words
    const stemmer = natural.PorterStemmer;
    return filteredTokens.map((token) => stemmer.stem(token));
  }
}

module.exports = new TextAnalysisService();
