import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Alert } from "../common/Alert";
import { RegisterData } from "../../types";

export const RegisterForm: React.FC = () => {
  const { register, authState } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

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

    if (formData.password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);

      // Clear error when user starts typing
      if (formErrors.confirmPassword) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the auth context
      console.error("Register error:", error);
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
        label="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={formErrors.name}
        fullWidth
        required
      />

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

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={handleChange}
        error={formErrors.confirmPassword}
        fullWidth
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={authState.loading}
      >
        Create Account
      </Button>

      <div className="text-center">
        <span className="text-sm text-notion-text-gray">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-[#37352f] hover:text-black underline"
          >
            Sign in
          </a>
        </span>
      </div>
    </form>
  );
};
