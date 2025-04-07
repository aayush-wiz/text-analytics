// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/common/Button";
import { Select } from "../components/common/Select";
import { CustomSelect } from "../components/common/CustomSelect";
import { Checkbox } from "../components/common/Checkbox";
import { Alert } from "../components/common/Alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/common/Card";
import { authService, modelService } from "../services/api";
import { UserPreferences, AnalysisOptions } from "../types";

const SettingsPage: React.FC = () => {
  const { authState, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Available languages
  const availableLanguages = [
    { value: "en", label: "English" },
    { value: "de", label: "German" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
  ];

  // Form state
  const [formData, setFormData] = useState<UserPreferences>({
    language: "en",
    notificationsEnabled: true,
    defaultAnalysisOptions: {
      sentiment: true,
      keywords: true,
      entities: true,
      summary: true,
      readability: true,
      language: "en",
    },
  });

  // Load user preferences
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        
        // Set form data from user preferences if user exists and has preferences
        const userPreferences = authState.user?.preferences;
        if (userPreferences) {
          setFormData(prevData => ({
            ...prevData,
            ...userPreferences,
            defaultAnalysisOptions: {
              ...prevData.defaultAnalysisOptions,
              ...(userPreferences.defaultAnalysisOptions || {})
            }
          }));
        }
      } catch (err) {
        console.error("Error loading settings data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [authState.user?.preferences]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalysisOptionToggle = (option: keyof AnalysisOptions) => {
    setFormData((prev) => ({
      ...prev,
      defaultAnalysisOptions: {
        ...prev.defaultAnalysisOptions!,
        [option]: !prev.defaultAnalysisOptions![option],
      },
    }));
  };

  const handleAnalysisLanguageChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      defaultAnalysisOptions: {
        ...prev.defaultAnalysisOptions!,
        language: value,
      },
    }));
  };

  const handleToggleNotifications = () => {
    setFormData((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.updatePreferences(formData) as {
        data: UserPreferences;
      };
      updateUser({ preferences: response.data });
      setSuccess("Settings updated successfully");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#37352f]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-notion-text-gray">
          Customize your experience
        </p>
      </div>

      {success && (
        <Alert type="success" dismissible onDismiss={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert type="error" dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Show loading state if necessary */}
      {loadingData ? (
        <div className="flex justify-center py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37352f] mx-auto"></div>
            <p className="mt-2 text-notion-text-gray">Loading your preferences...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#37352f] mb-2">
                      Interface Language
                    </label>
                    <CustomSelect
                      options={availableLanguages}
                      value={formData.language}
                      onChange={(value) => handleCustomSelectChange("language", value)}
                      fullWidth
                    />
                  </div>

                  <div className="mt-4">
                    <Checkbox
                      label="Enable Notifications"
                      checked={formData.notificationsEnabled}
                      onChange={handleToggleNotifications}
                      className="text-[#37352f]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Default Analysis Options */}
            <Card>
              <CardHeader>
                <CardTitle>Default Analysis Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-notion-text-gray mb-2">
                    These options will be pre-selected when analyzing a new
                    document.
                  </p>

                  <div className="space-y-3">
                    <Checkbox
                      label="Sentiment Analysis"
                      checked={formData.defaultAnalysisOptions?.sentiment}
                      onChange={() => handleAnalysisOptionToggle("sentiment")}
                      className="text-[#37352f]"
                    />

                    <Checkbox
                      label="Keyword Extraction"
                      checked={formData.defaultAnalysisOptions?.keywords}
                      onChange={() => handleAnalysisOptionToggle("keywords")}
                      className="text-[#37352f]"
                    />

                    <Checkbox
                      label="Named Entity Recognition"
                      checked={formData.defaultAnalysisOptions?.entities}
                      onChange={() => handleAnalysisOptionToggle("entities")}
                      className="text-[#37352f]"
                    />

                    <Checkbox
                      label="Text Summarization"
                      checked={formData.defaultAnalysisOptions?.summary}
                      onChange={() => handleAnalysisOptionToggle("summary")}
                      className="text-[#37352f]"
                    />

                    <Checkbox
                      label="Readability Metrics"
                      checked={formData.defaultAnalysisOptions?.readability}
                      onChange={() => handleAnalysisOptionToggle("readability")}
                      className="text-[#37352f]"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#37352f] mb-2">
                      Default Analysis Language
                    </label>
                    <CustomSelect
                      options={availableLanguages}
                      value={formData.defaultAnalysisOptions?.language || ""}
                      onChange={handleAnalysisLanguageChange}
                      fullWidth
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={isLoading}
              className="px-4 py-2"
            >
              Save Settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
