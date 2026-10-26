"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "boneyard-js/react";
import "@/bones/registry";

import { DashboardContent } from "../components/DashboardContent";
import { useDashboard } from "../hooks/useDashboard";
import { dashboardFixtureData } from "../fixtures/dashboardFixtures";

export default function DashboardView() {
  const { data, isLoading: dashboardLoading } = useDashboard();

  const dashboardData = data?.data;

  // Development only: keep skeleton visible longer
  const [delayComplete, setDelayComplete] = useState(false);

  useEffect(() => {
    if (dashboardLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setDelayComplete(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [dashboardLoading]);

  // Derived state instead of synchronously updating state in an effect
  const showSkeleton = dashboardLoading || !delayComplete;

  return (
    <Skeleton
      name="admin-dashboard"
      loading={showSkeleton}
      fixture={
        <DashboardContent
          data={dashboardFixtureData}
        />
      }
      fallback={
        <div className="p-6">
          Loading dashboard...
        </div>
      }
      transition
    >
      {dashboardData && (
        <DashboardContent
          data={dashboardData}
        />
      )}
    </Skeleton>
  );
}