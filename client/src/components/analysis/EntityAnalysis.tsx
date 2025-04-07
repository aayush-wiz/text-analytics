import React, { useState } from "react";
import { EntityAnalysis as EntityType } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../common/Card";
import { Select } from "../common/Select";

interface EntityAnalysisProps {
  data: EntityType;
}

export const EntityAnalysis: React.FC<EntityAnalysisProps> = ({ data }) => {
  const [filteredType, setFilteredType] = useState<string>("");

  // Get unique entity types
  const entityTypes = Array.from(
    new Set(data.entities.map((entity) => entity.type))
  );

  // Create options for the filter dropdown
  const typeOptions = [
    { value: "", label: "All Types" },
    ...entityTypes.map((type) => ({ value: type, label: type })),
  ];

  // Sort entities by salience in descending order and filter by selected type
  const sortedEntities = [...data.entities]
    .filter((entity) => !filteredType || entity.type === filteredType)
    .sort((a, b) => b.salience - a.salience);

  // Get color for entity type
  const getEntityTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      PERSON: "bg-blue-100 text-blue-800  ",
      LOCATION:
        "bg-green-100 text-green-800  ",
      ORGANIZATION:
        "bg-purple-100 text-purple-800  ",
      EVENT:
        "bg-yellow-100 text-yellow-800  ",
      WORK_OF_ART:
        "bg-pink-100 text-pink-800  ",
      CONSUMER_GOOD:
        "bg-indigo-100 text-indigo-800  ",
      DATE: "bg-gray-100 text-gray-800  ",
      NUMBER: "bg-gray-100 text-gray-800  ",
    };

    return (
      colors[type] ||
      "bg-gray-100 text-gray-800  "
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <CardTitle>Entity Analysis</CardTitle>
        <div className="w-full sm:w-48">
          <Select
            options={typeOptions}
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600 ">
            Entities identified in your text with their type and importance
            (salience).
          </p>
        </div>

        {sortedEntities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 ">
              {filteredType
                ? `No entities of type "${filteredType}" were identified.`
                : "No entities were identified in the text."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Salience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Mentions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white  divide-y divide-gray-200 ">
                {sortedEntities.map((entity, index) => (
                  <tr key={`${entity.text}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
                      {entity.text}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEntityTypeColor(entity.type)}`}
                      >
                        {entity.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      {(entity.salience * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      {entity.mentions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
