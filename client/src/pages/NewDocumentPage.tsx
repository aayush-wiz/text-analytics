import React, { useState } from "react";
import { DocumentForm } from "../components/documents/DocumentForm";
import { TextDocument } from "../types";
import { textService } from "../services/api";

const NewDocumentPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<TextDocument>) => {
    setIsSubmitting(true);
    try {
      await textService.createText(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 ">
          Create New Document
        </h1>
        <p className="mt-1 text-sm text-gray-600 ">
          Add a new text document for analysis
        </p>
      </div>

      <DocumentForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
};

export default NewDocumentPage;
