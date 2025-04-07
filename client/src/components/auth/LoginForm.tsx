import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Alert } from "../common/Alert";
import { LoginCredentials } from "../../types";

export const LoginForm: React.FC = () => {
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the auth context
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {authState.error && (
        <Alert type="error" dismissible>
          {authState.error}
        </Alert>
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        fullWidth
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
        fullWidth
        required
      />

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a
            href="/forgot-password"
            className="font-medium text-[#37352f] hover:text-black underline"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={authState.loading}
      >
        Sign in
      </Button>

      <div className="text-center">
        <span className="text-sm text-notion-text-gray">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-[#37352f] hover:text-black underline"
          >
            Sign up
          </a>
        </span>
      </div>
    </form>
  );
};
