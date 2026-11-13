
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import ApplicationForm from "./components/ApplicationForm";

import {
  fetchApplicationById,
  editApplication,
} from "./applicationsSlice";

import {
  selectSelectedApplication,
  selectDetailsStatus,
  selectDetailsError,
} from "./applicationsSelectors";

function EditApplication() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const application = useSelector(selectSelectedApplication);
  const status = useSelector(selectDetailsStatus);
  const error = useSelector(selectDetailsError);

  const isSaving = useSelector(
    (state) => state.applications.updateStatus === "loading"
  );

  const updateError = useSelector(
    (state) => state.applications.updateError
  );

  useEffect(() => {
    dispatch(fetchApplicationById(id));
  }, [dispatch, id]);

  const handleUpdate = async (formValues) => {
    const now = new Date().toISOString();

    const updatedApplication = {
      ...application,
      ...formValues,

      salaryMin:
        formValues.salaryMin === ""
          ? null
          : Number(formValues.salaryMin),

      salaryMax:
        formValues.salaryMax === ""
          ? null
          : Number(formValues.salaryMax),

      updatedAt: now,

      statusHistory:
        formValues.status !== application.status
          ? [
              ...application.statusHistory,
              {
                status: formValues.status,
                changedAt: now,
              },
            ]
          : application.statusHistory,
    };

    try {
      await dispatch(
        editApplication({
          id,
          applicationData: updatedApplication,
        })
      ).unwrap();

      navigate(`/applications/${id}`);
    } catch (error) {
      console.error("Failed to update application:", error);
    }
  };

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Loading application...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="font-semibold text-red-700 dark:text-red-300">
          Unable to load application
        </h2>

        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
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

  if (!application || String(application.id) !== id) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Application not found
        </h2>

        <button
          onClick={() => navigate("/applications")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Application
        </h1>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Update the job details and application status.
        </p>
      </div>

      {updateError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {updateError}
        </div>
      )}

      <ApplicationForm
        initialValues={application}
        onSubmit={handleUpdate}
        isSaving={isSaving}
        submitLabel="Update Application"
      />
    </div>
  );
}

export default EditApplication;
