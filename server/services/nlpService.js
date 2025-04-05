const natural = require("natural");
const tokenizer = require("../utils/tokenizer");
const logger = require("../utils/logger");

/**
 * NLP Service for advanced text processing
 */
class NLPService {
  constructor() {
    // Initialize NLP components
    this.tfidf = new natural.TfIdf();
    this.classifier = new natural.BayesClassifier();
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;

    // Load language-specific stemmers
    this.stemmers = {
      en: natural.PorterStemmer,
      es: natural.PorterStemmerEs,
      fr: natural.PorterStemmerFr,
    };
  }

  /**
   * Detect language of text (basic implementation)
   * @param {String} text - Text to analyze
   * @returns {String} Detected language code
   */
  detectLanguage(text) {
    // In a real application, you'd use a more sophisticated language detection library
    // This is a simple approximation based on common words

    const tokens = this.tokenizer.tokenize(text.toLowerCase());

    // Count language-specific common words
    const langs = {
      en: ["the", "and", "of", "to", "in", "that", "is", "was", "it", "for"],
      es: ["el", "la", "de", "que", "y", "a", "en", "un", "ser", "se"],
      fr: ["le", "la", "de", "et", "à", "en", "un", "est", "que", "dans"],
      de: [
        "der",
        "die",
        "das",
        "und",
        "zu",
        "in",
        "den",
        "ist",
        "von",
        "nicht",
      ],
    };

    const scores = {
      en: 0,
      es: 0,
      fr: 0,
      de: 0,
    };

    // Score each language
    tokens.forEach((token) => {
      Object.keys(langs).forEach((lang) => {
        if (langs[lang].includes(token)) {
          scores[lang]++;
        }
      });
    });

    // Find language with highest score
    let detectedLang = "en"; // Default to English
    let maxScore = 0;

    Object.keys(scores).forEach((lang) => {
      if (scores[lang] > maxScore) {
        maxScore = scores[lang];
        detectedLang = lang;
      }
    });

    return detectedLang;
  }

  /**
   * Classify text into predefined categories
   * @param {String} text - Text to classify
   * @param {Array} categories - Predefined categories with training data
   * @returns {Object} Classification results
   */
  classifyText(text, categories = []) {
    try {
      // If classifier not trained, train it first
      if (categories.length > 0) {
        this.trainClassifier(categories);
      }

      // Classify text
      const classification = this.classifier.classify(text);
      const classifications = this.classifier.getClassifications(text);

      return {
        category: classification,
        confidence: classifications[0].value,
        allCategories: classifications.map((c) => ({
          category: c.label,
          confidence: c.value,
        })),
      };
    } catch (error) {
      logger.error("Text classification error:", error);
      return {
        category: "unknown",
        confidence: 0,
        allCategories: [],
      };
    }
  }

  /**
   * Train classifier with categories and example texts
   * @param {Array} categories - Array of {name, examples} objects
   */
  trainClassifier(categories) {
    // Reset classifier
    this.classifier = new natural.BayesClassifier();

    // Add examples to classifier
    categories.forEach((category) => {
      category.examples.forEach((example) => {
        this.classifier.addDocument(example, category.name);
      });
    });

    // Train classifier
    this.classifier.train();

    logger.info(`Classifier trained with ${categories.length} categories`);
  }

