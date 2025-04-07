import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextDocument } from "../../types";
import { Button } from "../common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../common/Card";
import { Input } from "../common/Input";
import { Select } from "../common/Select";

interface DocumentListProps {
  documents: TextDocument[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Get unique languages from documents
  const languages = Array.from(
    new Set(documents.map((doc) => doc.language))
  ).map((lang) => ({ value: lang, label: lang }));

  // Add "All" option to languages
  const languageOptions = [{ value: "", label: "All Languages" }, ...languages];

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage
      ? doc.language === filterLanguage
      : true;
    return matchesSearch && matchesLanguage;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === "language") {
      comparison = a.language.localeCompare(b.language);
    } else if (sortBy === "createdAt") {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "updatedAt") {
      comparison =
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200  rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-16 bg-gray-100  rounded"
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <CardTitle>Documents</CardTitle>
        <Link to="/documents/new">
          <Button variant="primary" size="sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Document
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="sm:w-1/2">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <div className="sm:w-1/2">
            <Select
              options={languageOptions}
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              fullWidth
            />
          </div>
        </div>

        {sortedDocuments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500  mb-4">
              No documents found.
            </p>
            <Link to="/documents/new">
              <Button variant="primary">Create Your First Document</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-50 ">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      <span>Title</span>
                      {sortBy === "title" && (
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {sortOrder === "asc" ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("language")}
                  >
                    <div className="flex items-center">
                      <span>Language</span>
                      {sortBy === "language" && (
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {sortOrder === "asc" ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("updatedAt")}
                  >
                    <div className="flex items-center">
                      <span>Last Updated</span>
                      {sortBy === "updatedAt" && (
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {sortOrder === "asc" ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500  uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white  divide-y divide-gray-200 ">
                {sortedDocuments.map((document) => (
                  <tr key={document.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/documents/${document.id}`}
                        className="text-blue-600  hover:underline"
                      >
                        {document.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800  ">
                        {document.language}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                      {formatDate(document.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {document.isAnalyzed ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800  ">
                          Analyzed
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800  ">
                          Not Analyzed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/documents/${document.id}`}>
                          <Button variant="light" size="sm">
                            Edit
                          </Button>
                        </Link>
                        {document.isAnalyzed ? (
                          <Link to={`/texts/${document.id}/results`}>
                            <Button variant="info" size="sm">
                              Results
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/texts/${document.id}/analyze`}>
                            <Button variant="primary" size="sm">
                              Analyze
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDelete(document.id)}
                        >
                          Delete
                        </Button>
                      </div>
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
