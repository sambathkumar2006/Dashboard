
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

import { fetchApplications } from "./applicationsSlice";

import {
  selectApplications,
  selectApplicationsStatus,
  selectApplicationsError,
} from "./applicationsSelectors";

function ApplicationsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const applications = useSelector(selectApplications);
  const status = useSelector(selectApplicationsStatus);
  const error = useSelector(selectApplicationsError);

  // Search state
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("q") || ""
  );

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    searchTerm
  );

  // Filter, sorting and pagination state
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || "all"
  );

  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "date-desc"
  );

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const applicationsPerPage = 10;

  // Fetch applications
  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Synchronize filters with URL
  useEffect(() => {
    const params = {};

    if (debouncedSearchTerm) {
      params.q = debouncedSearchTerm;
    }

    if (selectedStatus !== "all") {
      params.status = selectedStatus;
    }

    if (sortBy !== "date-desc") {
      params.sort = sortBy;
    }

    if (currentPage !== 1) {
      params.page = String(currentPage);
    }

    setSearchParams(params, { replace: true });
  }, [
    debouncedSearchTerm,
    selectedStatus,
    sortBy,
    currentPage,
    setSearchParams,
  ]);

  // Search and status filtering
  const filteredApplications = applications.filter((application) => {
    const company = application.company.toLowerCase();
    const role = application.role.toLowerCase();
    const search = debouncedSearchTerm.toLowerCase();

    const matchesSearch =
      company.includes(search) || role.includes(search);

    const matchesStatus =
      selectedStatus === "all" ||
      application.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "company-asc") {
      return a.company.localeCompare(b.company);
    }

    if (sortBy === "company-desc") {
      return b.company.localeCompare(a.company);
    }

    if (sortBy === "date-asc") {
      return new Date(a.dateApplied) - new Date(b.dateApplied);
    }

    if (sortBy === "date-desc") {
      return new Date(b.dateApplied) - new Date(a.dateApplied);
    }

    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(
    sortedApplications.length / applicationsPerPage
  );

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex = (safeCurrentPage - 1) * applicationsPerPage;

  const currentApplications = sortedApplications.slice(
    startIndex,
    startIndex + applicationsPerPage
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading applications...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400">{error}</p>

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

      {/* Page heading */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Job Applications
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage and track all your job applications.
          </p>
        </div>

        <Link
          to="/applications/new"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Add Application
        </Link>
      </section>

      {/* Total applications */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Applications
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {applications.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Matching Applications
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {sortedApplications.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current Page
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {totalPages === 0 ? 0 : safeCurrentPage}
            <span className="text-lg font-medium text-gray-400">
              {" "}/ {totalPages}
            </span>
          </h2>
        </div>
      </section>

      {/* Search and filters */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Search and Filters
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <input
            type="text"
            placeholder="Search company or role..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-950"
          />

          <select
            value={selectedStatus}
            onChange={(event) => {
              setSelectedStatus(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="company-asc">Company A-Z</option>
            <option value="company-desc">Company Z-A</option>
          </select>

        </div>
      </section>

      {/* Applications list */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-5 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Applications
          </h2>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {currentApplications.length} of {sortedApplications.length}
          </span>
        </div>

        {currentApplications.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No applications found
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or filter options.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentApplications.map((application) => (
              <Link
                key={application.id}
                to={`/applications/${application.id}`}
                className="flex flex-wrap items-center justify-between gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {application.company}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {application.role}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Applied: {application.dateApplied || "Not applied yet"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {application.status}
                  </span>

                  <span className="text-sm text-gray-400">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 p-5 dark:border-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {totalPages === 0 ? 0 : safeCurrentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Previous
            </button>

            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={totalPages === 0 || safeCurrentPage === totalPages}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ApplicationsList;
