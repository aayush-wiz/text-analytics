import React from "react";
import { Link } from "react-router-dom";
import { TextDocument } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../common/Card";
import { Button } from "../common/Button";

interface RecentDocumentsProps {
  documents: TextDocument[];
  isLoading?: boolean;
}

export const RecentDocuments: React.FC<RecentDocumentsProps> = ({
  documents,
  isLoading = false,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="py-3 border-b border-notion-border last:border-0"
              >
                <div className="h-4 bg-notion-gray-light rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-notion-gray-light/50 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Documents</CardTitle>
        <Link to="/documents">
          <Button variant="light" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-notion-text-gray">
              No documents yet. Create your first document to get started.
            </p>
            <Link to="/documents/new" className="mt-4 inline-block">
              <Button variant="primary" size="sm">
                Create Document
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-notion-border">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <Link
                    to={`/documents/${doc.id}`}
                    className="text-base font-medium text-[#37352f] hover:text-black hover:underline"
                  >
                    {doc.title}
                  </Link>
                  <p className="text-sm text-notion-text-gray">
                    {formatDate(doc.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center">
                  {doc.isAnalyzed ? (
                    <Link to={`/texts/${doc.id}/results`}>
                      <Button size="sm" variant="success">
                        View Results
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/texts/${doc.id}/analyze`}>
                      <Button size="sm" variant="primary">
                        Analyze
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
