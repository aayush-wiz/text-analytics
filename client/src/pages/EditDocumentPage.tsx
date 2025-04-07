import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DocumentForm } from "../components/documents/DocumentForm";
import { TextDocument } from "../types";
import { textService } from "../services/api";
import { Alert } from "../components/common/Alert";
import { Spinner } from "../components/common/Spinner";

const EditDocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<TextDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await textService.getText(id) as { data: TextDocument };
        setDocument(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load document"
        );
        console.error("Error fetching document:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleSubmit = async (data: Partial<TextDocument>) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await textService.updateText(id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <Alert type="error">{error}</Alert>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="py-4">
        <Alert type="error">Document not found</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 ">
          Edit Document
        </h1>
        <p className="mt-1 text-sm text-gray-600 ">
          Update your text document
        </p>
      </div>

      <DocumentForm
        document={document}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EditDocumentPage;
