
import ApplicationForm from "./components/ApplicationForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addApplication } from "./applicationsSlice";

function CreateApplication() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSaving = useSelector(
    (state) => state.applications.createStatus === "loading"
  );

  const createError = useSelector(
    (state) => state.applications.createError
  );

  const handleCreate = async (formValues) => {
    const now = new Date().toISOString();

    const applicationData = {
      ...formValues,

      salaryMin:
        formValues.salaryMin === ""
          ? null
          : Number(formValues.salaryMin),

      salaryMax:
        formValues.salaryMax === ""
          ? null
          : Number(formValues.salaryMax),

      statusHistory: [
        {
          status: formValues.status,
          changedAt: now,
        },
      ],

      createdAt: now,
      updatedAt: now,
    };

    try {
      await dispatch(addApplication(applicationData)).unwrap();
      navigate("/applications");
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Application
        </h1>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter the company and job details to track your application.
        </p>
      </div>

      {createError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {createError}
        </div>
      )}

      <ApplicationForm
        onSubmit={handleCreate}
        isSaving={isSaving}
        submitLabel="Create Application"
      />
    </div>
  );
}

export default CreateApplication;