  /**
   * Find similar documents based on TF-IDF
   * @param {String} queryText - Text to find similar documents for
   * @param {Array} documents - Array of {id, text} objects
   * @param {Number} limit - Maximum number of similar documents to return
   * @returns {Array} Similar documents with similarity scores
   */
  findSimilarDocuments(queryText, documents, limit = 5) {
    // Reset TF-IDF
    this.tfidf = new natural.TfIdf();

    // Add documents
    documents.forEach((doc, index) => {
      this.tfidf.addDocument(this.preprocessText(doc.text));
    });

    // Process query
    const queryTerms = this.preprocessText(queryText);

    // Calculate similarity scores
    const similarities = documents.map((doc, docIndex) => {
      let score = 0;

      // Sum TF-IDF scores for query terms
      queryTerms.forEach((term) => {
        score += this.tfidf.tfidf(term, docIndex);
      });

      // Normalize by query length
      score = queryTerms.length > 0 ? score / queryTerms.length : 0;

      return {
        id: doc.id,
        similarity: score,
      };
    });

    // Sort by similarity and limit results
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Extract key phrases from text
   * @param {String} text - Text to extract key phrases from
   * @param {Number} limit - Maximum number of phrases to extract
   * @returns {Array} Key phrases with scores
   */
  extractKeyPhrases(text, limit = 10) {
    const sentences = tokenizer.tokenizeSentences(text);
    const wordScores = {};

    // Score words using TF-IDF
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(this.preprocessText(text));

    const tokens = this.preprocessText(text);
    tokens.forEach((token) => {
      wordScores[token] = tfidf.tfidf(token, 0);
    });

    // Extract potential phrases (2-3 words)
    const phrases = [];

    sentences.forEach((sentence) => {
      const words = tokenizer.tokenizeWords(sentence);

      // Extract bigrams
      for (let i = 0; i < words.length - 1; i++) {
        if (this.isContentWord(words[i]) && this.isContentWord(words[i + 1])) {
          const phrase = `${words[i]} ${words[i + 1]}`;
          const score =
            (wordScores[words[i]] || 0) + (wordScores[words[i + 1]] || 0);

          phrases.push({
            phrase,
            score,
          });
        }
      }

      // Extract trigrams
      for (let i = 0; i < words.length - 2; i++) {
        if (this.isContentWord(words[i]) && this.isContentWord(words[i + 2])) {
          const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
          const score =
            (wordScores[words[i]] || 0) +
            (wordScores[words[i + 1]] || 0) +
            (wordScores[words[i + 2]] || 0);

          phrases.push({
            phrase,
            score,
          });
        }
      }
    });

    // Remove duplicates
    const uniquePhrases = [];
    const seen = new Set();

    phrases.forEach((item) => {
      if (!seen.has(item.phrase)) {
        seen.add(item.phrase);
        uniquePhrases.push(item);
      }
    });

    // Sort by score and limit results
    return uniquePhrases.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Get text complexity metrics
   * @param {String} text - Text to analyze
   * @returns {Object} Complexity metrics
   */
  getTextComplexity(text) {
    const sentences = tokenizer.tokenizeSentences(text);
    const words = tokenizer.tokenizeWords(text);

    // Calculate vocabulary richness
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const typeTokenRatio = uniqueWords.size / words.length;

    // Average sentence length
    const avgSentenceLength = words.length / sentences.length;

    // Average word length
    const totalCharacters = words.join("").length;
    const avgWordLength = totalCharacters / words.length;

    // Calculate percentage of complex words (>3 syllables)
    const complexWords = words.filter(
      (word) => tokenizer.countSyllables(word) > 2
    );
    const complexWordPercentage = (complexWords.length / words.length) * 100;

    return {
      typeTokenRatio,
      avgSentenceLength,
      avgWordLength,
      avgSyllablesPerWord: tokenizer.averageSyllablesPerWord(text),
      complexWordPercentage,
    };
  }

  /**
   * Check if a word is likely to be a content word (not a function word)
   * @param {String} word - Word to check
   * @returns {Boolean} True if likely a content word
   */
  isContentWord(word) {
    if (!word || word.length < 3) return false;

    // Common function words to filter out
    const functionWords = new Set([
      "the",
      "and",
      "that",
      "have",
      "for",
      "not",
      "this",
      "but",
      "with",
      "you",
      "are",
      "his",
      "her",
      "they",
      "will",
      "from",
      "all",
      "can",
      "has",
      "been",
    ]);

    return !functionWords.has(word.toLowerCase());
  }

  /**
   * Preprocess text for analysis
   * @param {String} text - Text to preprocess
   * @param {String} lang - Language code
   * @returns {Array} Preprocessed tokens
   */
  preprocessText(text, lang = "en") {
    // Tokenize
    const tokens = this.tokenizer.tokenize(text.toLowerCase());

    // Remove stopwords and short words
    const stopwords = natural.stopwords;
    const filteredTokens = tokens.filter(
      (token) => !stopwords.includes(token) && token.length > 2
    );

    // Get appropriate stemmer for language
    const stemmer = this.stemmers[lang] || this.stemmers.en;

    // Stem words
    return filteredTokens.map((token) => stemmer.stem(token));
  }
}

module.exports = new NLPService();
