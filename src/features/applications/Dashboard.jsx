
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchApplications } from "./applicationsSlice";

import {
  selectApplications,
  selectApplicationsStatus,
  selectDashboardStats,
} from "./applicationsSelectors";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applications = useSelector(selectApplications);
  const status = useSelector(selectApplicationsStatus);
  const stats = useSelector(selectDashboardStats);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchApplications());
    }
  }, [dispatch, status]);

  const summaryCards = [
    { title: "Total Applications", count: stats.total },
    { title: "Wishlist", count: stats.wishlist },
    { title: "Applied", count: stats.applied },
    { title: "Interviews", count: stats.interview },
    { title: "Offers", count: stats.offer },
    { title: "Rejected", count: stats.rejected },
  ];

  const chartData = [
    { label: "Wishlist", count: stats.wishlist },
    { label: "Applied", count: stats.applied },
    { label: "Interview", count: stats.interview },
    { label: "Offers", count: stats.offer },
    { label: "Rejected", count: stats.rejected },
  ];

  const maxCount = Math.max(
    ...chartData.map((item) => item.count),
    1
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400">
          Failed to load dashboard.
        </p>

        <button
          onClick={() => dispatch(fetchApplications())}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Dashboard Heading */}
      <section>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Track, organize, and manage your job applications in one place.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
              {card.count}
            </h2>

            <div className="mt-4 h-1.5 w-12 rounded-full bg-blue-600" />
          </div>
        ))}
      </section>

      {/* Application Analytics */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          Application Analytics
        </h2>

        <div className="space-y-5">
          {chartData.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.count}
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-3 rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Applications */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Applications
          </h2>

          <button
            onClick={() => navigate("/applications")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </button>
        </div>

        {applications.length === 0 ? (
          <p className="py-6 text-center text-gray-500 dark:text-gray-400">
            No applications found. Start adding your applications!
          </p>
        ) : (
          applications.slice(0, 5).map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/applications/${app.id}`)}
              className="cursor-pointer rounded-xl border-b border-gray-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {app.company}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {app.role}
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {app.status}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

    </div>
  );
}

export default Dashboard;
