import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnalysisForm } from "../components/analysis/AnalysisForm";
import { TextDocument, AnalysisOptions, Model } from "../types";
import { textService, modelService } from "../services/api";
import { Alert } from "../components/common/Alert";
import { Spinner } from "../components/common/Spinner";

// Debug component to help diagnose model loading issues
const ModelDebug: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await modelService.getModels() as any;
        setModels(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching models");
        console.error("Debug model fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) return <div>Loading models for debug...</div>;
  if (error) return <div>Error loading models: {error}</div>;

  return (
    <div className="bg-gray-100 p-3 mb-4 rounded text-sm">
      <h3 className="font-bold">Model Debug Info:</h3>
      <p>Models loaded: {models.length}</p>
      <p>Languages: {Array.from(new Set(models.map(m => m.language))).join(', ')}</p>
      <p>Active models: {models.filter(m => m.isActive).length}</p>
    </div>
  );
};

const AnalyzePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<TextDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(true);

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

    console.log("Starting analysis with options:", JSON.stringify(options, null, 2));
    setIsAnalyzing(true);
    
    try {
      // With our workaround, this will show an alert and redirect,
      // but we still need to handle the promise
      await textService.analyzeText(id, options);
      
      // The code below won't execute due to the redirect, but we'll keep it for completeness
      console.log("Analysis initiated");
      
      // Navigation will be handled by the service
      // navigate(`/texts/${id}/results`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Analysis failed";
      setError(errorMsg);
      console.error("Error analyzing document:", err);
    } finally {
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
      {showDebug && (
        <>
          <ModelDebug />
          <button
            onClick={() => setShowDebug(false)}
            className="text-xs underline"
          >
            Hide Debug Info
          </button>
        </>
      )}
      
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
        defaultOptions={{
          language: document.language || "en"
        }}
      />
    </div>
  );
};

export default AnalyzePage;
