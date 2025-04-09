import React, { useEffect, useState } from "react";
import { DocumentList } from "../components/documents/DocumentList";
import { TextDocument } from "../types";
import { textService } from "../services/api";
import { Alert } from "../components/common/Alert";
import { PageHeader } from "../components/common/Card";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/common/Button";

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<TextDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get('filter');

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await textService.getTexts() as { data: TextDocument[] };
      setDocuments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await textService.deleteText(id);
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete document"
        );
        console.error("Error deleting document:", err);
      }
    }
  };

  // Filter documents if needed
  const filteredDocuments = filter === 'analysis' 
    ? documents.filter(doc => !doc.isAnalyzed)
    : documents;
    
  // Get page title and description based on filter
  const getPageTitle = () => {
    if (filter === 'analysis') {
      return "Documents For Analysis";
    }
    return "Documents";
  };
  
  const getPageDescription = () => {
    if (filter === 'analysis') {
      return "Select a document to analyze";
    }
    return "Manage and analyze your text documents";
  };

  return (
    <div className="space-y-4">
      <PageHeader 
        title={getPageTitle()} 
        description={getPageDescription()}
      >
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
      </PageHeader>

      {error && (
        <Alert type="error" dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <DocumentList
        documents={filteredDocuments}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DocumentsPage;
