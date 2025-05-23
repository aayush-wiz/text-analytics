import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 ">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 ">
          Page Not Found
        </h2>
        <p className="mt-2 text-lg text-gray-600 ">
          The page you are looking for doesn't exist or has been moved.
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

export default NotFoundPage;
