const natural = require("natural");

/**
 * Text tokenization and processing utilities
 */
class TokenizerUtils {
  constructor() {
    // Initialize tokenizers for different purposes
    this.wordTokenizer = new natural.WordTokenizer();
    this.sentenceTokenizer = new natural.SentenceTokenizer();
    this.stopwords = natural.stopwords;
  }

  /**
   * Split text into word tokens
   * @param {string} text - The text to tokenize
   * @param {boolean} removeStopwords - Whether to remove stopwords
   * @returns {string[]} Array of tokens
   */
  tokenizeWords(text, removeStopwords = false) {
    const tokens = this.wordTokenizer.tokenize(text.toLowerCase());

    if (removeStopwords) {
      return tokens.filter((token) => !this.stopwords.includes(token));
    }

    return tokens;
  }

  /**
   * Split text into sentences
   * @param {string} text - The text to tokenize into sentences
   * @returns {string[]} Array of sentences
   */
  tokenizeSentences(text) {
    return this.sentenceTokenizer.tokenize(text);
  }

  /**
   * Count words in text
   * @param {string} text - The text to count words in
   * @returns {number} Word count
   */
  countWords(text) {
    return this.tokenizeWords(text).length;
  }

  /**
   * Count sentences in text
   * @param {string} text - The text to count sentences in
   * @returns {number} Sentence count
   */
  countSentences(text) {
    return this.tokenizeSentences(text).length;
  }

  /**
   * Count paragraphs in text
   * @param {string} text - The text to count paragraphs in
   * @returns {number} Paragraph count
   */
  countParagraphs(text) {
    // Split by double line breaks and filter empty paragraphs
    return text.split(/\n\s*\n/).filter(Boolean).length;
  }

  /**
   * Count syllables in a word (approximate)
   * @param {string} word - Word to count syllables for
   * @returns {number} Number of syllables
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
   * Calculate average syllables per word in text
   * @param {string} text - The text to analyze
   * @returns {number} Average syllables per word
   */
  averageSyllablesPerWord(text) {
    const words = this.tokenizeWords(text);

    if (words.length === 0) {
      return 0;
    }

    const totalSyllables = words.reduce((total, word) => {
      return total + this.countSyllables(word);
    }, 0);

    return totalSyllables / words.length;
  }

  /**
   * Calculate average words per sentence in text
   * @param {string} text - The text to analyze
   * @returns {number} Average words per sentence
   */
  averageWordsPerSentence(text) {
    const sentences = this.tokenizeSentences(text);

    if (sentences.length === 0) {
      return 0;
    }

    const wordCounts = sentences.map((sentence) => this.countWords(sentence));
    const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);

    return totalWords / sentences.length;
  }

  /**
   * Get word frequency distribution from text
   * @param {string} text - The text to analyze
   * @param {boolean} removeStopwords - Whether to remove stopwords
   * @returns {Object} Object with words as keys and frequencies as values
   */
  getWordFrequency(text, removeStopwords = true) {
    const tokens = this.tokenizeWords(text, removeStopwords);
    const frequency = {};

    tokens.forEach((token) => {
      if (token.length > 1) {
        // Skip single-character tokens
        frequency[token] = (frequency[token] || 0) + 1;
      }
    });

    return frequency;
  }

  /**
   * Stem words using Porter stemmer
   * @param {string[]} words - Array of words to stem
   * @returns {string[]} Array of stemmed words
   */
  stemWords(words) {
    return words.map((word) => natural.PorterStemmer.stem(word));
  }

  /**
   * Generate n-grams from text
   * @param {string} text - The text to generate n-grams from
   * @param {number} n - The size of n-grams (2 for bigrams, 3 for trigrams, etc.)
   * @returns {string[][]} Array of n-grams (each n-gram is an array of tokens)
   */
  generateNGrams(text, n = 2) {
    const tokens = this.tokenizeWords(text);
    const NGrams = new natural.NGrams();
    return NGrams.ngrams(tokens, n);
  }

  /**
   * Calculate normalized term frequency (TF) for a term in a document
   * @param {string} term - The term to calculate TF for
   * @param {string} document - The document text
   * @returns {number} The term frequency
   */
  calculateTermFrequency(term, document) {
    const tokens = this.tokenizeWords(document);
    const termCount = tokens.filter((token) => token === term).length;

    if (tokens.length === 0) {
      return 0;
    }

    return termCount / tokens.length;
  }
}

module.exports = new TokenizerUtils();
