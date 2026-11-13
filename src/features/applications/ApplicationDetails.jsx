
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  fetchApplicationById,
  removeApplication,
} from "./applicationsSlice";

import ConfirmModal from "../../components/ConfirmModal";

import {
  selectSelectedApplication,
  selectDetailsStatus,
  selectDetailsError,
} from "./applicationsSelectors";

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const application = useSelector(selectSelectedApplication);
  const status = useSelector(selectDetailsStatus);
  const error = useSelector(selectDetailsError);

  const isDeleting = useSelector(
    (state) => state.applications.deleteStatus === "loading"
  );

  const deleteError = useSelector(
    (state) => state.applications.deleteError
  );

  useEffect(() => {
    dispatch(fetchApplicationById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(removeApplication(application.id)).unwrap();

      setIsDeleteModalOpen(false);
      navigate("/applications");
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading application details...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-300">
          Unable to load application
        </h2>

        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error === "Application not found"
            ? "Application not found. Please check the application ID."
            : error}
        </p>

        <button
          onClick={() => dispatch(fetchApplicationById(id))}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const detailItems = [
    {
      label: "Date Applied",
      value: application.dateApplied || "Not provided",
    },
    {
      label: "Location",
      value: application.location || "Not provided",
    },
    {
      label: "Location Type",
      value: application.locationType || "Not provided",
    },
    {
      label: "Salary Range",
      value:
        application.salaryMin != null &&
        application.salaryMax != null
          ? `${application.currency || ""} ${application.salaryMin} - ${application.salaryMax}`
          : "Not provided",
    },
    {
      label: "Created At",
      value: application.createdAt
        ? new Date(application.createdAt).toLocaleString()
        : "Not provided",
    },
    {
      label: "Last Updated",
      value: application.updatedAt
        ? new Date(application.updatedAt).toLocaleString()
        : "Not provided",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Back navigation */}
      <Link
        to="/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        ← Back to Applications
      </Link>

      {/* Application heading */}
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            APPLICATION DETAILS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {application.company}
          </h1>

          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            {application.role}
          </p>

          <span className="mt-4 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {application.status}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              navigate(`/applications/${application.id}/edit`)
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </section>

      {/* Job information */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
          Job Information
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {detailItems.map((item) => (
            <div key={item.label}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>

              <p className="mt-1 font-medium capitalize text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Job URL
          </p>

          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block break-all font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
            >
              View Job Posting ↗
            </a>
          ) : (
            <p className="mt-2 text-gray-900 dark:text-white">
              Not provided
            </p>
          )}
        </div>
      </section>

      {/* Notes */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
          Notes
        </h2>

        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-300">
          {application.notes || "No notes available."}
        </p>
      </section>

      {/* Status history */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          Status History
        </h2>

        {application.statusHistory &&
        application.statusHistory.length > 0 ? (
          <div className="space-y-6">
            {application.statusHistory.map((history, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />

                  {index !== application.statusHistory.length - 1 && (
                    <div className="mt-2 min-h-8 w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                <div className="pb-2">
                  <p className="font-semibold capitalize text-gray-900 dark:text-white">
                    {history.status}
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(history.changedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No status history available.
          </p>
        )}
      </section>

      {/* Delete error */}
      {deleteError && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Failed to delete application: {deleteError}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Application?"
        message="Are you sure you want to delete this application? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default ApplicationDetails;
