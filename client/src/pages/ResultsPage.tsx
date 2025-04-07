import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnalysisResult, TextDocument } from '../types';
import { textService } from '../services/api';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { SentimentAnalysis } from '../components/analysis/SentimentAnalysis';
import { KeywordAnalysis } from '../components/analysis/KeywordAnalysis';
import { EntityAnalysis } from '../components/analysis/EntityAnalysis';
import { TextSummary } from '../components/analysis/TextSummary';
import { ReadabilityAnalysis } from '../components/analysis/ReadabilityAnalysis';

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<TextDocument | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch document
        const documentResponse = (await textService.getText(id)) as {
          data: TextDocument;
        };
        setDocument(documentResponse.data);

        // Fetch analysis results
        const resultsResponse = await textService.getResults(id) as {
          data: AnalysisResult;
        };
        setResults(resultsResponse.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load analysis results'
        );
        console.error('Error fetching results:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  if (!document || !results) {
    return (
      <div className="py-4">
        <Alert type="error">Document or analysis results not found</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">
            Analysis Results
          </h1>
          <p className="mt-1 text-sm text-gray-600 ">
            {document.title}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to={`/documents/${id}`}>
            <Button variant="light" size="sm">
              Edit Document
            </Button>
          </Link>
          <Link to={`/texts/${id}/analyze`}>
            <Button variant="primary" size="sm">
              Run Again
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.sentiment && (
          <div>
            <SentimentAnalysis data={results.sentiment} />
          </div>
        )}

        {results.readability && (
          <div>
            <ReadabilityAnalysis data={results.readability} />
          </div>
        )}
      </div>

      {results.summary && (
        <div>
          <TextSummary data={results.summary} originalText={document.content} />
        </div>
      )}

      {results.keywords && (
        <div>
          <KeywordAnalysis data={results.keywords} />
        </div>
      )}

      {results.entities && (
        <div>
          <EntityAnalysis data={results.entities} />
        </div>
      )}
    </div>
  );
};

export default ResultsPage;