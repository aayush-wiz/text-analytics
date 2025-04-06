import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextDocument } from "../../types";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { TextArea } from "../common/TextArea";
import { Select } from "../common/Select";
import { Alert } from "../common/Alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../common/Card";

interface DocumentFormProps {
  document?: TextDocument;
  isLoading?: boolean;
  onSubmit: (data: Partial<TextDocument>) => Promise<void>;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  document,
  isLoading = false,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<TextDocument>>({
    title: "",
    content: "",
    language: "en",
    tags: [],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Languages available for analysis
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "nl", label: "Dutch" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
  ];

  // Load document data if editing
  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        content: document.content,
        language: document.language,
        tags: document.tags || [],
      });
    }
  }, [document]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content?.trim()) {
      errors.content = "Content is required";
    }

    if (!formData.language) {
      errors.language = "Language is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setError(null);
      await onSubmit(formData);
      navigate("/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{document ? "Edit Document" : "New Document"}</CardTitle>
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

          <div className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              error={formErrors.title}
              disabled={isLoading}
              fullWidth
              required
            />

            <Select
              label="Language"
              name="language"
              options={languages}
              value={formData.language || ""}
              onChange={handleChange}
              error={formErrors.language}
              disabled={isLoading}
              fullWidth
              required
            />

            <TextArea
              label="Content"
              name="content"
              value={formData.content || ""}
              onChange={handleChange}
              error={formErrors.content}
              disabled={isLoading}
              rows={10}
              fullWidth
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="rounded-r-none"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-l-none"
                  onClick={handleAddTag}
                  disabled={isLoading || !tagInput.trim()}
                >
                  Add
                </Button>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <span className="sr-only">Remove tag</span>
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M1 1l6 6m0-6L1 7"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="light"
            onClick={() => navigate("/documents")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {document ? "Update" : "Create"} Document
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
