import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnalysisForm } from "../components/analysis/AnalysisForm";
import { TextDocument, AnalysisOptions } from "../types";
import { textService } from "../services/api";
import { Alert } from "../components/common/Alert";
import { Spinner } from "../components/common/Spinner";

const AnalyzePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<TextDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const handleAnalyze = async (options: AnalysisOptions) => {
    if (!id) return;

    setIsAnalyzing(true);
    try {
      await textService.analyzeText(id, options);
      navigate(`/texts/${id}/results`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      console.error("Error analyzing document:", err);
      setIsAnalyzing(false);
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
          Analyze Document
        </h1>
        <p className="mt-1 text-sm text-gray-600 ">
          {document.title}
        </p>
      </div>

      <div className="bg-white  p-4 rounded-md shadow-sm mb-6 overflow-auto max-h-60">
        <p className="text-gray-800  whitespace-pre-line">
          {document.content.substring(0, 500)}
          {document.content.length > 500 && "..."}
        </p>
      </div>

      <AnalysisForm
        textId={id!}
        onSubmit={handleAnalyze}
        isLoading={isAnalyzing}
      />
    </div>
  );
};

export default AnalyzePage;
