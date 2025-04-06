import React from "react";
import { KeywordAnalysis as KeywordType } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../common/Card";

interface KeywordAnalysisProps {
  data: KeywordType;
}

export const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ data }) => {
  // Sort keywords by score in descending order
  const sortedKeywords = [...data.keywords].sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The most significant keywords extracted from your text.
          </p>
        </div>

        {sortedKeywords.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">
              No keywords were identified in the text.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {sortedKeywords.map((keyword) => {
                // Calculate font size based on score (from 1em to 1.8em)
                const fontSize = 1 + keyword.score * 0.8;

                return (
                  <span
                    key={keyword.text}
                    className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    style={{ fontSize: `${fontSize}em` }}
                  >
                    {keyword.text}
                  </span>
                );
              })}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Detailed Keywords
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Keyword
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Relevance Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedKeywords.map((keyword) => (
                      <tr key={keyword.text}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {keyword.text}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {keyword.score.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {keyword.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
