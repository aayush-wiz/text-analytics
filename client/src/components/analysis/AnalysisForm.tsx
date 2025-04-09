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
    keywords: false,
    entities: false,
    summary: false,
    readability: false,
    language: "en",
  });
  const [models, setModels] = useState<Model[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  // Track which analysis types have available models
  const [availableAnalysisTypes, setAvailableAnalysisTypes] = useState({
    sentiment: false,
    keywords: false,
    entities: false,
    summary: false,
    readability: false
  });

  useEffect(() => {
    // Load available models
    const fetchModels = async () => {
      try {
        setIsLoadingModels(true);
        const response = await modelService.getModels() as ModelsResponse;
        
        // Only use active models
        const activeModels = response.data.filter((model) => model.isActive);
        setModels(activeModels);

        // Extract available languages from active models
        const languages = Array.from(
          new Set(activeModels.map((model) => model.language))
        );
        
        setAvailableLanguages(languages.length > 0 ? languages : ["en"]);
        
        // Set a default language if we have languages and none is selected
        if (languages.length > 0 && !options.language) {
          setOptions(prev => ({ ...prev, language: languages[0] }));
        }
        
        // Determine which analysis types have available models
        const availableTypes = {
          sentiment: false,
          keywords: false,
          entities: false,
          summary: false,
          readability: false
        };
        
        activeModels.forEach(model => {
          if (model.type === "sentiment") availableTypes.sentiment = true;
          if (model.type === "keyword") availableTypes.keywords = true;
          if (model.type === "entity") availableTypes.entities = true;
          if (model.type === "summary") availableTypes.summary = true;
          if (model.type === "readability") availableTypes.readability = true;
          if (model.type === "combined") {
            // Combined models support multiple analysis types
            availableTypes.sentiment = true;
            availableTypes.keywords = true;
            availableTypes.entities = true;
            availableTypes.summary = true;
            availableTypes.readability = true;
          }
        });
        
        setAvailableAnalysisTypes(availableTypes);
        
        // Update options to only enable available analysis types
        setOptions(prev => ({
          ...prev,
          sentiment: prev.sentiment && availableTypes.sentiment,
          keywords: prev.keywords && availableTypes.keywords,
          entities: prev.entities && availableTypes.entities,
          summary: prev.summary && availableTypes.summary,
          readability: prev.readability && availableTypes.readability
        }));
        
        console.log("Fetched models:", activeModels.length);
        console.log("Available languages:", languages);
        console.log("Available analysis types:", availableTypes);
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
    const newLanguage = e.target.value;
    setOptions((prev) => ({
      ...prev,
      language: newLanguage,
      // Clear modelId when language changes
      modelId: undefined
    }));
    console.log("Language changed to:", newLanguage);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    setOptions((prev) => ({
      ...prev,
      modelId: modelId === "" ? undefined : modelId
    }));
    console.log("Model changed to:", modelId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);
      
      // Only include selected analysis types that have available models
      const analysisOptions: Record<string, any> = {
        language: options.language || "en"
      };
      
      // Only include sentiment if selected and available
      if (options.sentiment && availableAnalysisTypes.sentiment) {
        analysisOptions.sentiment = true;
      }
      
      // We don't include the other types at all, even with false values
      // This is to work around a backend issue
      
      // Only add modelId if it has a valid value
      if (options.modelId && options.modelId.trim() !== '') {
        analysisOptions.modelId = options.modelId.trim();
      }
      
      // Ensure at least one analysis option is selected
      if (!Object.keys(analysisOptions).some(key => 
          key === 'sentiment')) {
        setError("Please select at least one available analysis option");
        return;
      }
      
      console.log("Submitting analysis with options:", JSON.stringify(analysisOptions, null, 2));
      
      await onSubmit(analysisOptions);
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

  // Add default language option if no languages are available
  if (languageOptions.length === 0) {
    languageOptions.push({ value: "en", label: "English" });
  }

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

          {isLoadingModels && (
            <div className="mb-4">
              <Alert type="info">Loading available models...</Alert>
            </div>
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
                  disabled={isLoading || !availableAnalysisTypes.sentiment}
                />
                <Checkbox
                  label="Keyword Extraction"
                  checked={options.keywords}
                  onChange={() => handleToggleOption("keywords")}
                  disabled={isLoading || !availableAnalysisTypes.keywords}
                />
                <Checkbox
                  label="Named Entity Recognition"
                  checked={options.entities}
                  onChange={() => handleToggleOption("entities")}
                  disabled={isLoading || !availableAnalysisTypes.entities}
                />
                <Checkbox
                  label="Text Summarization"
                  checked={options.summary}
                  onChange={() => handleToggleOption("summary")}
                  disabled={isLoading || !availableAnalysisTypes.summary}
                />
                <Checkbox
                  label="Readability Metrics"
                  checked={options.readability}
                  onChange={() => handleToggleOption("readability")}
                  disabled={isLoading || !availableAnalysisTypes.readability}
                />
              </div>
              
              {!isLoadingModels && Object.values(availableAnalysisTypes).every(v => !v) && (
                <div className="mt-2">
                  <Alert type="warning">
                    No analysis models are currently available. Please contact the administrator.
                  </Alert>
                </div>
              )}
              
              {!isLoadingModels && (
                <div className="mt-2 text-sm text-gray-500">
                  Note: Only analysis types with available models are enabled.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Language"
                options={languageOptions}
                value={options.language || "en"}
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
              Object.values(availableAnalysisTypes).every(v => !v) ||
              !(
                (options.sentiment && availableAnalysisTypes.sentiment) ||
                (options.keywords && availableAnalysisTypes.keywords) ||
                (options.entities && availableAnalysisTypes.entities) ||
                (options.summary && availableAnalysisTypes.summary) ||
                (options.readability && availableAnalysisTypes.readability)
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
