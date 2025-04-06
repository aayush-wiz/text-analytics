import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-600 dark:text-red-400">
          403
        </h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Access Denied
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button variant="primary" size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
