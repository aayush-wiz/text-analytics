import React, { useEffect, useState } from "react";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentDocuments } from "../components/dashboard/RecentDocuments";
import { AnalysisByType } from "../components/dashboard/AnalysisByType";
import { useAuth } from "../hooks/useAuth";
import { textService, userService } from "../services/api";
import { TextDocument, UserStats } from "../types";

const DashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [recentDocuments, setRecentDocuments] = useState<TextDocument[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [analysisByType, setAnalysisByType] = useState<
    { type: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch recent documents
        const documentsResponse = await textService.getTexts() as { data: TextDocument[] };
        setRecentDocuments(documentsResponse.data.slice(0, 5));

        // Fetch user stats if authenticated
        if (authState.user?.id) {
          const statsResponse = await userService.getUserStats(
            authState.user.id
          ) as { data: UserStats };
          setUserStats(statsResponse.data);

          // Create analysis by type data
          const typeData = statsResponse.data.favoriteAnalysisTypes.map(
            (type: string) => ({
              type,
              count: Math.floor(Math.random() * 50) + 10, // Placeholder for actual counts
            })
          );
          setAnalysisByType(typeData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [authState.user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#37352f]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-notion-text-gray">
          Welcome back, {authState.user?.name}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Documents"
          value={isLoading ? "..." : userStats?.totalDocuments || 0}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          change={{ value: 12, isPositive: true }}
        />

        <StatCard
          title="Analyses"
          value={isLoading ? "..." : userStats?.totalAnalyses || 0}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          change={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Languages"
          value="5"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
          }
        />

        <StatCard
          title="Last Activity"
          value={
            isLoading
              ? "..."
              : new Date(
                  userStats?.lastActive || Date.now()
                ).toLocaleDateString()
          }
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentDocuments documents={recentDocuments} isLoading={isLoading} />
        </div>

        <div>
          <AnalysisByType data={analysisByType} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
