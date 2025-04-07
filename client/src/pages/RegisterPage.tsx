import React from "react";
import { RegisterForm } from "../components/auth/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/common/Card";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-notion-default px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-notion-text-default">
            Text Analysis Tool
          </h2>
          <p className="mt-2 text-sm text-notion-text-gray">
            Create a new account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
