// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/common/Button";
import { Select } from "../components/common/Select";
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
  const [languages, setLanguages] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState<UserPreferences>({
    theme: "system",
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

  // Load user preferences and available languages
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        // Load available languages
        const languagesResponse = await modelService.getModelLanguages() as {
          data: string[];
        };
        setLanguages(languagesResponse.data);

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

  const handleAnalysisOptionToggle = (option: keyof AnalysisOptions) => {
    setFormData((prev) => ({
      ...prev,
      defaultAnalysisOptions: {
        ...prev.defaultAnalysisOptions!,
        [option]: !prev.defaultAnalysisOptions![option],
      },
    }));
  };

  const handleAnalysisLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      defaultAnalysisOptions: {
        ...prev.defaultAnalysisOptions!,
        language: e.target.value,
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

      // Update theme in real-time
      if (formData.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (formData.theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        // System preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

      localStorage.setItem("theme", formData.theme);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate language options for select
  const languageOptions = languages.map((code) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading your preferences...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Theme
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="theme-light"
                          name="theme"
                          value="light"
                          checked={formData.theme === "light"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="theme-light"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Light
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="theme-dark"
                          name="theme"
                          value="dark"
                          checked={formData.theme === "dark"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="theme-dark"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Dark
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="theme-system"
                          name="theme"
                          value="system"
                          checked={formData.theme === "system"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor="theme-system"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          System Default
                        </label>
                      </div>
                    </div>
                  </div>

                  <Select
                    label="Language"
                    name="language"
                    options={languageOptions}
                    value={formData.language}
                    onChange={handleChange}
                    fullWidth
                  />

                  <Checkbox
                    label="Enable Notifications"
                    checked={formData.notificationsEnabled}
                    onChange={handleToggleNotifications}
                  />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    These options will be pre-selected when analyzing a new
                    document.
                  </p>

                  <div className="space-y-3">
                    <Checkbox
                      label="Sentiment Analysis"
                      checked={formData.defaultAnalysisOptions?.sentiment}
                      onChange={() => handleAnalysisOptionToggle("sentiment")}
                    />

                    <Checkbox
                      label="Keyword Extraction"
                      checked={formData.defaultAnalysisOptions?.keywords}
                      onChange={() => handleAnalysisOptionToggle("keywords")}
                    />

                    <Checkbox
                      label="Named Entity Recognition"
                      checked={formData.defaultAnalysisOptions?.entities}
                      onChange={() => handleAnalysisOptionToggle("entities")}
                    />

                    <Checkbox
                      label="Text Summarization"
                      checked={formData.defaultAnalysisOptions?.summary}
                      onChange={() => handleAnalysisOptionToggle("summary")}
                    />

                    <Checkbox
                      label="Readability Metrics"
                      checked={formData.defaultAnalysisOptions?.readability}
                      onChange={() => handleAnalysisOptionToggle("readability")}
                    />
                  </div>

                  <Select
                    label="Default Language"
                    options={languageOptions}
                    value={formData.defaultAnalysisOptions?.language || ""}
                    onChange={handleAnalysisLanguageChange}
                    fullWidth
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Save Settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
