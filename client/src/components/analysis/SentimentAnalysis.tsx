import React from "react";
import { SentimentAnalysis as SentimentType } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../common/Card";

interface SentimentAnalysisProps {
  data: SentimentType;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  data,
}) => {
  // Helper to get color based on sentiment
  const getSentimentColor = () => {
    switch (data.label) {
      case "positive":
        return "bg-green-500";
      case "negative":
        return "bg-red-500";
      case "mixed":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Helper to calculate percentage for visualization
  const getPercentage = () => {
    // Convert from -1 to 1 range to 0 to 100
    return ((data.score + 1) / 2) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <span className="text-3xl font-bold capitalize text-gray-900 ">
              {data.label}
            </span>
            <p className="text-sm text-gray-500  mt-1">
              Score: {data.score.toFixed(2)} (Magnitude:{" "}
              {data.magnitude.toFixed(2)})
            </p>
          </div>

          <div className="w-full h-4 bg-gray-200  rounded-full overflow-hidden mb-2">
            <div
              className={`h-full ${getSentimentColor()}`}
              style={{ width: `${getPercentage()}%` }}
            ></div>
          </div>

          <div className="w-full flex justify-between text-xs text-gray-600 ">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>

          <div className="mt-6 text-sm text-gray-600 ">
            <p>
              <strong>Understanding the score:</strong> The sentiment score
              ranges from -1 (negative) to 1 (positive), with 0 being neutral.
              The magnitude indicates the strength of the emotion, regardless of
              whether it's positive or negative.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
