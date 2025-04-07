import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnalysisOptions, Model } from "../../types";
import { Button } from "../common/Button";
import { Checkbox } from "../common/Checkbox";
import { Select } from "../common/Select";
import { Alert } from "../common/Alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../common/Card";
import { modelService } from "../../services/api";

interface AnalysisFormProps {
  textId: string;
  defaultOptions?: AnalysisOptions;
  onSubmit: (options: AnalysisOptions) => Promise<void>;
  isLoading?: boolean;
}

// Define the API response interface
interface ModelsResponse {
  data: Model[];
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  textId,
  defaultOptions,
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [options, setOptions] = useState<AnalysisOptions>({
    sentiment: true,
    keywords: true,
    entities: true,
    summary: true,
    readability: true,
    language: "en",
  });
  const [models, setModels] = useState<Model[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    // Load available models
    const fetchModels = async () => {
      try {
        setIsLoadingModels(true);
        const response = await modelService.getModels() as ModelsResponse;
        setModels(response.data.filter((model) => model.isActive));

        // Extract available languages
        const languages = Array.from(
          new Set(response.data.map((model) => model.language))
        );
        setAvailableLanguages(languages);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError("Failed to load available models");
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    // Set default options if provided
    if (defaultOptions) {
      setOptions((prev) => ({
        ...prev,
        ...defaultOptions,
      }));
    }
  }, [defaultOptions]);

  const handleToggleOption = (option: keyof AnalysisOptions) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions((prev) => ({
      ...prev,
      language: e.target.value,
    }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions((prev) => ({
      ...prev,
      modelId: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);
      await onSubmit(options);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    }
  };

  // Filter models by selected language
  const languageModels = models.filter(
    (model) => model.language === options.language
  );

  // Generate language options for select
  const languageOptions = availableLanguages.map((code) => {
    const languageNames: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      nl: "Dutch",
      ru: "Russian",
      zh: "Chinese",
      ja: "Japanese",
    };

    return {
      value: code,
      label: languageNames[code] || code,
    };
  });

  // Generate model options for select
  const modelOptions = [
    { value: "", label: "Default Model" },
    ...languageModels.map((model) => ({
      value: model.id,
      label: model.name,
    })),
  ];

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Analysis Options</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert
              type="error"
              dismissible
              onDismiss={() => setError(null)}
              className="mb-4"
            >
              {error}
            </Alert>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900  mb-2">
                What to analyze
              </h3>
              <div className="space-y-4">
                <Checkbox
                  label="Sentiment Analysis"
                  checked={options.sentiment}
                  onChange={() => handleToggleOption("sentiment")}
                  disabled={isLoading}
                />
                <Checkbox
                  label="Keyword Extraction"
                  checked={options.keywords}
                  onChange={() => handleToggleOption("keywords")}
                  disabled={isLoading}
                />
                <Checkbox
                  label="Named Entity Recognition"
                  checked={options.entities}
                  onChange={() => handleToggleOption("entities")}
                  disabled={isLoading}
                />
                <Checkbox
                  label="Text Summarization"
                  checked={options.summary}
                  onChange={() => handleToggleOption("summary")}
                  disabled={isLoading}
                />
                <Checkbox
                  label="Readability Metrics"
                  checked={options.readability}
                  onChange={() => handleToggleOption("readability")}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Language"
                options={languageOptions}
                value={options.language || ""}
                onChange={handleLanguageChange}
                disabled={isLoading || isLoadingModels}
                fullWidth
              />

              <Select
                label="Model (Optional)"
                options={modelOptions}
                value={options.modelId || ""}
                onChange={handleModelChange}
                disabled={
                  isLoading || isLoadingModels || languageModels.length === 0
                }
                fullWidth
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="light"
            onClick={() => navigate(`/documents/${textId}`)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={
              isLoading ||
              !(
                options.sentiment ||
                options.keywords ||
                options.entities ||
                options.summary ||
                options.readability
              )
            }
          >
            Run Analysis
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
