
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchApplications,
  updateApplicationStatus,
} from "./applicationsSlice";

import {
  selectApplications,
  selectApplicationsStatus,
} from "./applicationsSelectors";

function Pipeline() {
  const dispatch = useDispatch();

  const [draggingId, setDraggingId] = useState(null);
  const [toast, setToast] = useState(null);

  const applications = useSelector(selectApplications);
  const status = useSelector(selectApplicationsStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchApplications());
    }
  }, [dispatch, status]);

  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (newStatus) => {
    if (draggingId === null) return;

    const application = applications.find(
      (item) => item.id === draggingId
    );

    if (!application || application.status === newStatus) {
      setDraggingId(null);
      return;
    }

    const now = new Date().toISOString();

    const updatedApplication = {
      ...application,
      status: newStatus,
      updatedAt: now,
      statusHistory: [
        ...(application.statusHistory || []),
        {
          status: newStatus,
          changedAt: now,
        },
      ],
    };

    try {
      await dispatch(
        updateApplicationStatus({
          id: draggingId,
          applicationData: updatedApplication,
        })
      ).unwrap();

      setToast({
        type: "success",
        message: "Application status updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update application status:", error);

      setToast({
        type: "error",
        message:
          "Failed to update application status. Previous status restored.",
      });
    }

    setDraggingId(null);
  };

  const columns = [
    {
      name: "wishlist",
      label: "Wishlist",
      color: "border-purple-500",
      badge: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
    {
      name: "applied",
      label: "Applied",
      color: "border-blue-500",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      name: "interview",
      label: "Interview",
      color: "border-amber-500",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      name: "offer",
      label: "Offer",
      color: "border-green-500",
      badge: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    },
    {
      name: "rejected",
      label: "Rejected",
      color: "border-red-500",
      badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    },
  ];

  if (status === "loading") {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading pipeline...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400">
          Failed to load applications.
        </p>

        <button
          onClick={() => dispatch(fetchApplications())}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Heading */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Application Pipeline
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Track your applications through every stage of the hiring process.
          Drag and drop cards to update their status.
        </p>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {columns.map((column) => {
          const count = applications.filter(
            (application) => application.status === column.name
          ).length;

          return (
            <div
              key={column.name}
              className={`rounded-xl border-l-4 ${column.color} border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900`}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {column.label}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {count}
              </h2>
            </div>
          );
        })}
      </section>

      {/* Toast notification */}
      {toast && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 ${
            toast.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          <p className="text-sm font-medium">{toast.message}</p>

          <button
            onClick={() => setToast(null)}
            className="ml-4 text-xl font-bold"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Kanban board */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {columns.map((column) => {
          const columnApplications = applications.filter(
            (application) => application.status === column.name
          );

          return (
            <div
              key={column.name}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.name)}
              className={`min-h-72 rounded-2xl border-t-4 ${column.color} border-x border-b border-gray-200 bg-gray-50 p-4 transition-colors dark:border-x-gray-800 dark:border-b-gray-800 dark:bg-gray-900`}
            >
              {/* Column heading */}
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="font-bold text-gray-800 dark:text-white">
                  {column.label}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${column.badge}`}
                >
                  {columnApplications.length}
                </span>
              </div>

              {/* Application cards */}
              <div className="space-y-3">
                {columnApplications.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center dark:border-gray-700">
                    <p className="text-sm text-gray-400">
                      Drop applications here
                    </p>
                  </div>
                ) : (
                  columnApplications.map((application) => (
                    <div
                      key={application.id}
                      draggable
                      onDragStart={() => handleDragStart(application.id)}
                      onDragEnd={() => setDraggingId(null)}
                      className={`cursor-grab rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing dark:border-gray-700 dark:bg-gray-800 ${
                        draggingId === application.id
                          ? "opacity-40"
                          : ""
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {application.company}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {application.role}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-400">
                          {application.dateApplied || "No application date"}
                        </span>

                        <Link
                          to={`/applications/${application.id}`}
                          draggable="false"
                          onClick={(event) => event.stopPropagation()}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Pipeline;
