import React from "react";
import { ReadabilityAnalysis as ReadabilityType } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../common/Card";

interface ReadabilityAnalysisProps {
  data: ReadabilityType;
}

export const ReadabilityAnalysis: React.FC<ReadabilityAnalysisProps> = ({
  data,
}) => {
  // Helper to get color class based on readability score
  const getScoreColorClass = (): string => {
    const score = data.score;

    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Helper to get readability level description
  const getReadabilityDescription = (): string => {
    const score = data.score;

    if (score >= 90) return "Very Easy";
    if (score >= 80) return "Easy";
    if (score >= 70) return "Fairly Easy";
    if (score >= 60) return "Standard";
    if (score >= 50) return "Fairly Difficult";
    if (score >= 30) return "Difficult";
    return "Very Difficult";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Readability Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  className="dark:stroke-gray-700"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${data.score * 2.83} 283`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  className={getScoreColorClass()}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColorClass()}`}>
                  {data.score}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getReadabilityDescription()}
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Reading Grade Level
              </p>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {data.grade}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Text Metrics
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Sentences
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {data.metrics.sentenceCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, data.metrics.sentenceCount / 3)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Words
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {data.metrics.wordCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, data.metrics.wordCount / 10)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Words per Sentence
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {data.metrics.averageSentenceLength.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (data.metrics.averageSentenceLength / 25) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {data.metrics.syllableCount && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      Syllables
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.metrics.syllableCount}
                    </span>
                  </div>
                </div>
              )}

              {data.metrics.complexWordCount && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      Complex Words
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.metrics.complexWordCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (data.metrics.complexWordCount /
                            data.metrics.wordCount) *
                            300
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
